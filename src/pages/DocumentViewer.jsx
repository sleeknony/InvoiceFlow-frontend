import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { Card } from "react-bootstrap";

import DocumentActionsToolbar from "../components/DocumentActionsToolbar";
import DocumentStatusBadge from "../components/documentStatusBadge";
import EmailDocumentModal from "../components/EmailDocumentModal";
import AddPaymentModal from "../components/AddPaymentModal";
import PaymentHistoryTable from "../components/PaymentHistoryTable";
import PdfDocumentViewer from "../components/PdfDocumentViewer";

import {
    getDocument,
    getApprovalHistory,
    getPayments,
    updateDocumentStatus,
    approveDocument,
    rejectDocument,
    duplicateDocument,
    deleteDocument,
    convertDocument,
    emailDocument,
    addPayment,
    getPreviewUrl,
    downloadDocumentPdf
} from "../services/documentService";

import { getSettings } from "../services/settingsService";
import { useSubscription } from "../context/useSubscription";
import { SUBSCRIPTION_FEATURES } from "../utils/constants";


export default function DocumentViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    
    // =====================================================
    // SUBSCRIPTION
    // =====================================================

    const {
        hasFeature,
        loading: subscriptionLoading
    } = useSubscription();

    const canTrackPayments =
        hasFeature(
            SUBSCRIPTION_FEATURES.PAYMENT_TRACKING
        );

    const canConvertDocuments =
        hasFeature(
            SUBSCRIPTION_FEATURES.DOCUMENT_CONVERSION
        );

    const canDownloadPdf =
        hasFeature(
            SUBSCRIPTION_FEATURES.PDF_DOWNLOAD
        );
    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [document, setDocument] =
        useState(null);

    const [settings, setSettings] =
        useState(null);

    const [payments, setPayments] =
        useState([]);

    const [approvalHistory, setApprovalHistory] =
        useState([]);

    const [showEmailModal, setShowEmailModal] =
        useState(false);

    const [showPaymentModal, setShowPaymentModal] =
        useState(false);

    const [emailData, setEmailData] =
        useState({
            to: "",
            subject: "",
            message: ""
        });


    // =====================================================
    // LOAD DOCUMENT
    // =====================================================

    useEffect(() => {
        loadDocument();
    }, [id]);


    async function loadDocument() {
        try {
            setLoading(true);

            const [
                doc,
                settingsData,
                history
            ] = await Promise.all([
                getDocument(id),
                getSettings(),
                getApprovalHistory(id)
            ]);

            setDocument(doc);
            setSettings(settingsData);
            setApprovalHistory(history);

            setEmailData({
                to: doc.customerEmail ?? "",

                subject:
                    `${doc.type} ${doc.documentNumber}`,

                message:
                    `Please find attached your ${doc.type.toLowerCase()}.`
            });
        }
        catch (err) {
            console.error(
                "Unable to load document:",
                err
            );

            toast.error(
                err?.response?.data?.message ??
                "Failed to load document."
            );
        }
        finally {
            setLoading(false);
        }
    }


    // =====================================================
    // LOAD PAYMENTS
    //
    // Payment history is loaded only when the current
    // subscription includes Payment Tracking.
    // =====================================================

    useEffect(() => {
        if (
            subscriptionLoading ||
            !canTrackPayments ||
            !id
        ) {
            setPayments([]);
            return;
        }

        loadPayments();
    }, [
        id,
        canTrackPayments,
        subscriptionLoading
    ]);


    async function loadPayments() {
        try {
            const paymentData =
                await getPayments(id);

            setPayments(
                Array.isArray(paymentData)
                    ? paymentData
                    : []
            );
        }
        catch (err) {
            console.error(
                "Unable to load payments:",
                err
            );

            setPayments([]);
        }
    }

    const totalPaid =
        payments.reduce(
            (sum, payment) =>
                sum + Number(payment.amount ?? 0),
            0
        );

    const remainingBalance =
        Math.max(
            0,
            Number(document?.total ?? 0) -
            totalPaid
        );

   
    // =====================================================
    // APPROVE
    // =====================================================

    const handleApprove = async () => {
        const result =
            await Swal.fire({
                title: "Approve document?",
                text:
                    "This document will become approved.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Approve"
            });

        if (!result.isConfirmed)
            return;

        try {
            const updated =
                await approveDocument(
                    document.id
                );

            setDocument(updated);

            const history =
                await getApprovalHistory(
                    document.id
                );

            setApprovalHistory(history);

            toast.success(
                "Document approved."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                "Unable to approve document."
            );
        }
    };


    // =====================================================
    // REJECT
    // =====================================================

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

            const history =
                await getApprovalHistory(
                    document.id
                );

            setApprovalHistory(history);

            toast.success(
                "Document rejected."
            );
        }
        catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                "Unable to reject document."
            );
        }
    };


    // =====================================================
    // SEND
    // =====================================================

    const handleSend = async () => {
        const result =
            await Swal.fire({
                title: "Mark as Sent?",
                text:
                    "This document will be marked as Sent.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText:
                    "Mark as Sent",
                confirmButtonColor:
                    "#0d6efd"
            });

        if (!result.isConfirmed)
            return;

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
                err?.response?.data?.message ??
                "Unable to send document."
            );
        }
    };

    

    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    const handleDownload = async () => {

        // =====================================================
        // FEATURE ENTITLEMENT
        // =====================================================

        if (!canDownloadPdf) {   toast.error(   "You have exceeded the PDF download limit for your plan."
            );

            return;
        }

        if (!document?.id) {
            toast.error(
                "Document is not available for download."
            );

            return;
        }

        try {
            const response =
                await downloadDocumentPdf(
                    document.id
                );

            const blob =
                response.data;

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
                `${document.documentNumber || "document"}.pdf`;

            window.document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );
        }
        catch (err) {
            console.error(
                "Unable to download PDF:",
                err
            );

            const message =
                err.downloadMessage ||
                err?.response?.data?.message ||
                "Unable to download PDF.";

            toast.error(message);
        }
    };
    // =====================================================
    // EMAIL
    // =====================================================

    const handleEmail = () => {
        setShowEmailModal(true);
    };


    const sendEmail = async () => {
        const result =
            await Swal.fire({
                title: "Send Email?",
                text:
                    `Send ${document.documentNumber} to ${emailData.to}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Send"
            });

        if (!result.isConfirmed)
            return;

        try {
            await emailDocument(
                document.id,
                emailData
            );

            toast.success(
                "Email sent successfully."
            );

            setShowEmailModal(false);

            await loadDocument();
        }
        catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                "Unable to send email."
            );
        }
    };


    // =====================================================
    // DUPLICATE
    // =====================================================

    const handleDuplicate = async () => {
        const result =
            await Swal.fire({
                title: "Duplicate document?",
                text:
                    "A new draft copy will be created.",
                icon: "question",
                showCancelButton: true,
                confirmButtonText:
                    "Duplicate"
            });

        if (!result.isConfirmed)
            return;

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
                err?.response?.data?.message ??
                "Unable to duplicate document."
            );
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {
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
                err?.response?.data?.message ??
                "Unable to delete document."
            );
        }
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {
        if (!document?.id)
            return;

        navigate(
            `/documents/edit/${document.id}`
        );
    };


    // =====================================================
    // CONVERT
    // =====================================================

    const handleConvert = async () => {

        // =====================================================
        // SUBSCRIPTION FEATURE CHECK
        // =====================================================

        if (!canConvertDocuments) {
            toast.error(
                "Document conversion is not available on your current plan."
            );

            return;
        }


        // =====================================================
        // DOCUMENT CHECK
        // =====================================================

        if (!document?.id) {
            toast.error(
                "Document is not available for conversion."
            );

            return;
        }


        // =====================================================
        // DETERMINE TARGET TYPE
        // =====================================================

        let targetType;


        // Quote has only one valid conversion.
        if (document.type === "Quote") {

            targetType = "Invoice";

        }

        // Invoice has multiple valid conversions.
        else if (document.type === "Invoice") {

            const result =
                await Swal.fire({
                    title: "Convert Invoice",

                    text:
                        "Select the document type you want to create.",

                    input: "select",

                    inputOptions: {
                        CreditNote: "Credit Note",
                        DeliveryNote: "Delivery Note",
                        Receipt: "Receipt"
                    },

                    inputPlaceholder:
                        "Select document type",

                    showCancelButton: true,

                    confirmButtonText: "Continue",

                    cancelButtonText: "Cancel",

                    inputValidator: (value) => {
                        if (!value) {
                            return "Please select a document type.";
                        }
                    }
                });

            if (!result.isConfirmed) {
                return;
            }

            targetType =
                result.value;
        }

        else {
            toast.error(
                "This document cannot be converted."
            );

            return;
        }


        // =====================================================
        // CONFIRM CONVERSION
        // =====================================================

        const confirmation =
            await Swal.fire({
                title:
                    `Convert to ${targetType}?`,

                text:
                    `A new ${targetType} will be created from this ${document.type}.`,

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Convert",

                cancelButtonText: "Cancel"
            });


        if (!confirmation.isConfirmed) {
            return;
        }


        // =====================================================
        // CONVERT
        // =====================================================

        try {

            const converted =
                await convertDocument(
                    document.id,
                    targetType
                );

            toast.success(
                `${document.type} converted to ${targetType}.`
            );


            if (converted?.id) {
                navigate(
                    `/documents/${converted.id}`
                );
            }

        }
        catch (err) {

            console.error(
                "Unable to convert document:",
                err
            );


            const responseData =
                err?.response?.data;


            const message =
                responseData?.message ||
                responseData?.detail ||
                (
                    typeof responseData === "string"
                        ? responseData
                        : null
                ) ||
                "Unable to convert document.";


            toast.error(message);
        }
    };


    // =====================================================
    // ADD PAYMENT
    //
    // Paid / PartiallyPaid status is NOT manually changed
    // here. The backend determines the resulting document
    // status from the actual payment totals.
    // =====================================================

    const handleAddPayment = async (dto) => {

        if (!canTrackPayments) {
            toast.error(
                "Payment Tracking is not available on your current plan."
            );

            return;
        }

        try {
            const updated =
                await addPayment(
                    document.id,
                    dto
                );

            // Updated invoice returned by backend
            setDocument(updated);

            // Reload payments so the remaining balance
            // is recalculated from the latest data.
            const paymentData =
                await getPayments(
                    updated.id
                );

            setPayments(
                Array.isArray(paymentData)
                    ? paymentData
                    : []
            );

            setShowPaymentModal(false);

            toast.success(
                "Payment added."
            );
        }
        catch (err) {
            console.error(
                "Unable to add payment:",
                err
            );

            toast.error(
                err?.response?.data?.message ??
                "Unable to add payment."
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }


    if (!document) {
        return (
            <div className="alert alert-warning">
                Document could not be loaded.
            </div>
        );
    }


    // =====================================================
    // PAYMENT ELIGIBILITY
    // =====================================================

    const canReceivePayment =
        remainingBalance > 0 &&
        (
            document.status === "Sent" ||
            document.status === "PartiallyPaid" ||
            document.status === "Overdue"
        );


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            {/* ==========================================
                DOCUMENT HEADER
            ========================================== */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-3
                    document-viewer-header
                "
            >
                <div>
                    <h4 className="mb-0">
                        {document.documentNumber}
                    </h4>

                    <small className="text-muted">
                        {document.type}
                    </small>
                </div>


                <div
                    className="
                        d-flex
                        align-items-center
                        gap-2
                        dstats
                    "
                >
                    <DocumentStatusBadge
                        status={document.status}
                    />


                    {/* ==================================
                        APPROVAL
                    ================================== */}

                    {document.status === "Draft" && (
                        <>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleApprove}
                            >
                                Approve
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </>
                    )}


                    {/* ==================================
                        REJECTED
                    ================================== */}

                    {document.status === "Rejected" && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleDuplicate}
                        >
                            Duplicate as Draft
                        </button>
                    )}


                    {/* ==================================
                        APPROVED
                    ================================== */}

                    {document.status === "Approved" && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSend}
                        >
                            Mark as Sent
                        </button>
                    )}


                    {/* ==================================
                        PAYMENT TRACKING
                    ================================== */}

                    {canReceivePayment && (
                        <button
                            type="button"
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
                                    setShowPaymentModal(
                                        true
                                    );
                                }
                            }}
                        >
                            Add Payment
                        </button>
                    )}
                </div>
            </div>


            {/* ==========================================
                DOCUMENT ACTIONS
            ========================================== */}

            <DocumentActionsToolbar
                document={document}
                onDownload={handleDownload}
                onEmail={handleEmail}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onConvert={handleConvert}
                canConvertDocuments={canConvertDocuments}
                onEdit={handleEdit}
            />


            {/* ==========================================
                DOCUMENT PREVIEW
            ========================================== */}

            <Card
                className="
                    shadow-sm
                    border-0
                    mb-4
                "
            >
                <Card.Body className="text-center">

                    <PdfDocumentViewer
                        url={
                            getPreviewUrl(
                                document.id
                            )
                        }
                        maxPages={
                            settings?.maxDocumentPages
                        }
                        subscriptionPlan={
                            settings?.subscriptionPlan
                        }
                    />

                </Card.Body>
            </Card>


            {/* ==========================================
                PAYMENT HISTORY
            ========================================== */}

            {!subscriptionLoading && (
                canTrackPayments ? (
                    <PaymentHistoryTable
                        payments={payments}
                        currency={document.currency}
                    />
                ) : (
                    <div
                        className="
                            card
                            shadow-sm
                            border-0
                            mb-4
                        "
                    >
                        <div
                            className="
                                card-body
                                text-center
                                py-4
                            "
                        >
                            <h5 className="mb-2">
                                Payment Tracking
                            </h5>

                            <p
                                className="
                                    text-muted
                                    mb-3
                                "
                            >
                                Payment history and payment
                                tracking are not available
                                on your current plan.
                            </p>

                            <button
                                type="button"
                                className="
                                    btn
                                    btn-outline-primary
                                "
                                onClick={() =>
                                    navigate("/pricing")
                                }
                            >
                                View Plans
                            </button>
                        </div>
                    </div>
                )
            )}


            {/* ==========================================
                EMAIL MODAL
            ========================================== */}

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


            {/* ==========================================
                PAYMENT MODAL
            ========================================== */}

            {canTrackPayments && (
                <AddPaymentModal
                    show={showPaymentModal}
                    onClose={() =>
                        setShowPaymentModal(false)
                    }
                    onSave={handleAddPayment}
                    balanceDue={remainingBalance}
                />
            )}


            {/* ==========================================
                APPROVAL HISTORY
            ========================================== */}

            {approvalHistory.length > 0 && (
                <div className="card mt-4">

                    <div className="card-header">
                        Approval History
                    </div>

                    <div className="card-body p-0">

                        <table className="table mb-0">

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvalHistory.map(
                                    item => (
                                        <tr key={item.id}>

                                            <td>
                                                {new Date(
                                                    item.actionDate
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {item.userName}
                                            </td>

                                            <td>
                                                {item.action}
                                            </td>

                                            <td>
                                                {item.comment}
                                            </td>

                                        </tr>
                                    )
                                )}
                            </tbody>

                        </table>

                    </div>

                </div>
            )}
        </>
    );
}