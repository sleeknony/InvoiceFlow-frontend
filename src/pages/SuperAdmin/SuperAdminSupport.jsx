import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiRefreshCw,
    FiSearch,
    FiMessageSquare,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle
} from "react-icons/fi";

import { getSupportTickets } from "../../services/superAdminSupportService";
import "./SuperAdminSupport.css";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "Open", label: "Open" },
    { value: "InProgress", label: "In progress" },
    { value: "WaitingForCustomer", label: "Waiting for customer" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" }
];

const PRIORITY_OPTIONS = [
    { value: "", label: "All priorities" },
    { value: "Low", label: "Low" },
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" },
    { value: "Urgent", label: "Urgent" }
];

const STATUS_LABELS = {
    1: "Open",
    2: "In progress",
    3: "Waiting for customer",
    4: "Resolved",
    5: "Closed",
    Open: "Open",
    InProgress: "In progress",
    WaitingForCustomer: "Waiting for customer",
    Resolved: "Resolved",
    Closed: "Closed"
};

const PRIORITY_LABELS = {
    1: "Low",
    2: "Normal",
    3: "High",
    4: "Urgent",
    Low: "Low",
    Normal: "Normal",
    High: "High",
    Urgent: "Urgent"
};

const getLabel = (mapping, value) =>
    mapping[value] ?? String(value ?? "Unknown");

const getStatusClass = (value) =>
    `status-${String(value ?? "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()}`;

const getPriorityClass = (value) =>
    `priority-${String(value ?? "").toLowerCase()}`;

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString();
};

const getTicketArray = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.tickets)) return response.tickets;
    if (Array.isArray(response?.results)) return response.results;

    return [];
};

export default function SuperAdminSupport() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignment, setAssignment] = useState("all");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError("");

        const params = {
            page,
            pageSize: PAGE_SIZE
        };

        if (search.trim()) params.search = search.trim();
        if (status) params.status = status;
        if (priority) params.priority = priority;

        if (assignment === "unassigned") {
            params.assignedToUserId = "unassigned";
        }

        try {
            const response = await getSupportTickets(params);

            setTickets(getTicketArray(response));
            setTotalCount(
                Number(response?.totalCount ?? response?.total ?? 0)
            );
            setTotalPages(
                Math.max(
                    1,
                    Number(response?.totalPages ?? 1)
                )
            );
        } catch (err) {
            console.error("Failed to load support tickets:", err);

            setTickets([]);
            setTotalCount(0);
            setTotalPages(1);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                "Unable to load support tickets. Check your connection and Super Admin access."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, search, status, priority, assignment]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const applyFilters = (event) => {
        event.preventDefault();

        setPage(1);
        setSearch(searchInput.trim());
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatus("");
        setPriority("");
        setAssignment("all");
        setPage(1);
    };

    const refresh = () => {
        setRefreshing(true);
        loadTickets();
    };

    return (
        <div className="superadmin-support-page">
            <div className="support-page-header">
                <div>
                    <div className="superadmin-support-eyebrow">
                        CUSTOMER SERVICE
                    </div>

                    <h1>Support tickets</h1>

                    <p>
                        Review customer requests, manage assignments,
                        and track support progress.
                    </p>
                </div>

                <button
                    type="button"
                    className="support-secondary-button"
                    onClick={refresh}
                    disabled={loading}
                >
                    <FiRefreshCw
                        className={refreshing ? "support-spinning" : ""}
                    />
                    Refresh
                </button>
            </div>

            <div className="support-summary-card">
                <div className="support-summary-icon">
                    <FiMessageSquare />
                </div>

                <div>
                    <span>Total matching tickets</span>
                    <strong>
                        {loading ? "…" : totalCount.toLocaleString()}
                    </strong>
                </div>
            </div>

            <form
                className="support-filter-panel"
                onSubmit={applyFilters}
            >
                <div className="support-search-field">
                    <FiSearch />

                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(event.target.value)
                        }
                        placeholder="Search subject, customer, or email"
                        aria-label="Search support tickets"
                    />
                </div>

                <select
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value);
                        setPage(1);
                    }}
                    aria-label="Filter by status"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={priority}
                    onChange={(event) => {
                        setPriority(event.target.value);
                        setPage(1);
                    }}
                    aria-label="Filter by priority"
                >
                    {PRIORITY_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <select
                    value={assignment}
                    onChange={(event) => {
                        setAssignment(event.target.value);
                        setPage(1);
                    }}
                    aria-label="Filter by assignment"
                >
                    <option value="all">All assignments</option>
                    <option value="unassigned">Unassigned only</option>
                </select>

                <button type="submit" className="support-apply-button">
                    Apply
                </button>

                <button
                    type="button"
                    className="support-clear-button"
                    onClick={clearFilters}
                >
                    Clear
                </button>
            </form>

            {error && (
                <div className="support-error-message" role="alert">
                    <FiAlertCircle />
                    <span>{error}</span>

                    <button type="button" onClick={refresh}>
                        Retry
                    </button>
                </div>
            )}

            <div className="support-table-card">
                <div className="support-table-heading">
                    <h2>Ticket queue</h2>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                </div>

                <div className="support-table-scroll">
                    <table className="support-ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket</th>
                                <th>Customer</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assigned to</th>
                                <th>Created</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="support-table-message">
                                        Loading support tickets…
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="support-table-message">
                                        No support tickets match these filters.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="support-ticket-row"
                                        onClick={() =>
                                            navigate(
                                                `/superadmin/support/tickets/${ticket.id}`
                                            )
                                        }
                                    >
                                        <td>
                                            <strong>
                                                #{ticket.id}
                                            </strong>

                                            <span className="support-ticket-subject">
                                                {ticket.subject}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>
                                                {ticket.customerName || "Unknown"}
                                            </strong>

                                            <span className="support-muted">
                                                {ticket.customerEmail || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            {ticket.companyName || "Personal account"}
                                        </td>

                                        <td>
                                            <span
                                                className={`support-status-badge ${getStatusClass(ticket.status)}`}
                                            >
                                                {getLabel(
                                                    STATUS_LABELS,
                                                    ticket.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`support-priority-badge ${getPriorityClass(ticket.priority)}`}
                                            >
                                                {getLabel(
                                                    PRIORITY_LABELS,
                                                    ticket.priority
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {ticket.assignedToName || "Unassigned"}
                                        </td>

                                        <td>
                                            {formatDate(ticket.createdAt)}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="support-open-button"
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    navigate(
                                                        `/superadmin/support/tickets/${ticket.id}`
                                                    );
                                                }}
                                                aria-label={`Open ticket ${ticket.id}`}
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="support-pagination">
                    <span>
                        {totalCount === 0
                            ? "No tickets"
                            : `Showing ${((page - 1) * PAGE_SIZE) + 1}-${Math.min(
                                page * PAGE_SIZE,
                                totalCount
                            )} of ${totalCount}`}
                    </span>

                    <div>
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                            aria-label="Previous page"
                        >
                            <FiChevronLeft />
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(totalPages, current + 1)
                                )
                            }
                            aria-label="Next page"
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}