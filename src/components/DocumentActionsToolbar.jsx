import { Link } from "react-router-dom";

export default function DocumentActionsToolbar({
    document,
    onPrint,
    onDownload,
    onEmail,
    onDuplicate,
    onDelete,
    onConvert,
    onEdit
}) {
    const canConvert =
        document.type === "Quote";

   const canEdit =
       document.status === "Draft";

    return (
        <div className="card shadow-sm border-0 mb-3">
            <div className="card-body py-2">
                <div className="d-flex flex-wrap gap-2">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={onPrint}
                    >
                        <i className="bi bi-printer me-1"></i>
                        Print
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={onDownload}
                    >
                        <i className="bi bi-download me-1"></i>
                        Download
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={onEmail}
                    >
                        <i className="bi bi-envelope me-1"></i>
                        Email
                    </button>

                    {(
                        document.status === "Draft" ||
                        document.status === "Rejected"
                    ) && (
                            <button
                                className="btn btn-outline-primary"
                                onClick={onDuplicate}
                            >
                                Duplicate
                            </button>
                        )}

                    {document.status === "Draft" && (
                        <button
                            className="btn btn-primary"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                    )}

                    {canConvert && (
                        <button
                            className="btn btn-outline-primary"
                            onClick={onConvert}
                        >
                            <i className="bi bi-arrow-repeat me-1"></i>
                            Convert to Invoice
                        </button>
                    )}

                    {document.status === "Draft" && (
                        <button
                            className="btn btn-danger"
                            onClick={onDelete}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}