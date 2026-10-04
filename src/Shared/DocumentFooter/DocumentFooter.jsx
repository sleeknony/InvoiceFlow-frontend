import "./DocumentFooter.css";

import PrintableSection  from "../../renderer/PrintableSection";

import { useRenderDocument} from "../../renderer/RenderContext";
import { useDocument } from "../../renderer/RenderContext";

export default function DocumentFooter() {

    const {

        company,

        features,

        flags

    } = useDocument();

    if (!features.showFooter)
        return null;

    const footerText =
        company.footer?.text;

    

    return (

        <PrintableSection type="footer">

            <footer className="document-footer">

                {footerText && (

                    <div className="footer-message">

                        {footerText}

                    </div>

                )}

                <div className="footer-divider" />

                <div className="footer-meta">

                    <span>

                        © {new Date().getFullYear()} {company.name}

                    </span>

                    {flags.showinvoiceNgineBranding && (

                        <span className="footer-brand">

                            Powered by <strong>invoiceNgine</strong>

                        </span>

                    )}

                </div>

            </footer>

        </PrintableSection>

    );

}