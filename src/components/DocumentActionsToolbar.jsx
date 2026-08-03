export default function DocumentActionsToolbar({
    document,
    onDownload,
    onEmail,
    onDuplicate,
    onDelete,
    onConvert,
    onEdit,
    canConvertDocuments = false,
}) {

    // Convert applies only to Quote and Invoice.
    const isConvertibleDocument =
        document?.type === "Quote" ||
        document?.type === "Invoice";

    return (
        <div className="card shadow-sm border-0 mb-3 document-toolbar">
            <div className="card-body py-2">

                <div className="d-flex flex-wrap gap-2">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onDownload}
                    >
                        <i className="bi bi-download me-1" />
                        Download
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onEmail}
                    >
                        <i className="bi bi-envelope me-1" />
                        Email
                    </button>

                    {(document?.status === "Draft" ||
                        document?.status === "Rejected") && (
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={onDuplicate}
                            >
                                Duplicate
                            </button>
                        )}

                   
                    {/* CONVERT */}
                    {isConvertibleDocument && (
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled={!canConvertDocuments}
                            title={
                                canConvertDocuments
                                    ? "Convert document"
                                    : "Document conversion is not available on your current plan."
                            }
                            onClick={() => onConvert()}
                        >
                            <i className="bi bi-arrow-repeat me-1" />
                            Convert
                        </button>
                    )}

                    {document?.status === "Draft" && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                    )}

                    {document?.status === "Draft" && (
                        <button
                            type="button"
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