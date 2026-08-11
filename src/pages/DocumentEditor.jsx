import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LineItemsTable from "../components/LineItemsTable.jsx";
import { calcTotals } from "../utils/calc.jsx";
import { getCustomers } from "../services/customerService";
import { createDocument, updateDocument,  getDocument,} from "../services/documentService";
import { getSettings, getBankAccounts } from "../services/settingsService";
import toast from "react-hot-toast";
import { DOCUMENT_BEHAVIOR } from "../components/documentBehavior";
import DocumentHeader from "../components/DocumentHeader/DocumentHeader.jsx";
import CustomerCard from "../components/CustomerSection/CustomerCard.jsx";
import DocumentDetailsCard from "../components/DocumentSection/DocumentDetailsCard.jsx";
import AddressCard from "../components/AddressSection/AddressCard.jsx";
import NotesCard from "../components/NotesSection/NotesCard.jsx";
import TotalsSidebar from "../components/TotalsSection/TotalsSidebar.jsx";
import PaymentSidebar from "../components/PaymentSection/PaymentSidebar.jsx";

export default function DocumentEditor({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [settings, setSettings] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [selectedBankAccountId, setSelectedBankAccountId] =  useState(null);

    const [doc, setDoc] = useState({
        id: id || null,
        type: "Invoice",
        documentNumber: "",
        customerId: "",
        companyBankAccountId: null,
        currency: "NGN",
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
        validityDate: "",
        deliveryDate: "",
        originalDocumentNumber: "",
        notes: "",
        billingAddress: "",
        shippingAddress: "",
        shippingCost: 0,
        sameAsCustomerAddress: true,
        sameAsBilling: true,
        purchaseOrderNumber: "",
        referenceNumber: "",
        deliveryMethod: "",
        trackingNumber: "",

        items: [
            {
                description: "",
                quantity: 1,
                unitPrice: 0,
                discountPercent: 0,
                taxRatePercent: 0
            }
        ]
    });

    const behavior =
        DOCUMENT_BEHAVIOR[doc.type] ??
        DOCUMENT_BEHAVIOR.Invoice;
    // =========================
    // LOAD SETTINGS
    // =========================
    useEffect(() => {
        loadSettings();
    }, []);
   

    async function loadSettings() {
        try {
            const settingsData = await getSettings();

           /* console.log("SETTINGS:", settingsData);*/

            setSettings(settingsData);
            if (mode === "create") {
                setDoc(prev => ({
                    ...prev,
                    currency:
                        settingsData.currency || "NGN"
                }));
            }
        }
        catch (err) {
            console.error("SETTINGS ERROR:", err);
        }
    }
  const logoSource =
    settings?.logoBase64 ||
    (
        settings?.logoUrl
            ? `${import.meta.env.VITE_API_URL}${settings.logoUrl}`
            : null
    );

    // =========================
    // LOAD BANK ACCOUNTS
    // =========================

    useEffect(() => {
        loadBankAccounts();
    }, []);

    async function loadBankAccounts() {

        try {

            const accounts =
                await getBankAccounts();

            console.log(
                "BANK ACCOUNTS:",
                accounts
            );

            setBankAccounts(accounts);

            if (mode === "create") {

                const defaultAccount =
                    accounts.find(
                        x => x.isDefault
                    ) ?? accounts[0];

                if (defaultAccount) {

                    setDoc(prev => ({
                        ...prev,
                        companyBankAccountId:
                            defaultAccount.id
                    }));

                }
            }

        }
        catch (err) {

            toast.error(
                "Failed to load bank accounts",
                err
            );

        }
    }

    // =========================
    // LOAD CUSTOMERS
    // =========================
    useEffect(() => {
        async function loadCustomers() {
            try {
                const res = await getCustomers();
                setCustomers(res.data);
            } catch (error) {
                console.error("Failed to load customers", error);
            }
        }

        loadCustomers();
    }, []);

    // =========================
    // LOAD DOCUMENT (EDIT MODE)
    // =========================
    useEffect(() => {
        if (mode !== "edit" || !id) return;

        async function loadDocument() {
            try {
                const document = await getDocument(id);

               /* console.log("EDIT DOCUMENT:", document);*/

                setDoc({
                    id: document.id,
                    type: document.type ?? "Invoice",
                    documentNumber:
                        document.documentNumber ?? "",
                    customerId:
                        document.customerId ?? "",

                    companyBankAccountId:
                        document.companyBankAccountId ?? null,

                    currency:
                        document.currency ?? "NGN",

                    issueDate:
                        document.issueDate
                            ?.split("T")[0] ?? "",

                    dueDate:
                        document.dueDate
                            ?.split("T")[0] ?? "",

                    validityDate:
                        document.validityDate
                            ?.split("T")[0] ?? "",

                    deliveryDate:
                        document.deliveryDate
                            ?.split("T")[0] ?? "",

                    originalDocumentNumber:
                        document.originalDocumentNumber ?? "",

                    notes:
                        document.notes ?? "",

                    billingAddress:
                        document.billingAddress ?? "",

                    shippingAddress:
                        document.shippingAddress ?? "",

                    shippingCost:
                        document.shippingCost ?? 0,

                    sameAsCustomerAddress:
                        document.sameAsCustomerAddress ?? true,

                    sameAsBilling:
                        document.sameAsBilling ?? true,

                    purchaseOrderNumber:
                        document.purchaseOrderNumber ?? "",

                    referenceNumber:
                        document.referenceNumber ?? "",

                    deliveryMethod:
                        document.deliveryMethod ?? "",

                    trackingNumber:
                        document.trackingNumber ?? "",

                    items:
                        document.items?.length
                            ? document.items
                            : [
                                {
                                    description: "",
                                    quantity: 1,
                                    unitPrice: 0,
                                    discountPercent: 0,
                                    taxRatePercent: 0
                                }
                            ]
                });
            }
            catch (error) {
                console.error(
                    "Failed to load document",
                    error
                );
            }
        }

        loadDocument();
    }, [mode, id]);


    const selectedCustomer =
        customers.find(
            x => x.id === doc.customerId
        );
    // =========================
    // TOTALS
    // =========================
    //const totals = useMemo(() => {
    //    return calcTotals(doc.items || []);
    //}, [doc.items]);

    const totals = useMemo(() => {
        return calcTotals(
            doc.items || [],
            doc.shippingCost || 0
        );
    }, [doc.items, doc.shippingCost]);

    const cleanDate = (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return null;
        }

        return value;
    };
    

    async function saveDraft() {
        try {
            setLoading(true);

            const payload = {
                ...doc,

                issueDate: cleanDate(doc.issueDate),
                dueDate: cleanDate(doc.dueDate),
                validityDate: cleanDate(doc.validityDate),
                deliveryDate: cleanDate(doc.deliveryDate),

                items: doc.items.map(x => ({
                    id: x.id || null,
                    description: x.description || "",
                    quantity: Number(x.quantity || 0),
                    unitPrice: Number(x.unitPrice || 0),
                    discountPercent: Number(x.discountPercent || 0),
                    taxRatePercent: Number(x.taxRatePercent || 0)
                })),

                subtotal: totals.subTotal,
                discountTotal: totals.discountTotal,
                taxTotal: totals.taxTotal,
                total: totals.total
            };

            
            if (mode === "edit") {
                //console.table(
                //    payload.items.map(item => ({
                //        id: item.id,
                //        type: typeof item.id,
                //        description: item.description
                //    }))
                //);
                await updateDocument(doc.id, payload);
                localStorage.removeItem("draftDocument");
                toast.success("Document updated successfully");
                navigate("/documents");
            } else {
               

                const created = await createDocument(payload);

              
                if (!created || !created.id) {
                    throw new Error("API did not return the created document.");
                }

       
                localStorage.removeItem("draftDocument");

                toast.success("Document saved successfully");

                navigate(`/documents/${created.id}`);
            }

            
           /* navigate("/documents");*/
        }
        catch (err) {
            console.error("SAVE ERROR:", err);

            toast.error("Failed to save document");
        }

        finally {
            setLoading(false);
        }

    }


    useEffect(() => {
        const draft = localStorage.getItem("draftDocument");

        if (draft && mode === "create") {
            try {
                setDoc(JSON.parse(draft));
            } catch {
                localStorage.removeItem("draftDocument");
            }
        }
    }, []);

    useEffect(() => {
        if (mode === "create") {
            localStorage.setItem(
                "draftDocument",
                JSON.stringify(doc)
            );
        }
    }, [doc, mode]);

    useEffect(() => {

        if (
            doc.sameAsCustomerAddress &&
            selectedCustomer
        ) {
            setDoc(prev => ({
                ...prev,
                billingAddress:
                    selectedCustomer.address || ""
            }));
        }

    }, [
        selectedCustomer?.id,
        doc.sameAsCustomerAddress
    ]);

    return (
        <div>

            <DocumentHeader
                mode={mode}
                documentType={doc.type}
                documentNumber={doc.documentNumber}
                logo={logoSource}
                loading={loading}
                onBack={() => navigate(-1)}
                onSave={saveDraft}
                onPreview={() => { }}
                onSend={() => { }}
            />

            <div className="container-fluid px-0">

                <div className="row g-4">

                    {/* LEFT */}

                    <div className="col-xl-8">

                        <CustomerCard
                            behavior={behavior}
                            customers={customers}
                            customerId={doc.customerId}
                            onCustomerChange={(customerId) => {

                                const customer =
                                    customers.find(
                                        x => String(x.id) === String(customerId)
                                    );

                                setDoc(prev => {

                                    const updated = {
                                        ...prev,
                                        customerId,
                                        billingAddress: customer?.address || ""
                                    };

                                    console.log(
                                        "New billing address:",
                                        updated.billingAddress
                                    );

                                    return updated;
                                });
                            }}
                            onCreateCustomer={() =>
                                navigate("/customers/create")
                            }
                            onEditCustomer={(id) =>
                                navigate(`/customers/${id}`)
                            }
                        />

                        <div className="mt-4">

                            <DocumentDetailsCard
                                doc={doc}
                                setDoc={setDoc}
                                behavior={behavior}
                                mode={mode}
                            />

                        </div>

                        <div className="mt-4">

                            <AddressCard
                                doc={doc}
                                setDoc={setDoc}
                                behavior={behavior}
                                customerAddress={selectedCustomer?.address || ""}
                            />

                        </div>

                       

                    </div>

                    {/* RIGHT */}

                    <div className="col-xl-4">

                        <div
                            className="position-sticky"
                            style={{ top: 20 }}>

                            <TotalsSidebar
                                totals={totals}
                                currency={doc.currency}
                                behavior={behavior}
                            />

                            {

                                behavior.showPaymentSection &&
                                settings && (
                                    <PaymentSidebar
                                        bankAccounts={bankAccounts}
                                    />

                                )

                            }

                        </div>

                    </div>

                </div>
                <div className="mt-4">

                    <LineItemsTable
                        items={doc.items || []}
                        onChange={(items) =>
                            setDoc(prev => ({
                                ...prev,
                                items
                            }))
                        }
                        defaultVatRate={
                            settings?.defaultVatRate ?? 0
                        }
                        allowNegativeItems={
                            behavior.allowNegativeItems
                        }
                    />

                </div>

                <div className="mt-4 mb-5">

                    <NotesCard
                        doc={doc}
                        setDoc={setDoc}
                    />

                </div>

            </div>
            

          
        </div>
    );
}