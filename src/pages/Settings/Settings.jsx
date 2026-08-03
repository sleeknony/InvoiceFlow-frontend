import CompanyTab from "./tabs/CompanyTab";
import BrandingTab from "./tabs/BrandingTab";
import DocumentsTab from "./tabs/DocumentsTab";
import PaymentTab from "./tabs/PaymentTab";
import FooterTab from "./tabs/FooterTab";
import AdvancedTab from "./tabs/AdvancedTab";

import SettingsPreview from "./preview/SettingsPreview";

import "./Settings.css";
import {
    getSettings,
    updateSettings,
    uploadLogo
} from "../../services/settingsService";

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
                    />
                );

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

        /*<div className="settings-layout">*/

        <>
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3>Settings</h3>

                    <small className="text-muted">
                        Configure your InvoiceFlow workspace
                    </small>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={saveSettings}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>

            </div>

            <div className="settings-layout">
          

            <div className="settings-left">

                    <div className="settings-tabs">

                        <button
                            className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
                            onClick={() => setActiveTab("company")}
                        >
                            <i className="bi bi-building"></i>
                            <span>Company</span>
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "branding" ? "active" : ""}`}
                            onClick={() => setActiveTab("branding")}
                        >
                            <i className="bi bi-palette"></i>
                            <span>Branding</span>
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
                            onClick={() => setActiveTab("documents")}
                        >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Documents</span>
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "payment" ? "active" : ""}`}
                            onClick={() => setActiveTab("payment")}
                        >
                            <i className="bi bi-credit-card"></i>
                            <span>Payment</span>
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "footer" ? "active" : ""}`}
                            onClick={() => setActiveTab("footer")}
                        >
                            <i className="bi bi-layout-text-window"></i>
                            <span>Footer</span>
                        </button>

                        <button
                            className={`tab-btn ${activeTab === "advanced" ? "active" : ""}`}
                            onClick={() => setActiveTab("advanced")}
                        >
                            <i className="bi bi-gear"></i>
                            <span>Advanced</span>
                        </button>

                    </div>

                <div className="settings-panel">

                    {renderTab()}

                </div>

            </div>

            {/*<div className="settings-right">*/}

            {/*    <SettingsPreview*/}

            {/*        settings={form}*/}

            {/*    />*/}

                {/*</div>*/}

                <div className="settings-right">
                    <h5>Live Preview</h5>

                    <SettingsPreview settings={form} />
                </div>

            </div>
        </>
       
    );

}

