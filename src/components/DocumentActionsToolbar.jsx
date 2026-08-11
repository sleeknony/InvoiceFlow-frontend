import {
    FiDownload,
    FiMail,
    FiCopy,
    FiRefreshCw,
    FiEdit2,
    FiTrash2,
    FiCheck,
    FiX,
    FiSend,
    FiDollarSign,
    FiUpload
} from "react-icons/fi";

export default function DocumentActionsToolbar({
    document,
    canConvertDocuments,
    canTrackPayments,

    handleEdit,
    handleApprove,
    handleReject,
    handleDuplicate,
    handleSubmitForApproval,
    handleSend,
    handleConvert,
    handleDownload,
    handleEmail,
    handleDelete,

    setShowPaymentModal
}) {
    if (!document)
        return null;

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">

                <div className="d-flex flex-wrap gap-2">

                    {/* DOWNLOAD */}
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleDownload}
                    >
                        <FiDownload className="me-1" />
                        Download
                    </button>

                    {/* EMAIL */}
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleEmail}
                    >
                        <FiMail className="me-1" />
                        Email
                    </button>

                    {/* EDIT */}
                    {document.canEdit && (
                        <button
                            className="btn btn-primary"
                            onClick={handleEdit}
                        >
                            <FiEdit2 className="me-1" />
                            Edit
                        </button>
                    )}

                    {/* DUPLICATE */}
                    {document.canDuplicate && (
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleDuplicate}
                        >
                            <FiCopy className="me-1" />
                            Duplicate
                        </button>
                    )}

                    {/* SUBMIT FOR APPROVAL */}
                    {document.canSubmitForApproval && (
                            <button
                                className="btn btn-warning"
                                onClick={
                                    handleSubmitForApproval
                                }
                            >
                                <FiUpload className="me-1" />
                                Submit
                            </button>
                        )}

                    {/* APPROVE */}
                    {document.canApprove && (
                        <button
                            className="btn btn-success"
                            onClick={handleApprove}
                        >
                            <FiCheck className="me-1" />
                            Approve
                        </button>
                    )}

                    {/* REJECT */}
                    {document.canReject && (
                        <button
                            className="btn btn-outline-danger"
                            onClick={handleReject}
                        >
                            <FiX className="me-1" />
                            Reject
                        </button>
                    )}

                    {/* SEND */}
                    {document.canSend && (
                        <button
                            className="btn btn-info text-white"
                            onClick={handleSend}
                        >
                            <FiSend className="me-1" />
                            Send
                        </button>
                    )}

                    {/* PAYMENT */}
                    {canTrackPayments &&
                        canReceivePayment && (
                            <button
                                className="btn btn-outline-success"
                                onClick={() =>
                                    setShowPaymentModal(true)
                                }
                            >
                                <FiDollarSign className="me-1" />
                                Record Payment
                            </button>
                        )}

                    {/* CONVERT */}
                    {document.canConvert && (
                        <button
                            className="btn btn-outline-primary"
                            disabled={!canConvertDocuments}
                            onClick={handleConvert}
                        >
                            <FiRefreshCw className="me-1" />
                            Convert
                        </button>
                    )}

                    {/* DELETE */}
                    {document.canDelete && (
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            <FiTrash2 className="me-1" />
                            Delete
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}