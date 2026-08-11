import { Link } from "react-router-dom";
import {
    FiMoreVertical
} from "react-icons/fi";
import DocumentTypeBadge from "../../components/DocumentTypeBadge";
import DocumentStatusBadge from "../../components/documentStatusBadge";

import currencySymbol from "../../utils/currency";

export default function DocumentRow({

    document,

    onMenu,

    open,

    children

}) {

    return (

        <div className="document-row">

            <div className="document-row-left">

                <Link

                    className="document-number"

                    to={`/documents/${document.id}`}

                >

                    {document.documentNumber}

                </Link>

                <span className="document-meta">

                    {new Date(
                        document.issueDate
                    ).toLocaleDateString()}

                </span>

            </div>


            <div className="document-row-customer">

                <strong>

                    {document.customerName}

                </strong>

                <small>

                    {document.customerEmail}

                </small>

            </div>


            <div>

                <DocumentTypeBadge

                    type={document.type}

                />

            </div>


            <div>

                <DocumentStatusBadge

                    status={document.status}

                />

            </div>


            <div className="document-amount">

                {currencySymbol(

                    document.total,

                    document.currency

                )}

            </div>


            <div className="document-row-actions">

                <button

                    className="document-menu-btn"

                    onClick={onMenu}

                >

                    <FiMoreVertical />

                </button>

                {open && children}

            </div>

        </div>

    );

}