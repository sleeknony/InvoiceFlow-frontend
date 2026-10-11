import { useCallback, useEffect, useState } from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiChevronDown,
    FiMinus,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
    exportCustomerStatement,
    getCustomerStatement,
} from "../../../services/reportsService";

import { getCustomers } from "../../../services/customerService";

import useReportQuery from "../hooks/useReportQuery";
import ReportToolbar from "./ReportToolbar";
import ReportPagination from "./ReportPagination";

const INITIAL_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "Date",
    sortDirection: "asc",
    fromDate: "",
    toDate: "",
};

export default function CustomerStatement() {
    const [customers, setCustomers] = useState([]);
    const [customersLoading, setCustomersLoading] =
        useState(true);

    const [customerId, setCustomerId] =
        useState("");
    const [customerSearch, setCustomerSearch] =
        useState("");

    const [customerDropdownOpen, setCustomerDropdownOpen] =
        useState(false);

    const [report, setReport] = useState({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
        summary: {
            customerName: "",
            openingBalance: 0,
            totalInvoiced: 0,
            totalPaid: 0,
            closingBalance: 0,
            invoiceCount: 0,
            paymentCount: 0,
        },
    });

    const [loading, setLoading] =
        useState(false);

    const [exporting, setExporting] =
        useState(false);

    const {
        query,
        updateQuery,
        setPage,
        setPageSize,
        setSorting,
        reset,
    } = useReportQuery(INITIAL_QUERY);

    /*
     * Load customers for the selector.
     */
    useEffect(() => {
        async function loadCustomers() {
            try {
                setCustomersLoading(true);

                const response =
                    await getCustomers();

                const data =
                    Array.isArray(response)
                        ? response
                        : Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [];

                setCustomers(data);
            }
            catch (error) {
                console.error(
                    "Failed to load customers:",
                    error
                );

                toast.error(
                    "Failed to load customers."
                );
            }
            finally {
                setCustomersLoading(false);
            }
        }

        loadCustomers();
    }, []);

    /*
     * Load customer statement.
     */
    const loadReport = useCallback(async () => {
        if (!customerId) {
            setReport({
                items: [],
                totalCount: 0,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: 0,
                summary: {
                    customerName: "",
                    openingBalance: 0,
                    totalInvoiced: 0,
                    totalPaid: 0,
                    closingBalance: 0,
                    invoiceCount: 0,
                    paymentCount: 0,
                },
            });

            return;
        }

        try {
            setLoading(true);

            const result =
                await getCustomerStatement({
                    ...query,
                    customerId:
                        Number(customerId),
                });

            setReport({
                items:
                    Array.isArray(result?.items)
                        ? result.items
                        : [],

                totalCount:
                    Number(result?.totalCount) || 0,

                page:
                    Number(result?.page) ||
                    query.page,

                pageSize:
                    Number(result?.pageSize) ||
                    query.pageSize,

                totalPages:
                    Number(result?.totalPages) || 0,

                summary:
                    result?.summary || {
                        customerName: "",
                        openingBalance: 0,
                        totalInvoiced: 0,
                        totalPaid: 0,
                        closingBalance: 0,
                        invoiceCount: 0,
                        paymentCount: 0,
                    },
            });
        }
        catch (error) {
            console.error(
                "Failed to load customer statement:",
                error
            );

            setReport({
                items: [],
                totalCount: 0,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: 0,
                summary: {
                    customerName: "",
                    openingBalance: 0,
                    totalInvoiced: 0,
                    totalPaid: 0,
                    closingBalance: 0,
                    invoiceCount: 0,
                    paymentCount: 0,
                },
            });

            toast.error(
                "Failed to load customer statement."
            );
        }
        finally {
            setLoading(false);
        }
    }, [customerId, query]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    function handleCustomerChange(value) {
        setCustomerId(value);

        /*
         * Reset pagination when switching customers.
         */
        setPage(1);
    }

    function formatCurrency(
        value,
        currency = "NGN"
    ) {
        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency:
                    currency || "NGN",
                minimumFractionDigits: 2,
            }
        ).format(
            Number(value || 0)
        );
    }

    function formatDate(value) {
        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return date.toLocaleDateString(
            "en-NG",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    function handleSort(column) {
        setSorting(column);
    }

    function renderSortIcon(column) {
        if (
            query.sortBy !== column
        ) {
            return (
                <FiMinus
                    className="report-sort-icon"
                />
            );
        }

        if (
            query.sortDirection ===
            "asc"
        ) {
            return (
                <FiArrowUp
                    className="report-sort-icon active"
                />
            );
        }

        return (
            <FiArrowDown
                className="report-sort-icon active"
            />
        );
    }

    function getCustomerName(customer) {
        return (
            customer.companyName ||
            customer.name ||
            customer.customerName ||
            `${customer.firstName || ""} ${customer.lastName || ""
                }`.trim() ||
            `Customer #${customer.id}`
        );
    }

    async function downloadExcel() {
        if (!customerId) {
            toast.error(
                "Please select a customer first."
            );

            return;
        }

        try {
            setExporting(true);

            const exportQuery = {
                customerId:
                    Number(customerId),

                search:
                    query.search ||
                    undefined,

                sortBy:
                    query.sortBy ||
                    undefined,

                sortDirection:
                    query.sortDirection ||
                    undefined,

                fromDate:
                    query.fromDate ||
                    undefined,

                toDate:
                    query.toDate ||
                    undefined,
            };

            const response =
                await exportCustomerStatement(
                    exportQuery
                );

            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `Customer-Statement-${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`;

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                url
            );

            toast.success(
                "Customer statement exported successfully."
            );
        }
        catch (error) {
            console.error(
                "Failed to export customer statement:",
                error
            );

            toast.error(
                "Failed to export customer statement."
            );
        }
        finally {
            setExporting(false);
        }
    }

    function handleReset() {
        reset();
        setCustomerId("");
        setCustomerSearch("");
        setCustomerDropdownOpen(false);
    }

    const summary =
        report.summary || {
            customerName: "",
            openingBalance: 0,
            totalInvoiced: 0,
            totalPaid: 0,
            closingBalance: 0,
            invoiceCount: 0,
            paymentCount: 0,
        };

    const filteredCustomers =
        customers.filter((customer) => {
            const name =
                getCustomerName(customer);

            return name
                .toLowerCase()
                .includes(
                    customerSearch
                        .trim()
                        .toLowerCase()
                );
        });

    const selectedCustomer =
        customers.find(
            (customer) =>
                String(customer.id) ===
                String(customerId)
        );

    return (
        <div>
            <div className="report-content-header">
                <div>
                    <h2>
                        Customer Statement
                    </h2>

                    <p>
                        View a customer's invoices,
                        payments, and running account
                        balance.
                    </p>
                </div>
            </div>

            {/* Customer selector */}
            <div className="report-toolbar">
                <div
                    className="report-toolbar-main"
                    style={{
                        flexWrap: "nowrap",
                    }}
                >
                    <div
                        className="report-date-filter"
                        style={{
                            width: "280px",
                        }}
                    >
                        

                        <div
                            className="report-customer-selector"
                            style={{
                                position: "relative",
                                width: "280px",
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "5px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#6b7280",
                                }}
                            >
                                Customer
                            </label>

                            <button
                                type="button"
                                className="report-customer-select"
                                onClick={() =>
                                    setCustomerDropdownOpen(
                                        (current) => !current
                                    )
                                }
                                disabled={customersLoading}
                            >
                                <span>
                                    {customersLoading
                                        ? "Loading customers..."
                                        : selectedCustomer
                                            ? getCustomerName(
                                                selectedCustomer
                                            )
                                            : "Select customer"}
                                </span>

                                <FiChevronDown
                                    className={
                                        customerDropdownOpen
                                            ? "customer-chevron open"
                                            : "customer-chevron"
                                    }
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

                                        {filteredCustomers.length === 0 && (
                                            <div className="report-customer-no-results">
                                                No customers found.
                                            </div>
                                        )}

                                        {filteredCustomers.map(
                                            (customer) => (
                                                <button
                                                    key={customer.id}
                                                    type="button"
                                                    className={
                                                        String(
                                                            customer.id
                                                        ) ===
                                                            String(
                                                                customerId
                                                            )
                                                            ? "report-customer-option active"
                                                            : "report-customer-option"
                                                    }
                                                    onClick={() => {
                                                        handleCustomerChange(
                                                            customer.id
                                                        );

                                                        setCustomerDropdownOpen(
                                                            false
                                                        );

                                                        setCustomerSearch(
                                                            ""
                                                        );
                                                    }}
                                                >
                                                    {getCustomerName(
                                                        customer
                                                    )}
                                                </button>
                                            )
                                        )}

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {!customerId && (
                <div className="report-empty">
                    <h3 className="report-empty-title">
                        Select a customer
                    </h3>

                    <p className="report-empty-text">
                        Select a customer above to
                        view their statement.
                    </p>
                </div>
            )}

            {customerId && (
                <>
                    <div className="reports-summary-grid">

                        <div className="report-summary-card">
                            <div className="report-summary-label">
                                Opening Balance
                            </div>

                            <div className="report-summary-value">
                                {formatCurrency(
                                    summary.openingBalance
                                )}
                            </div>
                        </div>

                        <div className="report-summary-card">
                            <div className="report-summary-label">
                                Total Invoiced
                            </div>

                            <div className="report-summary-value">
                                {formatCurrency(
                                    summary.totalInvoiced
                                )}
                            </div>
                        </div>

                        <div className="report-summary-card">
                            <div className="report-summary-label">
                                Total Paid
                            </div>

                            <div className="report-summary-value">
                                {formatCurrency(
                                    summary.totalPaid
                                )}
                            </div>
                        </div>

                        <div className="report-summary-card">
                            <div className="report-summary-label">
                                Closing Balance
                            </div>

                            <div className="report-summary-value">
                                {formatCurrency(
                                    summary.closingBalance
                                )}
                            </div>
                        </div>

                    </div>

                    <ReportToolbar
                        search={
                            query.search
                        }
                        onSearchChange={(
                            value
                        ) =>
                            updateQuery(
                                "search",
                                value
                            )
                        }
                        fromDate={
                            query.fromDate
                        }
                        toDate={
                            query.toDate
                        }
                        onFromDateChange={(
                            value
                        ) =>
                            updateQuery(
                                "fromDate",
                                value
                            )
                        }
                        onToDateChange={(
                            value
                        ) =>
                            updateQuery(
                                "toDate",
                                value
                            )
                        }
                        onRefresh={
                            loadReport
                        }
                        onReset={
                            handleReset
                        }
                        onExport={
                            downloadExcel
                        }
                        exporting={
                            exporting
                        }
                    />

                    <div
                        style={{
                            marginBottom:
                                "18px",
                            fontSize:
                                "14px",
                            color:
                                "#6b7280",
                        }}
                    >
                        Statement for{" "}
                        <strong
                            style={{
                                color:
                                    "#1f2937",
                            }}
                        >
                            {
                                summary.customerName
                            }
                        </strong>
                    </div>

                    {loading && (
                        <div className="report-loading">
                            <div className="report-loading-spinner" />
                            Loading customer
                            statement...
                        </div>
                    )}

                    {!loading &&
                        report.items
                            .length === 0 && (
                            <div className="report-empty">
                                <h3 className="report-empty-title">
                                    No statement
                                    transactions
                                </h3>

                                <p className="report-empty-text">
                                    No transactions
                                    match the
                                    current
                                    filters.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        report.items
                            .length > 0 && (
                            <>
                                <div className="report-table-wrapper">

                                    <table className="report-table">

                                        <thead>

                                            <tr>

                                                <th
                                                    className="sortable"
                                                    onClick={() =>
                                                        handleSort(
                                                            "Date"
                                                        )
                                                    }
                                                >
                                                    <span className="report-sort-header">
                                                        Date

                                                        {renderSortIcon(
                                                            "Date"
                                                        )}
                                                    </span>
                                                </th>

                                                <th
                                                    className="sortable"
                                                    onClick={() =>
                                                        handleSort(
                                                            "DocumentNumber"
                                                        )
                                                    }
                                                >
                                                    <span className="report-sort-header">
                                                        Reference

                                                        {renderSortIcon(
                                                            "DocumentNumber"
                                                        )}
                                                    </span>
                                                </th>

                                                <th
                                                    className="sortable"
                                                    onClick={() =>
                                                        handleSort(
                                                            "DocumentType"
                                                        )
                                                    }
                                                >
                                                    <span className="report-sort-header">
                                                        Type

                                                        {renderSortIcon(
                                                            "DocumentType"
                                                        )}
                                                    </span>
                                                </th>

                                                <th className="report-number">
                                                    Debit
                                                </th>

                                                <th className="report-number">
                                                    Credit
                                                </th>

                                                <th
                                                    className="sortable report-number"
                                                    onClick={() =>
                                                        handleSort(
                                                            "Balance"
                                                        )
                                                    }
                                                >
                                                    <span className="report-sort-header">
                                                        Balance

                                                        {renderSortIcon(
                                                            "Balance"
                                                        )}
                                                    </span>
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {report.items.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (
                                                    <tr
                                                        key={`${entry.documentId}-${entry.documentType}-${index}`}
                                                    >

                                                        <td>
                                                            {formatDate(
                                                                entry.date
                                                            )}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {
                                                                    entry.documentNumber
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`aging-badge ${String(
                                                                    entry.documentType ||
                                                                    ""
                                                                ).toLowerCase() ===
                                                                        "payment"
                                                                        ? "aging-current"
                                                                        : "aging-info"
                                                                    }`}
                                                            >
                                                                {
                                                                    entry.documentType
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="report-number">
                                                            {Number(
                                                                entry.debit
                                                            ) >
                                                                0
                                                                ? formatCurrency(
                                                                    entry.debit,
                                                                    entry.currency
                                                                )
                                                                : "-"}
                                                        </td>

                                                        <td className="report-number">
                                                            {Number(
                                                                entry.credit
                                                            ) >
                                                                0
                                                                ? formatCurrency(
                                                                    entry.credit,
                                                                    entry.currency
                                                                )
                                                                : "-"}
                                                        </td>

                                                        <td className="report-number">
                                                            <span className="report-amount">
                                                                {formatCurrency(
                                                                    entry.balance,
                                                                    entry.currency
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`aging-badge ${getStatusClass(
                                                                    entry.status
                                                                )}`}
                                                            >
                                                                {
                                                                    entry.status
                                                                }
                                                            </span>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                <ReportPagination
                                    page={
                                        report.page
                                    }
                                    pageSize={
                                        report.pageSize
                                    }
                                    totalCount={
                                        report.totalCount
                                    }
                                    totalPages={
                                        report.totalPages
                                    }
                                    onPageChange={
                                        setPage
                                    }
                                    onPageSizeChange={
                                        setPageSize
                                    }
                                />
                            </>
                        )}
                </>
            )}
        </div>
    );
}

function getStatusClass(status) {
    switch (
    String(status || "")
        .toLowerCase()
    ) {
        case "paid":
            return "aging-current";

        case "partiallypaid":
        case "partially paid":
            return "aging-warning";

        case "overdue":
            return "aging-danger";

        case "issued":
        case "sent":
            return "aging-info";

        case "approved":
            return "aging-current";

        case "pendingapproval":
        case "pending approval":
            return "aging-warning";

        case "cancelled":
        case "void":
        case "rejected":
            return "aging-danger";

        default:
            return "aging-neutral";
    }
}