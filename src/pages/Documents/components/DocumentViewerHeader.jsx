import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import DocumentStatusBadge from "../../../components/documentStatusBadge";
import currencySymbol from "../../../utils/currency";
import "./DocumentViewer.css";

export default function DocumentViewerHeader({
    document,
    onBack
}) {

    if (!document)
        return null;

    return (

        <div className="dv-header">

            <div className="dv-header-left">

                <button
                    className="dv-back-btn"
                    onClick={onBack}
                    type="button"
                >
                    <FiArrowLeft/>
                    <span>Back to Documents</span>
                </button>

                <div className="dv-document-title">

                    <h2>

                        {document.documentNumber}

                    </h2>

                    <div className="dv-document-meta">

                        <span>

                            {document.type}

                        </span>

                        <span className="dv-divider">

                            <FiArrowRight />

                        </span>

                        <span>

                            {document.customerName}

                        </span>

                    </div>

                </div>

            </div>

            <div className="dv-header-right">

                <div className="dv-status">

                    <DocumentStatusBadge
                        status={document.status}
                    />

                </div>

                <div className="dv-total">

                    {currencySymbol(
                        document.total,
                        document.currency
                    )}

                </div>

            </div>

        </div>

    );

}