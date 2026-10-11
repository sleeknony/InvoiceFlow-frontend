
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiExternalLink,
    FiRefreshCw,
    FiSave
} from "react-icons/fi";
import {
    assignSupportTicket,
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

    const match = options.find(
        (item) =>
            item.label.toLowerCase() === String(value || "").toLowerCase() ||
            item.label.replace(/\s/g, "").toLowerCase() ===
            String(value || "").replace(/\s/g, "").toLowerCase()
    );

    return match?.value ?? "";
}

function displayName(value) {
    return value || "—";
}

export default function SuperAdminSupportTicket() {
    const { ticketId } = useParams();
    const navigate = useNavigate();

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
            setError(
                err?.response?.data?.message ||
                "Unable to load this support ticket."
            );
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        loadTicket();
    }, [loadTicket]);

    const confirmAction = async (title, text) => {
        const result = await Swal.fire({
            title,
            text,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        return result.isConfirmed;
    };

    const showError = async (message) => {
        await Swal.fire({
            title: "Request failed",
            text: message,
            icon: "error",
            confirmButtonText: "OK"
        });
    };

    const handleAssignment = async (event) => {
        event.preventDefault();

        const userId = assignedToUserId.trim();

        if (!userId) {
            await showError(
                "Enter the user ID of the Super Admin you want to assign this ticket to."
            );
            return;
        }

        if (!(await confirmAction(
            "Update ticket assignment?",
            "The selected Super Admin will be assigned this ticket."
        ))) {
            return;
        }

        setSaving(true);

        try {
            await assignSupportTicket(ticketId, {
                assignedToUserId: userId,
                note: assignmentNote.trim() || null
            });

            await Swal.fire({
                title: "Assignment updated",
                text: "The support ticket assignment was saved.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            });

            setAssignmentNote("");
            await loadTicket();
        } catch (err) {
            await showError(
                err?.response?.data?.message ||
                "Unable to assign this ticket. Confirm that the user ID belongs to a Super Admin."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleStatusUpdate = async (event) => {
        event.preventDefault();

        if (status === "") return;

        if (!(await confirmAction(
            "Change ticket status?",
            "This will update the ticket and add an entry to its audit history."
        ))) {
            return;
        }

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

    const handlePriorityUpdate = async (event) => {
        event.preventDefault();

        if (priority === "") return;

        if (!(await confirmAction(
            "Change ticket priority?",
            "The new priority will be saved to the ticket."
        ))) {
            return;
        }

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

    const handleTawkLink = async (event) => {
        event.preventDefault();

        const conversationId = tawkConversationId.trim();

        if (!conversationId) {
            await showError("Enter a Tawk.to conversation ID.");
            return;
        }

        if (!(await confirmAction(
            "Link Tawk.to conversation?",
            "This will associate the conversation ID with this support ticket."
        ))) {
            return;
        }

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

                    <p>
                        Submitted {formatDate(ticket.createdAt)}
                    </p>
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
                                    <a href={`mailto:${ticket.customerEmail}`}>
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
                        </div>

                        <div className="support-description">
                            {ticket.description}
                        </div>
                    </section>

                    <section className="support-detail-card">
                        <h2>Audit history</h2>

                        {auditHistory.length === 0 ? (
                            <p className="support-muted">
                                No audit entries are available for this ticket.
                            </p>
                        ) : (
                            <ol className="support-audit-timeline">
                                {auditHistory.map((entry) => (
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
                                                By {entry.performedByName || entry.performedByUserId}
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
                    <section className="support-detail-card">
                        <h2>Assignment</h2>

                        <p className="support-muted">
                            Enter the Identity user ID of a platform
                            Super Admin. The API validates the role.
                        </p>

                        <form onSubmit={handleAssignment}>
                            <label className="support-form-label">
                                Assigned Super Admin user ID
                                <input
                                    value={assignedToUserId}
                                    onChange={(event) =>
                                        setAssignedToUserId(event.target.value)
                                    }
                                    placeholder="Paste Super Admin user ID"
                                    required
                                />
                            </label>

                            <label className="support-form-label">
                                Note (optional)
                                <textarea
                                    value={assignmentNote}
                                    onChange={(event) =>
                                        setAssignmentNote(event.target.value)
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
                                <FiSave />
                                Save assignment
                            </button>
                        </form>
                    </section>

                    <section className="support-detail-card">
                        <h2>Update status</h2>

                        <form onSubmit={handleStatusUpdate}>
                            <label className="support-form-label">
                                Status
                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                    required
                                >
                                    {STATUS_OPTIONS.map((item) => (
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
                                    onChange={(event) =>
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
                                    onChange={(event) =>
                                        setPriority(event.target.value)
                                    }
                                    required
                                >
                                    {PRIORITY_OPTIONS.map((item) => (
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
                                    onChange={(event) =>
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
                                    onChange={(event) =>
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
                                    onChange={(event) =>
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
                </aside>
            </div>
        </div>
    );
}
