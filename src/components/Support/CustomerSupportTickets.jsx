
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiAlertCircle,
    FiMessageCircle,
    FiRefreshCw,
    FiArrowRight
} from "react-icons/fi";
import http from "../../api/http";
import "./CustomerSupportTickets.css";

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString();
}

function getStatusClass(status) {
    return String(status || "open")
        .toLowerCase()
        .replace(/\s+/g, "-");
}

export default function CustomerSupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadTickets = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await http.get("/support/tickets");

            setTickets(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "We couldn't load your support tickets. Please try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();

    }, [loadTickets]);

    return (
        <section className="customer-support-tickets">
            <div className="customer-support-tickets-header">
                <div>
                    <span className="customer-support-tickets-eyebrow">
                        YOUR SUPPORT
                    </span>

                    <h2>My support requests</h2>

                    <p>
                        View your requests, check their status
                        and continue conversations with our team.
                    </p>
                </div>

                <button
                    type="button"
                    className="customer-support-refresh"
                    onClick={() => loadTickets(true)}
                    disabled={loading || refreshing}
                    aria-label="Refresh support tickets"
                    title="Refresh tickets"
                >
                    <FiRefreshCw />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <div className="customer-support-ticket-state">
                    Loading your support requests...
                </div>
            )}

            {!loading && error && (
                <div
                    className="customer-support-ticket-error"
                    role="alert"
                >
                    <FiAlertCircle />
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() => loadTickets()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && tickets.length === 0 && (
                <div className="customer-support-ticket-empty">
                    <FiMessageCircle />

                    <h3>No support requests yet</h3>

                    <p>
                        When you submit a support request,
                        it will appear here.
                    </p>
                </div>
            )}

            {!loading && !error && tickets.length > 0 && (
                <div className="customer-support-ticket-list">
                    {tickets.map((ticket) => (
                        <article
                            className="customer-support-ticket"
                            key={ticket.id}
                        >
                            <div className="customer-support-ticket-main">
                                <div className="customer-support-ticket-title">
                                    <h3>{ticket.subject}</h3>

                                    <span
                                        className={
                                            "customer-support-status " +
                                            getStatusClass(ticket.status)
                                        }
                                    >
                                        {ticket.status || "Open"}
                                    </span>
                                </div>

                                <p className="customer-support-ticket-description">
                                    {ticket.description}
                                </p>

                                <div className="customer-support-ticket-meta">
                                    <span>
                                        Ticket #{ticket.id}
                                    </span>

                                    <span>
                                        Priority: {ticket.priority || "Normal"}
                                    </span>

                                    <span>
                                        Messages: {ticket.messageCount ?? 0}
                                    </span>

                                    <span>
                                        Updated: {formatDate(
                                            ticket.updatedAt ||
                                            ticket.createdAt
                                        )}
                                    </span>
                                </div>
                            </div>

                            <Link
                                className="customer-support-open-ticket"
                                to={`/help/tickets/${ticket.id}`}
                            >
                                View conversation
                                <FiArrowRight />
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
