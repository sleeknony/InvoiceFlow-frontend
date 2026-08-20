import {
    FiEdit2,
    FiCheck,
    FiX,
    FiSend,
    FiDollarSign,
    FiRepeat,
    FiDownload,
    FiMail,
    FiTrash2
} from "react-icons/fi";

export default function DocumentActionsToolbar({

    document,

    subscriptionLoading,
    canReceivePayment,
    canTrackPayments,
    canConvertDocuments,
    handleSubmitForApproval,  
    handleEdit,
    handleApprove,
    handleReject,
    handleDuplicate,
    handleSend,
    handleConvert,
    handleDownload,
    handleEmail,
    handleDelete,
    setShowPaymentModal

}) {

    return (
        
        <div className="dv-toolbar">

            {/* =======================================
                LEFT ACTIONS
            ======================================== */}

            <div className="dv-toolbar-left">

                {/* EDIT */}

                {document.canEdit && (

                    <button
                        className="btn btn-light"
                        onClick={handleEdit}
                    >
                        <FiEdit2 />
                        <span>Edit</span>
                    </button>

                )}


                {/* APPROVE */}

                {document.approvalWorkflowEnabled &&
                    document.canSubmitForApproval && (
                        <button
                            className="btn btn-warning"
                            onClick={handleSubmitForApproval}
                        >
                            <FiSend />
                            <span>Send For Approval</span>
                        </button>
                    )}

                {document.canApprove && (

                    <button
                        className="btn btn-success"
                        onClick={handleApprove}
                    >
                        <FiCheck />
                        <span>Approve</span>
                    </button>

                )}

                {document.canReject && (

                    <button
                        className="btn btn-danger"
                        onClick={handleReject}
                    >
                        <FiX />
                        <span>Reject</span>
                    </button>

                )}



                {/* SEND */}

                {document.canSend && (

                    <button
                        className="btn btn-primary"
                        onClick={handleSend}
                    >
                        <FiSend />
                        <span>Mark as Sent</span>
                    </button>

                )}


                {/* DUPLICATE */}

                {document.canDuplicate && (

                    <button
                        className="btn btn-outline-primary"
                        onClick={handleDuplicate}
                    >
                        <FiRepeat />
                        <span>Duplicate</span>
                    </button>

                )}


                {/* PAYMENT */}

                {canReceivePayment && (

                    <button
                        className="btn btn-success"
                        disabled={
                            subscriptionLoading ||
                            !canTrackPayments
                        }
                        title={
                            canTrackPayments
                                ? "Record a payment"
                                : "Payment Tracking is not available on your current plan."
                        }
                        onClick={() => {

                            if (
                                !subscriptionLoading &&
                                canTrackPayments
                            ) {

                                setShowPaymentModal(true);

                            }

                        }}
                    >
                        <FiDollarSign />
                        <span>Add Payment</span>
                    </button>

                )}

            </div>


            {/* =======================================
                RIGHT ACTIONS
            ======================================== */}

            <div className="dv-toolbar-right">

                {/* CONVERT */}

                {document.canConvert && (

                    <button
                        className="btn btn-outline-primary"
                        disabled={!canConvertDocuments}
                        title={
                            canConvertDocuments
                                ? "Convert document"
                                : "Document conversion is not available on your current plan."
                        }
                        onClick={handleConvert}
                    >
                        <FiRepeat />
                        <span>Convert</span>
                    </button>

                )}


                {/* DOWNLOAD */}

                {document.canDownload && (

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleDownload}
                    >
                        <FiDownload />
                        <span>Download</span>
                    </button>

                )}

                {/* EMAIL */}

                {document.canEmail && (

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleEmail}
                    >
                        <FiMail />
                        <span>Email</span>
                    </button>

                )}


                {/* DELETE */}

                {document.canDelete && (

                    <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                    >
                        <FiTrash2 />
                        <span>Delete</span>
                    </button>

                )}

            </div>

                </div>

         
    );

}