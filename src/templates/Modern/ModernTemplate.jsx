import "./ModernTemplate.css";
import ThemeProvider from "../ThemeProvider";
import { getDocumentConfig }  from "../config/documentConfigService";
import DocumentHeader from "../../shared/DocumentHeader/DocumentHeader";
import DocumentAddresses from "../../shared/DocumentAddresses/DocumentAddresses";
import DocumentRecipient from "../../shared/DocumentRecipient/DocumentRecipient";
import ItemsTable from "../../shared/ItemsTable/ItemsTable";
import TotalsSection from "../../shared/TotalsSection/TotalsSection";
import PaymentSection from "../../shared/PaymentSection/PaymentSection";
import SignatureSection from "../../shared/SignatureSection/SignatureSection";
import DocumentFooter from "../../shared/DocumentFooter/DocumentFooter";

export default function ModernTemplate({

    document,

    settings

}) {

    if (!document) { return null; }

    const config =
        getDocumentConfig(
            document?.type || "Invoice"
        );

    const templateProps = {

        document,

        settings,

        config,

        customer:document.customer,

    };

    return (

        <ThemeProvider

            settings={settings}

            config={config}

        >

            <div className="modern-template">

                <DocumentHeader {...templateProps} />

                <DocumentAddresses {...templateProps }/>

                {/*<DocumentRecipient {...templateProps} />*/}

                <ItemsTable {...templateProps} />

                <TotalsSection {...templateProps} />

                <PaymentSection {...templateProps} />

                <SignatureSection {...templateProps} />

                <DocumentFooter {...templateProps} />

            </div>

        </ThemeProvider>

    );

}