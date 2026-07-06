import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import DocumentActionsToolbar from "../components/DocumentActionsToolbar";
import DocumentStatusBadge from "../components/documentStatusBadge";
import EmailDocumentModal  from "../components/EmailDocumentModal";
import {
    getDocument, updateDocumentStatus, duplicateDocument, deleteDocument, convertDocument, downloadPdf, emailDocument, updateDocument
    , approveDocument, rejectDocument
}   from "../services/documentService";

import { getSettings} from "../services/settingsService";

import { getTemplate}  from "../templates/getTemplate";

export default function DocumentViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [document, setDocument] =
        useState(null);

    const [settings, setSettings] =
        useState(null);

    
    const [showEmailModal, setShowEmailModal] =
        useState(false);

    const [emailData, setEmailData] =
        useState({
            to: "",
            subject: "",
            message: ""
        });

    const [loading, setLoading] =
        useState(true);

   
    useEffect(() => {
        loadDocument();
    }, [id]);

    async function loadDocument() {
        try {
            const [doc, settingsData] =
                await Promise.all([
                    getDocument(id),
                    getSettings()
                ]);

            setDocument(doc);
            setSettings(settingsData);
         
            setEmailData({
                to: doc.customerEmail ?? "",
                subject:
                    `${doc.type} ${doc.documentNumber}`,
                message:
                    `Please find attached your ${doc.type.toLowerCase()}.`
            });
        }
        catch (err) {
            console.error(err);

            toast.error(
                "Failed to load document."
            );
        }
        finally {
            setLoading(false);
        }
    }


    const handleApprove = async () => {
        try {
            const updated =
                await approveDocument(
                    document.id
                );

            setDocument(updated);

            toast.success(
                "Document approved."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to approve document."
            );
        }
    };

    const handleReject = async () => {
        const { value: reason } =
            await Swal.fire({
                title: "Reject Document",
                input: "textarea",
                inputLabel:
                    "Reason (optional)",
                showCancelButton: true
            });

        if (reason === undefined)
            return;

        try {
            const updated =
                await rejectDocument(
                    document.id,
                    reason
                );

            setDocument(updated);

            toast.success(
                "Document rejected."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to reject document."
            );
        }
    };

    const handleSend = async () => {
        try {
            const updated =
                await updateDocumentStatus(
                    document.id,
                    "Sent"
                );

            setDocument(updated);

            toast.success(
                "Document marked as sent."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to send document."
            );
        }
    };


    const handleMarkPaid = async () => {
        try {
            const updated =
                await updateDocumentStatus(
                    document.id,
                    "Paid"
                );

            setDocument(updated);

            toast.success(
                "Document marked as paid."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to mark document as paid."
            );
        }
    };

    const handlePartiallyPaid = async () => {
        try {
            const updated =
                await updateDocumentStatus(
                    document.id,
                    "PartiallyPaid"
                );

            setDocument(updated);

            toast.success(
                "Document marked as paid."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to mark document as paid."
            );
        }
    };

    const saveStatus = async () => {
        if (
            !selectedStatus ||
            selectedStatus === document.status
        ) {
            return;
        }

        const result =
            await Swal.fire({
                title: "Change Status?",
                text:
                    `Change status from "${document.status}" to "${selectedStatus}"?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Change",
                cancelButtonText: "Cancel"
            });

        if (!result.isConfirmed)
            return;

        try {
            setSavingStatus(true);

            const updated =
                await updateDocumentStatus(
                    document.id,
                    selectedStatus
                );

            setDocument(updated);
            setSelectedStatus(updated.status);

            toast.success(
                "Status updated successfully."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                "Failed to update status."
            );
        }
        finally {
            setSavingStatus(false);
        }
    };

    if (loading)
        return <div>Loading...</div>;

    if (!document)
        return <div>Document not found</div>;

    if (!settings)
        return <div>Settings not found</div>;

    const Template =
        getTemplate(
            settings.documentTemplate
        );

    const statusLocked =
        [
            "Paid",
            "Cancelled",
            "Void"
        ].includes(document.status);

    

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        try {
            const blob =
                await downloadPdf(
                    document.id
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                window.document.createElement(
                    "a"
                );

            link.href = url;

            link.download =
                `${document.documentNumber}.pdf`;

            window.document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

            toast.success(
                "PDF downloaded successfully."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to download PDF."
            );
        }
    };

    

    const handleEmail = () => {
        setShowEmailModal(true);
    };

    const sendEmail = async () => {
        try {
            await emailDocument(
                document.id,
                emailData
            );

            toast.success(
                "Email sent successfully."
            );

            setShowEmailModal(false);
        }
        catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ??
                "Unable to send email."
            );
        }
    };

    const handleDuplicate =
        async () => {
            try {
                const copy =
                    await duplicateDocument(
                        document.id
                    );

                toast.success(
                    "Document duplicated. Redirecting...",
                    {
                        duration: 5000
                    }
                );

                setTimeout(() => {
                    navigate(
                        `/documents/${copy.id}`
                    );
                }, 5000);
            }
            catch (err) {
                console.error(err);

                toast.error(
                    "Unable to duplicate document."
                );
            }
        };

    const handleDelete =
        async () => {
            const result =
                await Swal.fire({
                    title:
                        "Delete document?",
                    text:
                        "This cannot be undone.",
                    icon: "warning",
                    showCancelButton: true
                });

            if (!result.isConfirmed)
                return;

            try {
                await deleteDocument(
                    document.id
                );

                toast.success(
                    "Document deleted."
                );

                navigate("/documents");
            }
            catch (err) {
                console.error(err);

                toast.error(
                    err.response?.data?.message ??
                    "Unable to delete document."
                );
            }
        };

    const handleEdit = () => {
        if (!document?.id) return;

        navigate(
            `/documents/edit/${document.id}`
        );
    };

    const handleConvert =
        async (targetType) => {
            try {
                const converted =
                    await convertDocument(
                        document.id,
                        targetType
                    );

                toast.success(
                    `${document.type} converted to ${targetType}.`
                );

                navigate(
                    `/documents/${converted.id}`
                );
            }
            catch (err) {
                console.error(err);

                toast.error(
                    err.response?.data?.message ??
                    "Conversion failed."
                );
            }
        };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h4 className="mb-0">
                        {document.documentNumber}
                    </h4>

                    <small className="text-muted">
                        {document.type}
                    </small>
                </div>
                <div className="d-flex align-items-center gap-2">

                    <DocumentStatusBadge
                        status={document.status}
                    />

                    {document.status === "Draft" && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={handleApprove}
                            >
                                Approve
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {document.status === "Rejected" && (
                        <button
                            className="btn btn-primary"
                            onClick={handleDuplicate}
                        >
                            Duplicate as Draft
                        </button>
                    )}

                    {document.status === "Approved" && (
                        <button
                            className="btn btn-primary"
                            onClick={handleSend}
                        >
                            Mark as Sent
                        </button>
                    )}
                    {document.status === "Sent" && (
                        <button
                            className="btn btn-success"
                            onClick={handleMarkPaid}
                        >
                            Mark as Paid
                        </button>
                    )}

                    {
                        document.status === "Sent" && (
                            <button
                                className="btn btn-warning"
                                onClick={handlePartiallyPaid}
                                                                  
                            >
                                Mark Partially Paid
                            </button>
                        )
                    }
                </div>
               
            </div>

            <DocumentActionsToolbar
                document={document}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onEmail={handleEmail}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onConvert={handleConvert}
                onEdit={handleEdit}
            />

            <Template
                document={document}
                settings={settings}
            />

            <EmailDocumentModal
                show={showEmailModal}
                onClose={() =>
                    setShowEmailModal(false)
                }
                document={document}
                emailData={emailData}
                setEmailData={setEmailData}
                onSend={sendEmail}
            />
        </>
    );
}