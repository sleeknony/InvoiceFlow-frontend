import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import LineItemsTable from "../components/LineItemsTable.jsx";
import currencySymbol from "../utils/currency.jsx";
import { DOCUMENT_TYPES } from "../utils/constants.jsx";
import { CURRENCIES } from "../utils/constants.jsx";
import { calcTotals } from "../utils/calc.jsx";
import { getCustomers } from "../services/customerService";
import { createDocument, updateDocument,  getDocument} from "../services/documentService";
import { getSettings } from "../services/settingsService";
import toast from "react-hot-toast";
import { DOCUMENT_BEHAVIOR } from "../components/documentBehavior";


export default function DocumentEditor({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [settings, setSettings] = useState(null);

    const [doc, setDoc] = useState({
        id: id || null,
        type: "Invoice",
        documentNumber: "",
        customerId: "",
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

                console.log("EDIT DOCUMENT:", document);

                setDoc({
                    id: document.id,
                    type: document.type ?? "Invoice",
                    documentNumber:
                        document.documentNumber ?? "",
                    customerId:
                        document.customerId ?? "",
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
    // =========================
    // SAVE
    // =========================
    //async function saveDraft() {
    //    try {
    //        setLoading(true);

    //        const payload = {
    //            ...doc,
    //            subtotal: totals.subTotal,
    //            discountTotal: totals.discountTotal,
    //            taxTotal: totals.taxTotal,
    //            total: totals.total
    //        };

    //        if (mode === "edit") {
    //            await updateDocument(doc.id, payload);
    //        } else {
    //            await createDocument(payload);
    //        }

    //        toast.success("Document saved successfully");
    //        navigate("/documents");
    //    } catch (error) {
    //        console.error(error);
    //        toast.error("Failed to save document");
    //    } finally {
    //        setLoading(false);
    //    }
    //}

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

            //const payload = {
            //    ...doc,

            //    issueDate: doc.issueDate || null,
            //    dueDate: doc.dueDate || null,
            //    validityDate: doc.validityDate || null,
            //    deliveryDate: doc.deliveryDate || null,

            //    subtotal: totals.subTotal,
            //    discountTotal: totals.discountTotal,
            //    taxTotal: totals.taxTotal,
            //    total: totals.total
            //};

            console.log("DOCUMENT PAYLOAD:", payload);

            if (mode === "edit") {
                await updateDocument(doc.id, payload);
                localStorage.removeItem("draftDocument");
                toast.success("Document updated successfully");
                navigate("/documents");
            } else {
                /*await createDocument(payload);*/
              /*  const response = await createDocument(payload);*/

              /*  const created = response.data;*/

                const created = await createDocument(payload);

                console.log("CREATED:", created);

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

            if (err.response) {
                console.log(
                    JSON.stringify(err.response.data, null, 2)
                );

                console.log("STATUS:", err.response.status);
                console.log("DATA:", err.response.data);
            } else {
                console.log("NO RESPONSE FROM SERVER");
                console.log(err.message);
            }

            toast.error("Failed to save document");
        }

        finally {
            setLoading(false);
        }

        //catch (err) {
        //    console.error("SAVE ERROR:", err);
        //    console.log(JSON.stringify(err.response.data, null, 2));
        //    if (err.response) {
        //        console.log("STATUS:", err.response.status);
        //        console.log("DATA:", err.response.data);
        //    }

        //    toast.error("Failed to save document");
        //}
        //finally {
        //    setLoading(false);
        //}
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

    return (
        <div>
            <PageHeader
                title={
                    mode === "create"
                        ? "Create Document"
                        : "Edit Document"
                }
                subtitle="Invoices, Quotes, Receipts, Delivery Notes"
                actions={
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={saveDraft}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Draft"}
                        </button>
                    </div>
                }
            />

            <div className="row g-3 mt-2">
                {/* LEFT PANEL */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                            <div>
                                <h5 className="mb-0">
                                    Document Details
                                </h5>

                                <small className="text-muted">
                                    {doc.documentNumber || "No number assigned"}
                                </small>
                            </div>

                            {settings?.logoUrl && (
                                <img
                                    src={settings.logoUrl}
                                    alt="Company Logo"
                                    style={{
                                        maxHeight: "60px",
                                        maxWidth: "180px",
                                        objectFit: "contain"
                                    }}
                                />
                            )}
                        </div>

                        <div className="card-body">
                            <label className="form-label">
                                Document Type
                            </label>

                            <select
                                className="form-select mb-3"
                                value={doc.type}
                                onChange={(e) =>
                                    setDoc({
                                        ...doc,
                                        type: e.target.value
                                    })
                                }
                            >
                                {DOCUMENT_TYPES.map((t) => (
                                    <option
                                        key={t.value}
                                        value={t.value}
                                    >
                                        {t.label}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label">Document Number</label>
                            <input
                                className="form-control mb-3"
                                value={
                                    mode === "create"
                                        ? "Will be generated automatically"
                                        : doc.documentNumber || ""
                                }
                                disabled
                                readOnly
                            />

                            {/*<label className="form-label">*/}
                            {/*    Customer*/}
                            {/*</label>*/}
                            <label className="form-label">
                                {behavior.customerLabel}
                            </label>

                            <select
                                className="form-select mb-3"
                                value={doc.customerId || ""}
                                onChange={(e) =>
                                    setDoc({
                                        ...doc,
                                        customerId:
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value)
                                    })
                                }
                            >
                                <option value="">
                                    Select {behavior.customerLabel}
                                </option>

                                {customers.map((c) => (
                                    <option
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.companyName}
                                    </option>
                                ))}
                            </select>

                            <hr className="my-4" />

                            <h6 className="mb-3">
                                Billing & Shipping
                            </h6>

                            <div className="row g-3">

                                {/* Billing Address */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Billing Address
                                    </label>

                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        value={doc.billingAddress || ""}
                                        onChange={(e) => {
                                            const billing = e.target.value;

                                            setDoc(prev => ({
                                                ...prev,
                                                billingAddress: billing,
                                                shippingAddress: prev.sameAsBilling
                                                    ? billing
                                                    : prev.shippingAddress
                                            }));
                                        }}
                                    />
                                </div>

                                {/* Shipping Address */}
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Shipping Address
                                    </label>

                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        disabled={doc.sameAsBilling}
                                        value={
                                            doc.sameAsBilling
                                                ? doc.billingAddress
                                                : doc.shippingAddress || ""
                                        }
                                        onChange={(e) =>
                                            setDoc({
                                                ...doc,
                                                shippingAddress: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                {/* Same Address */}
                                <div className="col-12">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="sameAddress"
                                            checked={doc.sameAsBilling ?? false}
                                            onChange={(e) =>
                                                setDoc(prev => ({
                                                    ...prev,
                                                    sameAsBilling: e.target.checked,
                                                    shippingAddress:
                                                        e.target.checked
                                                            ? prev.billingAddress
                                                            : (prev.shippingAddress || "")
                                                }))
                                            }
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="sameAddress"
                                        >
                                            Shipping address is the same as billing address
                                        </label>
                                    </div>
                                </div>

                                {/* Shipping Cost */}
                                {behavior.showShippingCost && (
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Shipping Cost
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            value={doc.shippingCost || 0}
                                            onChange={(e) =>
                                                setDoc({
                                                    ...doc,
                                                    shippingCost: Number(e.target.value)
                                                })
                                            }
                                        />
                                    </div>
                                )}

                            </div>

                            {behavior.showOriginalInvoiceNumber && (
                                <>
                                    <label className="form-label mt-3">
                                        Original Invoice Number
                                    </label>

                                    <input
                                        className="form-control mb-3"
                                        value={doc.originalDocumentNumber || ""}
                                        onChange={(e) =>
                                            setDoc({
                                                ...doc,
                                                originalDocumentNumber: e.target.value
                                            })
                                        }
                                    />
                                </>
                            )}

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Currency
                                    </label>

                                    <select
                                        className="form-select"
                                        value={doc.currency || "NGN"}
                                        onChange={(e) =>
                                            setDoc({
                                                ...doc,
                                                currency: e.target.value
                                            })
                                        }
                                    >
                                        {CURRENCIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">
                                        Issue Date
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        value={ doc.issueDate || "" }
                                        onChange={(e) =>
                                            setDoc({
                                                ...doc,
                                                issueDate: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                {behavior.showValidityDate && (
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Valid Until
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={doc.validityDate || ""}
                                            onChange={(e) =>
                                                setDoc({
                                                    ...doc,
                                                    validityDate: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                {behavior.showDueDate && (
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Due Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={doc.dueDate || ""}
                                            onChange={(e) =>
                                                setDoc({
                                                    ...doc,
                                                    dueDate: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                {behavior.showDeliveryDate && (
                                    <div className="col-md-4">
                                        <label className="form-label">
                                            Delivery Date
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={doc.deliveryDate || ""}
                                            onChange={(e) =>
                                                setDoc({
                                                    ...doc,
                                                    deliveryDate:
                                                        e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <label className="form-label mt-3">
                                Notes
                            </label>

                            <textarea
                                rows="4"
                                className="form-control"
                                value={doc.notes || ""}
                                onChange={(e) =>
                                    setDoc({
                                        ...doc,
                                        notes: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Totals</h5>
                        </div>

                        {behavior.showPaymentSection && settings && (
                            <div className="card shadow-sm border-0 mt-3">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">
                                        Payment Information
                                    </h5>
                                </div>

                                <div className="card-body">

                                    <div className="mb-2">
                                        <strong>Bank:</strong>
                                        <br />
                                        {settings.bankName}
                                    </div>

                                    <div className="mb-2">
                                        <strong>Account Name:</strong>
                                        <br />
                                        {settings.accountName}
                                    </div>

                                    <div className="mb-2">
                                        <strong>Account Number:</strong>
                                        <br />
                                        {settings.accountNumber}
                                    </div>

                                    {settings.paymentInstructions && (
                                        <div className="mt-3">
                                            <strong>
                                                Payment Instructions
                                            </strong>
                                            <p className="mb-0">
                                                {settings.paymentInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <span>
                                    {currencySymbol(
                                        totals.subTotal,
                                        doc.currency
                                    )}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between">
                                <span>Discount</span>
                                <span>{currencySymbol(totals.discountTotal, doc.currency)}</span>

                            </div>

                            <div className="d-flex justify-content-between">
                                <span>Tax</span>
                                <span>
                                    {currencySymbol(
                                        totals.taxTotal,
                                        doc.currency
                                    )}
                                </span>
                            </div>

                            {behavior.showShippingCost && (
                                <div className="d-flex justify-content-between">
                                    <span>Shipping</span>
                                    <span>
                                        {currencySymbol(
                                            totals.shippingCost,
                                            doc.currency
                                        )}
                                    </span>
                                </div>
                            )}

                            <hr />

                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>
                                    {currencySymbol(
                                        totals.total,
                                        doc.currency
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LINE ITEMS */}
            <div className="mt-3">
                <LineItemsTable
                    items={doc.items || []}
                    onChange={(items) =>
                        setDoc({
                            ...doc,
                            items
                        })
                    }
                    defaultVatRate={
                        settings?.defaultVatRate ?? 0
                    }
                    allowNegativeItems={
                        behavior.allowNegativeItems
                    }
                />
            </div>
        </div>
    );
}