import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FiArrowDown, FiArrowUp, FiChevronDown, FiCheck, FiSearch, FiX, FiFileText, FiDollarSign, FiUsers,
} from "react-icons/fi";

import {
    getInvoiceRegister,
    exportInvoiceRegister,
} from "../../../services/reportsService";

import { getCustomers } from "../../../services/customerService";

import useReportQuery from "../hooks/useReportQuery";
import ReportToolbar from "./ReportToolbar";
import ReportPagination from "./ReportPagination";

const INITIAL_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "IssueDate",
    sortDirection: "desc",
    fromDate: "",
    toDate: "",
    customerId: "",
    status: "",
};

const formatCurrency = (amount, currency = "NGN") => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getCustomerName = (customer) =>
    customer?.companyName ||
    customer?.name ||
    customer?.customerName ||
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
    "Unnamed Customer";

export default function InvoiceRegister() {
    const {
        query,
        updateQuery,
        setPage,
        setPageSize,
        setSorting,
        reset,
    } = useReportQuery(INITIAL_QUERY);

    const [report, setReport] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);

    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    const STATUS_OPTIONS = [
        { value: "", label: "All Statuses" },
        { value: "Draft", label: "Draft" },
        { value: "PendingApproval", label: "Pending Approval" },
        { value: "Approved", label: "Approved" },
        { value: "Sent", label: "Sent" },
        { value: "PartiallyPaid", label: "Partially Paid" },
        { value: "Paid", label: "Paid" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Void", label: "Void" },
    ];

    const loadCustomers = useCallback(async () => {
        setCustomersLoading(true);

        try {
            const response = await getCustomers();

            const data = response?.data ?? response ?? [];

            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load customers:", err);
        } finally {
            setCustomersLoading(false);
        }
    }, []);

    const loadReport = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getInvoiceRegister(query);

            setReport(data);
        } catch (err) {
            console.error("Failed to load invoice register:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to load invoice register."
            );
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const handleExport = async () => {
        setExporting(true);

        try {
            const response =
                await exportInvoiceRegister(query);

            const blob = new Blob(
                [response.data],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `invoice-register-${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(
                "Failed to export invoice register:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to export invoice register."
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

    const invoiceCount =
        Number(summary.invoiceCount ?? 0);

    const totalInvoiced =
        Number(summary.totalInvoiced ?? 0);

    const totalPaid =
        Number(summary.totalPaid ?? 0);

    const totalOutstanding =
        Number(summary.totalOutstanding ?? 0);

    const totalPages =
        Number(report?.totalPages ?? 0);

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

    const filteredCustomers = customers.filter((customer) => {
        const name = getCustomerName(customer);

        return name
            .toLowerCase()
            .includes(customerSearch.trim().toLowerCase());
    });

    const selectedCustomer = customers.find(
        (customer) =>
            String(customer.id) === String(query.customerId)
    );

    const selectedStatus =
        STATUS_OPTIONS.find(
            (status) => status.value === (query.status || "")
        ) || STATUS_OPTIONS[0];

    return (
        <div className="settings-panel">

            <div className="report-page-header">
                <div>
                    <h2 className="report-section-title">
                        Invoice Register
                    </h2>

                    <p className="report-section-subtitle">
                        View and analyse all invoices issued by your company.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiFileText />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Invoice Count
                        </div>

                        <div className="report-summary-value">
                            {invoiceCount.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiDollarSign />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Total Invoiced
                        </div>

                        <div className="report-summary-value">
                            {formatCurrency(totalInvoiced)}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiDollarSign />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Total Paid
                        </div>

                        <div className="report-summary-value">
                            {formatCurrency(totalPaid)}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiUsers />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Total Outstanding
                        </div>

                        <div className="report-summary-value">
                            {formatCurrency(totalOutstanding)}
                        </div>
                    </div>
                </div>

            </div>

            <ReportToolbar
                search={query.search}
                onSearchChange={(value) =>
                    updateQuery("search", value)
                }

                fromDate={query.fromDate}
                toDate={query.toDate}

                onFromDateChange={(value) =>
                    updateQuery("fromDate", value)
                }

                onToDateChange={(value) =>
                    updateQuery("toDate", value)
                }

                onRefresh={loadReport}
                onReset={handleReset}
                onExport={handleExport}
                exporting={exporting}
            >
                <div className="report-filter-field">
                    <label>Customer</label>

                    <div className="report-customer-selector">

                        <button
                            type="button"
                            className="report-customer-select"
                            onClick={() => {
                                setCustomerDropdownOpen(
                                    current => !current
                                );

                                setStatusDropdownOpen(false);
                            }}
                            disabled={customersLoading}
                        >
                            <span>
                                {customersLoading
                                    ? "Loading customers..."
                                    : selectedCustomer
                                        ? getCustomerName(selectedCustomer)
                                        : "All Customers"}
                            </span>

                            <FiChevronDown
                                className={`customer-chevron ${customerDropdownOpen
                                        ? "open"
                                        : ""
                                    }`}
                            />
                        </button>

                        {customerDropdownOpen && (
                            <div className="report-customer-dropdown">

                                <div className="report-customer-search">

                                    <FiSearch />

                                    <input
                                        type="text"
                                        value={customerSearch}
                                        onChange={(e) =>
                                            setCustomerSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search customers..."
                                        autoFocus
                                    />

                                    {customerSearch && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCustomerSearch("")
                                            }
                                        >
                                            <FiX />
                                        </button>
                                    )}

                                </div>

                                <div className="report-customer-options">

                                    <button
                                        type="button"
                                        className={`report-customer-option ${!query.customerId
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() => {
                                            updateQuery(
                                                "customerId",
                                                ""
                                            );

                                            setCustomerDropdownOpen(
                                                false
                                            );

                                            setCustomerSearch("");
                                        }}
                                    >
                                        All Customers

                                        {!query.customerId && (
                                            <FiCheck />
                                        )}
                                    </button>

                                    {filteredCustomers.map(
                                        (customer) => {
                                            const isSelected =
                                                String(
                                                    customer.id
                                                ) ===
                                                String(
                                                    query.customerId
                                                );

                                            return (
                                                <button
                                                    type="button"
                                                    key={customer.id}
                                                    className={`report-customer-option ${isSelected
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                    onClick={() => {
                                                        updateQuery(
                                                            "customerId",
                                                            String(
                                                                customer.id
                                                            )
                                                        );

                                                        setCustomerDropdownOpen(
                                                            false
                                                        );

                                                        setCustomerSearch("");
                                                    }}
                                                >
                                                    <span>
                                                        {getCustomerName(
                                                            customer
                                                        )}
                                                    </span>

                                                    {isSelected && (
                                                        <FiCheck />
                                                    )}
                                                </button>
                                            );
                                        }
                                    )}

                                    {filteredCustomers.length === 0 && (
                                        <div className="report-customer-no-results">
                                            No customers found.
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="report-filter-field">
                    <label>Status</label>

                    <div className="report-status-selector">

                        <button
                            type="button"
                            className="report-status-select"
                            onClick={() => {
                                setStatusDropdownOpen(
                                    current => !current
                                );

                                setCustomerDropdownOpen(false);
                            }}
                        >
                            <span>
                                {selectedStatus.label}
                            </span>

                            <FiChevronDown
                                className={`status-chevron ${statusDropdownOpen
                                        ? "open"
                                        : ""
                                    }`}
                            />
                        </button>

                        {statusDropdownOpen && (
                            <div className="report-status-dropdown">

                                {STATUS_OPTIONS.map((status) => {
                                    const isSelected =
                                        status.value ===
                                        (query.status || "");

                                    return (
                                        <button
                                            type="button"
                                            key={status.value || "all"}
                                            className={`report-status-option ${isSelected
                                                    ? "active"
                                                    : ""
                                                }`}
                                            onClick={() => {
                                                updateQuery(
                                                    "status",
                                                    status.value
                                                );

                                                setStatusDropdownOpen(
                                                    false
                                                );
                                            }}
                                        >
                                            <span>
                                                {status.label}
                                            </span>

                                            {isSelected && (
                                                <FiCheck />
                                            )}
                                        </button>
                                    );
                                })}

                            </div>
                        )}

                    </div>
                </div>
            </ReportToolbar>

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
                                onClick={() =>
                                    handleSort("IssueDate")
                                }
                            >
                                <span>
                                    Issue Date
                                    {renderSortIcon("IssueDate")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("DocumentNumber")
                                }
                            >
                                <span>
                                    Invoice Number
                                    {renderSortIcon(
                                        "DocumentNumber"
                                    )}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("CustomerName")
                                }
                            >
                                <span>
                                    Customer
                                    {renderSortIcon(
                                        "CustomerName"
                                    )}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("DueDate")
                                }
                            >
                                <span>
                                    Due Date
                                    {renderSortIcon("DueDate")}
                                </span>
                            </th>

                            <th
                                className="sortable text-end"
                                onClick={() =>
                                    handleSort("Total")
                                }
                            >
                                <span>
                                    Total
                                    {renderSortIcon("Total")}
                                </span>
                            </th>

                            <th
                                className="sortable text-end"
                                onClick={() =>
                                    handleSort("AmountPaid")
                                }
                            >
                                <span>
                                    Paid
                                    {renderSortIcon(
                                        "AmountPaid"
                                    )}
                                </span>
                            </th>

                            <th
                                className="sortable text-end"
                                onClick={() =>
                                    handleSort("BalanceDue")
                                }
                            >
                                <span>
                                    Balance
                                    {renderSortIcon(
                                        "BalanceDue"
                                    )}
                                </span>
                            </th>

                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="report-table-loading"
                                >
                                    Loading invoice register...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="report-table-empty"
                                >
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((invoice) => (
                                <tr
                                    key={
                                        invoice.documentId
                                    }
                                >

                                    <td>
                                        {formatDate(
                                            invoice.issueDate
                                        )}
                                    </td>

                                    <td>
                                        <span className="report-reference">
                                            {
                                                invoice.documentNumber
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        {
                                            invoice.customerName ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        {formatDate(
                                            invoice.dueDate
                                        )}
                                    </td>

                                    <td className="text-end report-amount">
                                        {formatCurrency(
                                            invoice.total,
                                            invoice.currency
                                        )}
                                    </td>

                                    <td className="text-end report-amount">
                                        {formatCurrency(
                                            invoice.amountPaid,
                                            invoice.currency
                                        )}
                                    </td>

                                    <td className="text-end report-amount">
                                        {formatCurrency(
                                            invoice.balanceDue,
                                            invoice.currency
                                        )}
                                    </td>

                                    <td>
                                        <span className="report-status-badge">
                                            {
                                                invoice.status ||
                                                "-"
                                            }
                                        </span>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

            {!loading && report && (
                <ReportPagination
                    page={
                        report.page ??
                        query.page
                    }

                    pageSize={
                        report.pageSize ??
                        query.pageSize
                    }

                    totalCount={
                        report.totalCount ??
                        0
                    }

                    totalPages={totalPages}

                    onPageChange={setPage}

                    onPageSizeChange={
                        setPageSize
                    }
                />
            )}

        </div>
    );
}