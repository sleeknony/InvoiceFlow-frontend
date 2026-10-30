import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import SupportConversation from "../../components/Support/SupportConversation";
import http from "../../api/http";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiDownload,
    FiExternalLink,
    FiFileText,
    FiImage,
    FiPaperclip,
    FiRefreshCw,
    FiSave,
    FiX
} from "react-icons/fi";
import {
    assignSupportTicket,
    getSupportAssignees,
    getSupportTicket,
    linkTawkConversation,
    updateSupportTicketPriority,
    updateSupportTicketStatus
} from "../../services/superAdminSupportService";
import "./SuperAdminSupport.css";

const STATUS_OPTIONS = [
    { label: "Open", value: 1 },
    { label: "In Progress", value: 2 },
    { label: "Waiting for Customer", value: 3 },
    { label: "Resolved", value: 4 },
    { label: "Closed", value: 5 }
];

const PRIORITY_OPTIONS = [
    { label: "Low", value: 1 },
    { label: "Normal", value: 2 },
    { label: "High", value: 3 },
    { label: "Urgent", value: 4 }
];

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString();
}

function enumNumber(value, options) {
    if (typeof value === "number") {
        return value;
    }

    const normalized = String(value ?? "").toLowerCase();

    const match = options.find(
        item =>
            item.label.toLowerCase() === normalized ||
            item.label.replace(/\s/g, "").toLowerCase() ===
                normalized.replace(/\s/g, "")
    );

    return match?.value ?? "";
}

function displayName(value) {
    return value || "—";
}

export default function SuperAdminSupportTicket() {
    const { ticketId } = useParams();
    const { user } = useAuth();

    const roles = Array.isArray(user?.roles) ? user.roles : [];

    const isSuperAdmin = roles.some(
        role => String(role).toLowerCase() === "superadmin"
    );

    const isSupportAgent = roles.some(
        role => String(role).toLowerCase() === "supportagent"
    );

    const currentUserId = user?.id;

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedToUserId, setAssignedToUserId] = useState("");
    const [assignmentNote, setAssignmentNote] = useState("");
    const [statusNote, setStatusNote] = useState("");
    const [priorityNote, setPriorityNote] = useState("");
    const [tawkConversationId, setTawkConversationId] = useState("");
    const [tawkNote, setTawkNote] = useState("");

    const [assignees, setAssignees] = useState([]);
    const [assigneesLoading, setAssigneesLoading] = useState(false);
    const [assigneeSearch, setAssigneeSearch] = useState("");

    const [attachments, setAttachments] = useState([]);
    const [attachmentsLoading, setAttachmentsLoading] = useState(false);
    const [attachmentsError, setAttachmentsError] = useState("");
    const [previewAttachment, setPreviewAttachment] = useState(null);
    const [attachmentActionLoading, setAttachmentActionLoading] = useState(false);

    const isUnassigned =
        !!ticket && !ticket.assignedToUserId;

    const isAssignedToCurrentUser =
        !!currentUserId &&
        !!ticket?.assignedToUserId &&
        ticket.assignedToUserId === currentUserId;

    const canClaimTicket =
        isSupportAgent &&
        !isSuperAdmin &&
        isUnassigned;

    const canWorkOnTicket =
        isSuperAdmin || isAssignedToCurrentUser;

    // Load eligible platform users for the assignment dropdown.
    useEffect(() => {
        if (!isSuperAdmin) return;

        let cancelled = false;

        const loadAssignees = async () => {
            setAssigneesLoading(true);

            try {
                const data = await getSupportAssignees();

                if (!cancelled) {
                    setAssignees(
                        Array.isArray(data) ? data : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setAssignees([]);

                    await Swal.fire({
                        title: "Unable to load assignees",
                        text:
                            err?.response?.data?.message ||
                            "The list of eligible platform users could not be loaded.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            } finally {
                if (!cancelled) {
                    setAssigneesLoading(false);
                }
            }
        };

        loadAssignees();

        return () => {
            cancelled = true;
        };
    }, [isSuperAdmin]);

    const loadTicket = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getSupportTicket(ticketId);

            setTicket(data);
            setStatus(enumNumber(data.status, STATUS_OPTIONS));
            setPriority(enumNumber(data.priority, PRIORITY_OPTIONS));
            setAssignedToUserId(data.assignedToUserId || "");
            setTawkConversationId(data.tawkConversationId || "");
        } catch (err) {
            setTicket(null);

            const statusCode = err?.response?.status;

            setError(
                statusCode === 403
                    ? "You cannot access this ticket. Support Agents can only view unassigned tickets and tickets assigned to them."
                    : err?.response?.data?.message ||
                      "Unable to load this support ticket."
            );
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    const loadAttachments = useCallback(async () => {
        if (!ticketId) return;

        setAttachmentsLoading(true);
        setAttachmentsError("");

        try {
            const response = await http.get(
                `/support/tickets/${ticketId}/attachments`
            );

            const data = response.data;

            setAttachments(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.attachments)
                        ? data.attachments
                        : []
            );
        } catch (err) {
            setAttachments([]);
            setAttachmentsError(
                err?.response?.data?.message ||
                "Unable to load attachments for this ticket."
            );
        } finally {
            setAttachmentsLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        loadAttachments();
    }, [loadAttachments]);

    const getAttachmentId = attachment =>
        attachment.id ?? attachment.attachmentId;

    const getAttachmentName = attachment =>
        attachment.originalFileName ||
        attachment.fileName ||
        attachment.name ||
        "Attachment";

    const getAttachmentContentType = attachment =>
        String(attachment.contentType || "").toLowerCase();

    const formatFileSize = bytes => {
        const size = Number(bytes);

        if (!Number.isFinite(size) || size < 0) {
            return "Size unavailable";
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    const isPreviewableAttachment = attachment => {
        const contentType = getAttachmentContentType(attachment);

        return (
            contentType === "application/pdf" ||
            ["image/jpeg", "image/png", "image/webp"].includes(contentType)
        );
    };

    const getAttachmentBlob = async (attachment, download = false) => {
        const attachmentId = getAttachmentId(attachment);

        const response = await http.get(
            `/support/tickets/${ticketId}/attachments/${attachmentId}${download ? "?download=true" : ""
            }`,
            {
                responseType: "blob"
            }
        );

        return response.data;
    };

    const handlePreviewAttachment = async attachment => {
        if (!isPreviewableAttachment(attachment)) {
            await Swal.fire({
                title: "Preview unavailable",
                text: "This file type cannot be previewed. You can download the attachment instead.",
                icon: "info",
                confirmButtonText: "OK"
            });

            return;
        }

        setAttachmentActionLoading(true);

        try {
            const blob = await getAttachmentBlob(attachment);
            const url = URL.createObjectURL(blob);

            setPreviewAttachment({
                ...attachment,
                previewUrl: url
            });
        } catch (err) {
            await Swal.fire({
                title: "Unable to preview attachment",
                text:
                    err?.response?.data?.message ||
                    "The attachment could not be opened. Check your access and try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setAttachmentActionLoading(false);
        }
    };

    const handleDownloadAttachment = async attachment => {
        setAttachmentActionLoading(true);

        let url;

        try {
            const blob = await getAttachmentBlob(attachment, true);
            url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = getAttachmentName(attachment);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        } catch (err) {
            if (url) {
                URL.revokeObjectURL(url);
            }

            await Swal.fire({
                title: "Download failed",
                text:
                    err?.response?.data?.message ||
                    "The attachment could not be downloaded. Please try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setAttachmentActionLoading(false);
        }
    };

    const closeAttachmentPreview = () => {
        if (previewAttachment?.previewUrl) {
            URL.revokeObjectURL(previewAttachment.previewUrl);
        }

        setPreviewAttachment(null);
    };



    useEffect(() => {
        loadTicket();
    }, [loadTicket]);

    const confirmAction = async (
        title,
        text,
        confirmButtonText = "Continue"
    ) => {
        const result = await Swal.fire({
            title,
            text,
            icon: "question",
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        return result.isConfirmed;
    };

    const showError = async message => {
        await Swal.fire({
            title: "Request failed",
            text: message,
            icon: "error",
            confirmButtonText: "OK"
        });
    };

    const handleAssignment = async event => {
        event.preventDefault();

        if (!isSuperAdmin || saving) return;

        const userId = assignedToUserId.trim();

        const confirmed = await confirmAction(
            userId
                ? "Update ticket assignment?"
                : "Unassign this ticket?",
            userId
                ? "The selected platform user will be assigned this ticket."
                : "This ticket will become available for a Support Agent to claim.",
            userId ? "Save assignment" : "Unassign ticket"
        );

        if (!confirmed) return;

        setSaving(true);

        try {
            await assignSupportTicket(ticketId, {
                assignedToUserId: userId || null,
                note: assignmentNote.trim() || null
            });

            await Swal.fire({
                title: userId
                    ? "Assignment updated"
                    : "Ticket unassigned",
                text: userId
                    ? "The support ticket assignment was saved."
                    : "The ticket is now unassigned.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            });

            setAssignmentNote("");
            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to update this ticket's assignment."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleClaimTicket = async () => {
        if (!currentUserId || !ticketId) {
            await showError(
                "Your user session could not be identified. Please sign in again."
            );
            return;
        }

        if (!canClaimTicket || saving) return;

        const confirmed = await confirmAction(
            "Claim this ticket?",
            `You will become responsible for ticket #${ ticketId }.`,
            "Claim Ticket"
        );

        if (!confirmed) return;

        setSaving(true);

        try {
            await assignSupportTicket(ticketId, {
                assignedToUserId: currentUserId,
                note: "Ticket claimed by Support Agent."
            });

            await Swal.fire({
                title: "Ticket claimed",
                text: "The ticket has been assigned to you.",
                icon: "success"
            });

            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to claim this ticket. It may already have been claimed."
            );

            await loadTicket();
        } finally {
            setSaving(false);
        }
    };

    const handleStatusUpdate = async event => {
        event.preventDefault();

        if (!canWorkOnTicket || status === "" || saving) return;

        const confirmed = await confirmAction(
            "Change ticket status?",
            "This will update the ticket and add an entry to its audit history."
        );

        if (!confirmed) return;

        setSaving(true);

        try {
            await updateSupportTicketStatus(ticketId, {
                status: Number(status),
                note: statusNote.trim() || null
            });

            await Swal.fire({
                title: "Status updated",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            setStatusNote("");
            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to update the ticket status."
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePriorityUpdate = async event => {
        event.preventDefault();

        if (!canWorkOnTicket || priority === "" || saving) return;

        const confirmed = await confirmAction(
            "Change ticket priority?",
            "The new priority will be saved to the ticket."
        );

        if (!confirmed) return;

        setSaving(true);

        try {
            await updateSupportTicketPriority(ticketId, {
                priority: Number(priority),
                note: priorityNote.trim() || null
            });

            await Swal.fire({
                title: "Priority updated",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            setPriorityNote("");
            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to update the ticket priority."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleTawkLink = async event => {
        event.preventDefault();

        if (!canWorkOnTicket || saving) return;

        const conversationId = tawkConversationId.trim();

        if (!conversationId) {
            await showError("Enter a Tawk.to conversation ID.");
            return;
        }

        const confirmed = await confirmAction(
            "Link Tawk.to conversation?",
            "This will associate the conversation ID with this support ticket."
        );

        if (!confirmed) return;

        setSaving(true);

        try {
            await linkTawkConversation(ticketId, {
                tawkConversationId: conversationId,
                note: tawkNote.trim() || null
            });

            await Swal.fire({
                title: "Conversation linked",
                text: "The Tawk.to conversation ID has been saved.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            });

            setTawkNote("");
            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to link this Tawk.to conversation."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="superadmin-support-page">
                <p className="support-loading-message">
                    Loading support ticket...
                </p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="superadmin-support-page">
                <Link
                    className="support-back-link"
                    to="/superadmin/support"
                >
                    <FiArrowLeft />
                    Back to support tickets
                </Link>

                <div className="support-error-message" role="alert">
                    {error || "Support ticket not found."}
                    <button type="button" onClick={loadTicket}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const auditHistory = Array.isArray(ticket.auditHistory)
        ? ticket.auditHistory
        : [];

    const filteredAssignees = assignees.filter(person => {
        const search = assigneeSearch.trim().toLowerCase();

        // Keep the currently selected account visible while searching.
        if (person.userId === assignedToUserId) return true;
        if (!search) return true;

        return [
            person.name,
            person.email,
            person.role
        ].some(value =>
            String(value || "")
                .toLowerCase()
                .includes(search)
        );
    });

    const currentAssigneeMissing =
        !!assignedToUserId &&
        !assignees.some(
            person => person.userId === assignedToUserId
        );

    const selectedAssignee = assignees.find(
        person => person.userId === assignedToUserId
    );

    return (
        <div className="superadmin-support-page">
            <header className="support-page-header">
                <div>
                    <Link
                        className="support-back-link"
                        to="/superadmin/support"
                    >
                        <FiArrowLeft />
                        Back to support tickets
                    </Link>

                    <p className="support-page-eyebrow">
                        SUPPORT TICKET #{ticket.id}
                    </p>

                    <h1>{ticket.subject}</h1>

                    <p>Submitted {formatDate(ticket.createdAt)}</p>
                </div>

                <button
                    type="button"
                    className="support-secondary-button"
                    onClick={loadTicket}
                    disabled={loading || saving}
                >
                    <FiRefreshCw />
                    Refresh
                </button>
            </header>

            {error && (
                <div className="support-error-message" role="alert">
                    {error}
                </div>
            )}

            <div className="support-detail-grid">
                <main className="support-detail-main">
                    <section className="support-detail-card">
                        <h2>Customer request</h2>

                        <div className="support-detail-meta">
                            <span>
                                <strong>Customer</strong>
                                {displayName(ticket.customerName)}
                            </span>

                            <span>
                                <strong>Email</strong>
                                {ticket.customerEmail ? (
                                    <a href={`mailto:${ ticket.customerEmail } `}>
                                        {ticket.customerEmail}
                                    </a>
                                ) : "—"}
                            </span>

                            <span>
                                <strong>Company</strong>
                                {displayName(ticket.companyName)}
                            </span>

                            <span>
                                <strong>Company ID</strong>
                                {ticket.companyId ?? "—"}
                            </span>

                            <span>
                                <strong>Current status</strong>
                                {ticket.status}
                            </span>

                            <span>
                                <strong>Current priority</strong>
                                {ticket.priority}
                            </span>

                            <span>
                                <strong>Assigned to</strong>
                                {ticket.assignedToName ||
                                    (ticket.assignedToUserId
                                        ? ticket.assignedToUserId
                                        : "Unassigned")}
                            </span>
                        </div>

                        <div className="support-description">
                            {ticket.description}
                        </div>

                        <div className="support-ticket-attachments">
                            <div className="support-attachments-heading">
                                <h3>
                                    <FiPaperclip />
                                    Attachments ({attachments.length})
                                </h3>

                                <button
                                    type="button"
                                    className="support-secondary-button"
                                    onClick={loadAttachments}
                                    disabled={attachmentsLoading || attachmentActionLoading}
                                >
                                    <FiRefreshCw />
                                    Refresh
                                </button>
                            </div>

                            {attachmentsLoading ? (
                                <p className="support-muted">
                                    Loading attachments...
                                </p>
                            ) : attachmentsError ? (
                                <div className="support-error-message" role="alert">
                                    {attachmentsError}

                                    <button
                                        type="button"
                                        onClick={loadAttachments}
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : attachments.length === 0 ? (
                                <p className="support-muted">
                                    No attachments were submitted with this ticket.
                                </p>
                            ) : (
                                <div className="support-attachment-list">
                                    {attachments.map(attachment => {
                                        const attachmentId = getAttachmentId(attachment);
                                        const fileName = getAttachmentName(attachment);
                                        const contentType = getAttachmentContentType(attachment);
                                        const uploadedAt =
                                            attachment.uploadedAt ||
                                            attachment.createdAt;

                                        return (
                                            <div
                                                className="support-attachment-item"
                                                key={attachmentId}
                                            >
                                                <div className="support-attachment-icon">
                                                    {contentType.startsWith("image/") ? (
                                                        <FiImage />
                                                    ) : (
                                                        <FiFileText />
                                                    )}
                                                </div>

                                                <div className="support-attachment-info">
                                                    <strong title={fileName}>
                                                        {fileName}
                                                    </strong>

                                                    <span>
                                                        {formatFileSize(
                                                            attachment.fileSizeBytes ??
                                                            attachment.size
                                                        )}
                                                    </span>

                                                    <span>
                                                        Uploaded {formatDate(uploadedAt)}
                                                    </span>
                                                </div>

                                                <div className="support-attachment-actions">
                                                    {isPreviewableAttachment(attachment) && (
                                                        <button
                                                            type="button"
                                                            className="support-secondary-button"
                                                            onClick={() =>
                                                                handlePreviewAttachment(attachment)
                                                            }
                                                            disabled={attachmentActionLoading}
                                                        >
                                                            Preview
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="support-secondary-button"
                                                        onClick={() =>
                                                            handleDownloadAttachment(attachment)
                                                        }
                                                        disabled={attachmentActionLoading}
                                                        title={`Download ${fileName}`}
                                                    >
                                                        <FiDownload />
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </section>


                    <section className="support-detail-card">
                        <SupportConversation
                            ticketId={ticketId}
                            currentUserId={currentUserId}
                            canReply={
                                canWorkOnTicket &&
                                enumNumber(ticket.status, STATUS_OPTIONS) !== 5
                            }
                            canUseInternalNotes={isSuperAdmin || isSupportAgent}
                        />
                    </section>

                    <section className="support-detail-card">
                        <h2>Audit history</h2>

                        {auditHistory.length === 0 ? (
                            <p className="support-muted">
                                No audit entries are available for this ticket.
                            </p>
                        ) : (
                            <ol className="support-audit-timeline">
                                {auditHistory.map(entry => (
                                    <li key={entry.id}>
                                        <div className="support-audit-marker">
                                            <FiCheckCircle />
                                        </div>

                                        <div className="support-audit-content">
                                            <div className="support-audit-heading">
                                                <strong>{entry.action}</strong>
                                                <time>
                                                    {formatDate(entry.performedAt)}
                                                </time>
                                            </div>

                                            <p>
                                                By {entry.performedByName ||
                                                    entry.performedByUserId}
                                            </p>

                                            {entry.oldValue && (
                                                <p>
                                                    <strong>Previous:</strong>{" "}
                                                    {entry.oldValue}
                                                </p>
                                            )}

                                            {entry.newValue && (
                                                <p>
                                                    <strong>New:</strong>{" "}
                                                    {entry.newValue}
                                                </p>
                                            )}

                                            {entry.note && (
                                                <p>
                                                    <strong>Note:</strong>{" "}
                                                    {entry.note}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </main>

                <aside className="support-detail-actions">
                    {isSuperAdmin && (
                        <section className="support-detail-card">
                            <h2>Assignment</h2>

                            <p className="support-muted">
                                Search for a platform Super Admin or Support
                                Agent by name or email. Choose Unassigned to
                                make the ticket available for an agent to claim.
                            </p>

                            <form onSubmit={handleAssignment}>
                                <label className="support-form-label">
                                    Search platform users
                                    <input
                                        type="search"
                                        value={assigneeSearch}
                                        onChange={event =>
                                            setAssigneeSearch(event.target.value)
                                        }
                                        placeholder="Search by name, email, or role..."
                                        autoComplete="off"
                                    />
                                </label>

                                <label className="support-form-label">
                                    Assign ticket to
                                    <select
                                        value={assignedToUserId}
                                        onChange={event =>
                                            setAssignedToUserId(event.target.value)
                                        }
                                        disabled={assigneesLoading || saving}
                                    >
                                        <option value="">
                                            {assigneesLoading
                                                ? "Loading platform users..."
                                                : "Unassigned"}
                                        </option>

                                        {currentAssigneeMissing && (
                                            <option value={assignedToUserId}>
                                                {ticket.assignedToName ||
                                                    assignedToUserId}
                                                {" (current assignment)"}
                                            </option>
                                        )}

                                        {filteredAssignees.map(person => (
                                            <option
                                                key={person.userId}
                                                value={person.userId}
                                            >
                                                {person.name} - {person.email} ({person.role})
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {selectedAssignee && (
                                    <p className="support-muted">
                                        Selected:{" "}
                                        <strong>{selectedAssignee.name}</strong>
                                        {" - "}
                                        {selectedAssignee.email}
                                        {" - "}
                                        {selectedAssignee.role}
                                    </p>
                                )}

                                {currentAssigneeMissing && (
                                    <p className="support-muted">
                                        The current assignee is not in the
                                        active eligible-user list. You can
                                        reassign the ticket or choose
                                        Unassigned.
                                    </p>
                                )}

                                <label className="support-form-label">
                                    Note (optional)
                                    <textarea
                                        value={assignmentNote}
                                        onChange={event =>
                                            setAssignmentNote(event.target.value)
                                        }
                                        maxLength={2000}
                                        rows={2}
                                    />
                                </label>

                                <button
                                    className="support-primary-button support-full-button"
                                    type="submit"
                                    disabled={saving || assigneesLoading}
                                >
                                    <FiSave />
                                    Save assignment
                                </button>
                            </form>
                        </section>
                    )}

                    {canClaimTicket && (
                        <section className="support-detail-card">
                            <h2>Claim ticket</h2>

                            <p className="support-muted">
                                This ticket is unassigned. Claim it to take
                                responsibility for responding to the customer.
                            </p>

                            <button
                                className="support-primary-button support-full-button"
                                type="button"
                                onClick={handleClaimTicket}
                                disabled={saving}
                            >
                                <FiCheckCircle />
                                {saving ? "Claiming..." : "Claim Ticket"}
                            </button>
                        </section>
                    )}

                    {isSupportAgent &&
                        !isSuperAdmin &&
                        isAssignedToCurrentUser && (
                            <section className="support-detail-card">
                                <h2>Ticket assigned to you</h2>
                                <p className="support-muted">
                                    You can now manage this ticket and record
                                    your actions in its audit history.
                                </p>
                            </section>
                        )}

                    {!canWorkOnTicket && !canClaimTicket && (
                        <section className="support-detail-card">
                            <h2>Ticket unavailable for editing</h2>
                            <p className="support-muted">
                                Claim this ticket before updating it, or return
                                to the ticket queue to select an available ticket.
                            </p>
                        </section>
                    )}

                    {canWorkOnTicket && (
                        <>
                            <section className="support-detail-card">
                                <h2>Update status</h2>

                                <form onSubmit={handleStatusUpdate}>
                                    <label className="support-form-label">
                                        Status
                                        <select
                                            value={status}
                                            onChange={event =>
                                                setStatus(event.target.value)
                                            }
                                            required
                                        >
                                            {STATUS_OPTIONS.map(item => (
                                                <option
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="support-form-label">
                                        Note (optional)
                                        <textarea
                                            value={statusNote}
                                            onChange={event =>
                                                setStatusNote(event.target.value)
                                            }
                                            maxLength={2000}
                                            rows={2}
                                        />
                                    </label>

                                    <button
                                        className="support-primary-button support-full-button"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        Update status
                                    </button>
                                </form>
                            </section>

                            <section className="support-detail-card">
                                <h2>Update priority</h2>

                                <form onSubmit={handlePriorityUpdate}>
                                    <label className="support-form-label">
                                        Priority
                                        <select
                                            value={priority}
                                            onChange={event =>
                                                setPriority(event.target.value)
                                            }
                                            required
                                        >
                                            {PRIORITY_OPTIONS.map(item => (
                                                <option
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="support-form-label">
                                        Note (optional)
                                        <textarea
                                            value={priorityNote}
                                            onChange={event =>
                                                setPriorityNote(event.target.value)
                                            }
                                            maxLength={2000}
                                            rows={2}
                                        />
                                    </label>

                                    <button
                                        className="support-primary-button support-full-button"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        Update priority
                                    </button>
                                </form>
                            </section>

                            <section className="support-detail-card">
                                <h2>Tawk.to conversation</h2>

                                <p className="support-muted">
                                    Link the Tawk.to conversation ID manually.
                                    This records the association; it does not
                                    automatically import chat transcripts.
                                </p>

                                <form onSubmit={handleTawkLink}>
                                    <label className="support-form-label">
                                        Conversation ID
                                        <input
                                            value={tawkConversationId}
                                            onChange={event =>
                                                setTawkConversationId(event.target.value)
                                            }
                                            maxLength={200}
                                            placeholder="Tawk.to conversation ID"
                                            required
                                        />
                                    </label>

                                    <label className="support-form-label">
                                        Note (optional)
                                        <textarea
                                            value={tawkNote}
                                            onChange={event =>
                                                setTawkNote(event.target.value)
                                            }
                                            maxLength={2000}
                                            rows={2}
                                        />
                                    </label>

                                    <button
                                        className="support-primary-button support-full-button"
                                        type="submit"
                                        disabled={saving}
                                    >
                                        <FiExternalLink />
                                        Link conversation
                                    </button>
                                </form>
                            </section>
                        </>
                    )}
                </aside>
            </div>

            {previewAttachment && (
                <div
                    className="support-attachment-preview-backdrop"
                    onClick={closeAttachmentPreview}
                >
                    <section
                        className="support-attachment-preview-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Preview ${getAttachmentName(previewAttachment)}`}
                        onClick={event => event.stopPropagation()}
                    >
                        <header className="support-attachment-preview-header">
                            <div>
                                <h2>{getAttachmentName(previewAttachment)}</h2>
                                <p>
                                    {formatFileSize(
                                        previewAttachment.fileSizeBytes ??
                                        previewAttachment.size
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="support-icon-button"
                                onClick={closeAttachmentPreview}
                                aria-label="Close attachment preview"
                                title="Close preview"
                            >
                                <FiX />
                            </button>
                        </header>

                        <div className="support-attachment-preview-content">
                            {getAttachmentContentType(previewAttachment) ===
                                "application/pdf" ? (
                                <iframe
                                    src={previewAttachment.previewUrl}
                                    title={getAttachmentName(previewAttachment)}
                                />
                            ) : (
                                <img
                                    src={previewAttachment.previewUrl}
                                    alt={getAttachmentName(previewAttachment)}
                                />
                            )}
                        </div>

                        <footer className="support-attachment-preview-footer">
                            <button
                                type="button"
                                className="support-secondary-button"
                                onClick={closeAttachmentPreview}
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="support-primary-button"
                                onClick={() =>
                                    handleDownloadAttachment(previewAttachment)
                                }
                                disabled={attachmentActionLoading}
                            >
                                <FiDownload />
                                Download attachment
                            </button>
                        </footer>
                    </section>
                </div>
            )}

        </div>
    );
}
