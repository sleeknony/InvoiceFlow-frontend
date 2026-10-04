import CompanyTab from "./tabs/CompanyTab";
import BrandingTab from "./tabs/BrandingTab";
import DocumentsTab from "./tabs/DocumentsTab";
import PaymentTab from "./tabs/PaymentTab";
import AdvancedTab from "./tabs/AdvancedTab";
import ApiAccessTab from "./tabs/ApiAccessTab";
import "./Settings.css";
import { getSettings, updateSettings, uploadLogo, uploadSignature, toggleSignature } from "../../services/settingsService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Settings() {

    const [activeTab, setActiveTab] = useState("company");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({

        companyName: "",
        address: "",
        email: "",
        phone: "",
        website: "",
        registrationNumber: "",
        taxNumber: "",
        currency: "NGN",
        defaultVatRate: 7.5,
        logoUrl: "",
        footerText: "",
        documentTemplate: "Modern",
        primaryColor: "#0d6efd",
        secondaryColor: "#f8f9fa",
        accentColor: "#e7f1ff",
        fontFamily: "Inter",
        bankName: "",
        accountName: "",
        accountNumber: "",
        swiftCode: "",
        iban: "",
        sortCode: "",
        paymentInstructions: "",
        enableApprovalWorkflow: false,
        requireApprovalForInvoices: false,
        requireApprovalForQuotes: false,
        requireApprovalForPurchaseOrders: false,
        requireApprovalForProformaInvoices: false,
        approvalLevelsRequired:1,
        enableMultiLevelApproval: false

    });

    const [documentPolicy, setDocumentPolicy] =
        useState({
            subscriptionPlan: "Free",
            templateLimit: 1,
            maxDocumentPages: 1,
            availableTemplates: []
        });

    useEffect(() => {

        loadSettings();
       
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);

            const settings =
                await getSettings();
            
            if (settings) {
                setForm(prev => ({
                    ...prev,
                    ...settings
                }));

                setDocumentPolicy({

                    subscriptionPlan:
                        settings.subscriptionPlan ?? "Free",

                    maxDocumentPages:
                        settings.maxDocumentPages === undefined
                            ? 1
                            : settings.maxDocumentPages,

                    templateLimit:
                        settings.templateLimit === undefined
                            ? 1
                            : settings.templateLimit,

                    availableTemplates:
                        settings.availableTemplates ?? []

                });

            }
        }
        catch (err) {
            console.error(err);

            toast.error(
                "Unable to load settings."
            );
        }
        finally {
            setLoading(false);
        }
    }

    async function saveSettings() {

        try {

            setSaving(true);
        
            await updateSettings(form);
                 toast.success(
                "Settings saved successfully."
            );

        }
        catch (err) {

            console.error(err);

            toast.error(
                "Unable to save settings."
            );

        }
        finally {

            setSaving(false);

        }

    }

    const handleSignatureUpload = async (file) => {

        const settings =
            await uploadSignature(file);

        setForm(settings);
    };

    const handleSignatureToggle = async (checked) => {

        const settings =
            await toggleSignature(checked);

        setForm(settings);
    };

    function renderTab() {

        switch (activeTab) {

            case "company":

                return (
                    <CompanyTab
                        form={form}
                        setForm={setForm}
                    />
                );

            case "branding":

                return (
                    <BrandingTab
                        form={form}
                        setForm={setForm}
                        uploadLogo={async (file) => {

                            const updated =
                                await uploadLogo(file);

                            setForm(updated);

                            toast.success("Logo uploaded.");

                        }}
                    />
                );

            case "documents":

                return (
                    <DocumentsTab
                        form={form}
                        setForm={setForm}
                        documentPolicy={documentPolicy}
                    />
                );

            case "payment":

                return (
                    <PaymentTab
                        form={form}
                        setForm={setForm}
                    />
                );

            case "footer":

                return (
                    <FooterTab
                        form={form}
                        setForm={setForm}
                    />
                );

            case "advanced":

                return (
                    <AdvancedTab
                        form={form}
                        setForm={setForm}
                        onSignatureUpload={handleSignatureUpload}
                        onSignatureToggle={handleSignatureToggle}
                    />
                );

            //case "api-access":

            //    return (
            //        <ApiAccessTab />
            //    );

            default:

                return null;

        }

    }

    if (loading) {

        return (

            <div className="text-center p-5">

                Loading settings...

            </div>

        );

    }

    return (
        <>
            {/* ==========================================
            PAGE HEADER
        ========================================== */}

            <div className="settings-header">

                <div>

                    <h2 className="settings-page-title">
                        Settings
                    </h2>

                    <p className="settings-page-subtitle">
                        Configure your invoiceNgine workspace.
                    </p>

                </div>

                {activeTab !== "api-access" && (

                    <button
                        className="btn btn-primary settings-save-btn"
                        onClick={saveSettings}
                        disabled={saving}
                    >
                        <i className="bi bi-check2-circle me-2"></i>

                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                )}

            </div>

            {/* ==========================================
            MAIN LAYOUT
        ========================================== */}

            <div className="settings-layout">

                {/* ================================
                SIDEBAR
            ================================= */}

                <aside className="settings-sidebar">

                    <div className="settings-sidebar-header">

                        <i className="bi bi-sliders2"></i>

                        <span>
                            Configuration
                        </span>

                    </div>

                    <nav className="settings-nav">

                        <button
                            className={`settings-nav-item ${activeTab === "company" ? "active" : ""}`}
                            onClick={() => setActiveTab("company")}
                        >
                            <i className="bi bi-building"></i>

                            Company
                        </button>

                        <button
                            className={`settings-nav-item ${activeTab === "branding" ? "active" : ""}`}
                            onClick={() => setActiveTab("branding")}
                        >
                            <i className="bi bi-palette"></i>

                            Branding
                        </button>

                        <button
                            className={`settings-nav-item ${activeTab === "documents" ? "active" : ""}`}
                            onClick={() => setActiveTab("documents")}
                        >
                            <i className="bi bi-file-earmark-text"></i>

                            Documents
                        </button>

                        <button
                            className={`settings-nav-item ${activeTab === "payment" ? "active" : ""}`}
                            onClick={() => setActiveTab("payment")}
                        >
                            <i className="bi bi-credit-card"></i>

                            Payment
                        </button>

                        <button
                            className={`settings-nav-item ${activeTab === "advanced" ? "active" : ""}`}
                            onClick={() => setActiveTab("advanced")}
                        >
                            <i className="bi bi-gear"></i>

                            Advanced
                        </button>

                        {/*<button*/}
                        {/*    className={`settings-nav-item ${activeTab === "api-access"*/}
                        {/*            ? "active"*/}
                        {/*            : ""*/}
                        {/*        }`}*/}
                        {/*    onClick={() =>*/}
                        {/*        setActiveTab("api-access")*/}
                        {/*    }*/}
                        {/*>*/}
                        {/*    <i className="bi bi-key"></i>*/}

                        {/*    API Access*/}
                        {/*</button>*/}

                    </nav>

                </aside>

                {/* ================================
                CONTENT
            ================================= */}

                <main className="settings-content">

                    <div className="settings-panel">

                        {renderTab()}

                    </div>

                </main>
               

            </div>

        </>
    );

}

