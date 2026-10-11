import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FiActivity,
    FiArrowDown,
    FiArrowUp,
    FiCheck,
    FiCheckCircle,
    FiChevronDown,
    FiCreditCard,
    FiFileText,
    FiLogIn,
    FiLogOut,
    FiPlus,
    FiSend,
    FiTrash2,
    FiUser,
    FiUsers,
    FiXCircle,
} from "react-icons/fi";

import {
    getActivityLog,
    exportActivityLog,
} from "../../../services/reportsService";

import useReportQuery from "../hooks/useReportQuery";
import ReportToolbar from "../components/ReportToolbar";
import ReportPagination from "../components/ReportPagination";

const INITIAL_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "CreatedAt",
    sortDirection: "desc",
    fromDate: "",
    toDate: "",
    userId: "",
    action: "",
    entityType: "",
};

const ACTION_OPTIONS = [
    { value: "", label: "All Actions", icon: FiActivity },
    { value: "Login", label: "Login", icon: FiLogIn },
    { value: "Logout", label: "Logout", icon: FiLogOut },
    { value: "CustomerCreated", label: "Customer Created", icon: FiPlus },
    { value: "CustomerUpdated", label: "Customer Updated", icon: FiUser },
    { value: "CustomerDeleted", label: "Customer Deleted", icon: FiTrash2 },
    { value: "DocumentCreated", label: "Document Created", icon: FiFileText },
    { value: "DocumentUpdated", label: "Document Updated", icon: FiFileText },
    { value: "DocumentDeleted", label: "Document Deleted", icon: FiTrash2 },
    { value: "DocumentSent", label: "Document Sent", icon: FiSend },
    {
        value: "DocumentSubmittedForApproval",
        label: "Submitted For Approval",
        icon: FiSend,
    },
    { value: "DocumentApproved", label: "Document Approved", icon: FiCheckCircle },
    { value: "DocumentRejected", label: "Document Rejected", icon: FiXCircle },
    { value: "PaymentRecorded", label: "Payment Recorded", icon: FiCreditCard },
];

const ENTITY_OPTIONS = [
    { value: "", label: "All Entities", icon: FiActivity },
    { value: "User", label: "User", icon: FiUser },
    { value: "Customer", label: "Customer", icon: FiUsers },
    { value: "Document", label: "Document", icon: FiFileText },
    { value: "Payment", label: "Payment", icon: FiCreditCard },
    { value: "Approval", label: "Approval", icon: FiCheckCircle },
];

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatActionLabel = (value) => {
    if (!value) return "-";

    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
};

const formatEntityType = (value) => {
    if (!value) return "-";

    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
};

function ActivityFilterDropdown({
    label,
    value,
    options,
    onChange,
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const selected =
        options.find(option => option.value === value) ||
        options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const SelectedIcon = selected.icon;

    return (
        <div className="activity-filter-field" ref={containerRef}>
            <label className="activity-filter-label">
                {label}
            </label>

            <div className="activity-filter-selector">
                <button
                    type="button"
                    className={`activity-filter-trigger ${open ? "open" : ""}`}
                    onClick={() => setOpen(current => !current)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="activity-filter-trigger-content">
                        <span className="activity-filter-trigger-icon">
                            <SelectedIcon />
                        </span>

                        <span className="activity-filter-trigger-text">
                            {selected.label}
                        </span>
                    </span>

                    <FiChevronDown
                        className={`activity-filter-chevron ${open ? "open" : ""}`}
                    />
                </button>

                {open && (
                    <div
                        className="activity-filter-dropdown"
                        role="listbox"
                    >
                        {options.map(option => {
                            const OptionIcon = option.icon;
                            const isActive = option.value === value;

                            return (
                                <button
                                    type="button"
                                    key={option.value || "all"}
                                    className={`activity-filter-option ${isActive ? "active" : ""
                                        }`}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <span className="activity-filter-option-main">
                                        <span className="activity-filter-option-icon">
                                            <OptionIcon />
                                        </span>

                                        <span>
                                            {option.label}
                                        </span>
                                    </span>

                                    {isActive && (
                                        <FiCheck className="activity-filter-option-check" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UserActivity() {
    const {
        query,
        updateQuery,
        setPage,
        setPageSize,
        setSorting,
        reset,
    } = useReportQuery(INITIAL_QUERY);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");

    const loadReport = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getActivityLog(query);
            setReport(data);
        } catch (err) {
            console.error("Failed to load user activity:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to load user activity."
            );
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const handleExport = async () => {
        setExporting(true);

        try {
            const response = await exportActivityLog(query);

            const blob = new Blob(
                [response.data],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `user-activity-${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export user activity:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to export user activity."
            );
        } finally {
            setExporting(false);
        }
    };

    const handleReset = () => {
        reset();
    };

    const handleSort = (column) => {
        setSorting(column);
    };

    const rows = useMemo(
        () => report?.items || [],
        [report]
    );

    const summary = report?.summary || {};

    const totalActivities = Number(
        summary.totalActivities ?? report?.totalCount ?? 0
    );

    const activeUsers = Number(summary.activeUsers ?? 0);
    const documentActivities = Number(summary.documentActivities ?? 0);
    const customerActivities = Number(summary.customerActivities ?? 0);
    const paymentActivities = Number(summary.paymentActivities ?? 0);
    const approvalActivities = Number(summary.approvalActivities ?? 0);

    const totalPages = Number(report?.totalPages ?? 0);

    const renderSortIcon = (column) => {
        if (
            query.sortBy?.toLowerCase() !==
            column.toLowerCase()
        ) {
            return null;
        }

        return query.sortDirection === "asc"
            ? <FiArrowUp />
            : <FiArrowDown />;
    };

    return (
        <div className="settings-panel">
            <div className="report-page-header">
                <div>
                    <h2 className="report-section-title">
                        User Activity
                    </h2>

                    <p className="report-section-subtitle">
                        View and analyse user activity across your company.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">
                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiActivity />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Total Activities
                        </div>
                        <div className="report-summary-value">
                            {totalActivities.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiUsers />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Active Users
                        </div>
                        <div className="report-summary-value">
                            {activeUsers.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiFileText />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Document Activities
                        </div>
                        <div className="report-summary-value">
                            {documentActivities.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiUsers />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Customer Activities
                        </div>
                        <div className="report-summary-value">
                            {customerActivities.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiCreditCard />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Payment Activities
                        </div>
                        <div className="report-summary-value">
                            {paymentActivities.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiCheckCircle />
                    </div>
                    <div>
                        <div className="report-summary-label">
                            Approval Activities
                        </div>
                        <div className="report-summary-value">
                            {approvalActivities.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <ReportToolbar
                search={query.search}
                onSearchChange={value =>
                    updateQuery("search", value)
                }
                fromDate={query.fromDate}
                toDate={query.toDate}
                onFromDateChange={value =>
                    updateQuery("fromDate", value)
                }
                onToDateChange={value =>
                    updateQuery("toDate", value)
                }
                onRefresh={loadReport}
                onReset={handleReset}
                onExport={handleExport}
                exporting={exporting}
            />

            <div className="activity-filter-row">
                <ActivityFilterDropdown
                    label="Action"
                    value={query.action}
                    options={ACTION_OPTIONS}
                    onChange={value =>
                        updateQuery("action", value)
                    }
                />

                <ActivityFilterDropdown
                    label="Entity Type"
                    value={query.entityType}
                    options={ENTITY_OPTIONS}
                    onChange={value =>
                        updateQuery("entityType", value)
                    }
                />
            </div>

            {error && (
                <div className="report-error">
                    {error}
                </div>
            )}

            <div className="report-table-wrapper">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th
                                className="sortable"
                                onClick={() => handleSort("CreatedAt")}
                            >
                                <span>
                                    Date & Time
                                    {renderSortIcon("CreatedAt")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() => handleSort("UserId")}
                            >
                                <span>
                                    User
                                    {renderSortIcon("UserId")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() => handleSort("Action")}
                            >
                                <span>
                                    Action
                                    {renderSortIcon("Action")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() => handleSort("EntityType")}
                            >
                                <span>
                                    Entity
                                    {renderSortIcon("EntityType")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() => handleSort("DocumentNumber")}
                            >
                                <span>
                                    Document
                                    {renderSortIcon("DocumentNumber")}
                                </span>
                            </th>

                            <th>Description</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="report-table-loading"
                                >
                                    Loading user activity...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="report-table-empty"
                                >
                                    No user activity found.
                                </td>
                            </tr>
                        ) : (
                            rows.map(activity => (
                                <tr key={activity.id}>
                                    <td>
                                        {formatDateTime(activity.createdAt)}
                                    </td>

                                    <td>
                                        <span className="report-reference">
                                            {activity.userName || "System"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="report-status-badge">
                                            {formatActionLabel(activity.action)}
                                        </span>
                                    </td>

                                    <td>
                                        {formatEntityType(activity.entityType)}
                                    </td>

                                    <td>
                                        {activity.documentNumber || "-"}
                                    </td>

                                    <td>
                                        {activity.description || "-"}
                                    </td>

                                    <td>
                                        {activity.ipAddress || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && report && (
                <ReportPagination
                    page={report.page ?? query.page}
                    pageSize={report.pageSize ?? query.pageSize}
                    totalCount={report.totalCount ?? 0}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    );
}
