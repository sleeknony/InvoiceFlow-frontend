import { useCallback, useEffect, useState } from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiMinus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import {
    exportOverdueInvoices,
    getOverdueInvoices,
} from "../../../services/reportsService";

import useReportQuery from "../hooks/useReportQuery";
import ReportToolbar from "./ReportToolbar";
import ReportPagination from "./ReportPagination";

const INITIAL_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "DueDate",
    sortDirection: "desc",
    fromDate: "",
    toDate: "",
};

export default function OverdueInvoices() {
    const [report, setReport] = useState({
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 25,
        totalPages: 0,
        summary: {
            totalOverdue: 0,
            overdueInvoiceCount: 0,
            averageDaysOverdue: 0,
            customersWithOverdueInvoices: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const {
        query,
        updateQuery,
        setPage,
        setPageSize,
        setSorting,
        reset,
    } = useReportQuery(INITIAL_QUERY);

    const loadReport = useCallback(async () => {
        try {
            setLoading(true);

            const result =
                await getOverdueInvoices(query);

            setReport({
                items: Array.isArray(result?.items)
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
                        totalOverdue: 0,
                        overdueInvoiceCount:
                            Number(
                                result?.totalCount
                            ) || 0,
                        averageDaysOverdue: 0,
                        customersWithOverdueInvoices: 0,
                    },
            });
        }
        catch (error) {
            console.error(
                "Failed to load overdue invoices:",
                error
            );

            setReport({
                items: [],
                totalCount: 0,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: 0,
                summary: {
                    totalOverdue: 0,
                    overdueInvoiceCount: 0,
                    averageDaysOverdue: 0,
                    customersWithOverdueInvoices: 0,
                },
            });

            toast.error(
                "Failed to load overdue invoices."
            );
        }
        finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    function formatCurrency(
        value,
        currency = "NGN"
    ) {
        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: currency || "NGN",
                minimumFractionDigits: 2,
            }
        ).format(Number(value || 0));
    }

    function formatDate(value) {
        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
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
        if (query.sortBy !== column) {
            return (
                <FiMinus className="report-sort-icon" />
            );
        }

        if (query.sortDirection === "asc") {
            return (
                <FiArrowUp className="report-sort-icon active" />
            );
        }

        return (
            <FiArrowDown className="report-sort-icon active" />
        );
    }

    async function downloadExcel() {
        try {
            setExporting(true);

            const exportQuery = {
                search:
                    query.search || undefined,

                sortBy:
                    query.sortBy || undefined,

                sortDirection:
                    query.sortDirection || undefined,

                fromDate:
                    query.fromDate || undefined,

                toDate:
                    query.toDate || undefined,
            };

            const response =
                await exportOverdueInvoices(
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
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `Overdue-Invoices-${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                "Overdue invoices exported successfully."
            );
        }
        catch (error) {
            console.error(
                "Failed to export overdue invoices:",
                error
            );

            toast.error(
                "Failed to export overdue invoices."
            );
        }
        finally {
            setExporting(false);
        }
    }

    const summary =
        report.summary || {
            totalOverdue: 0,
            overdueInvoiceCount:
                report.totalCount || 0,
            averageDaysOverdue: 0,
            customersWithOverdueInvoices: 0,
        };

    return (
        <div>
            <div className="report-content-header">
                <div>
                    <h2>
                        Overdue Invoices
                    </h2>

                    <p>
                        View invoices that have passed
                        their due date and still have
                        an outstanding balance.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Total Overdue
                    </div>

                    <div className="report-summary-value">
                        {formatCurrency(
                            summary.totalOverdue
                        )}
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Overdue Invoices
                    </div>

                    <div className="report-summary-value">
                        {
                            summary.overdueInvoiceCount
                        }
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Average Days Overdue
                    </div>

                    <div className="report-summary-value">
                        {Number(
                            summary.averageDaysOverdue || 0
                        ).toFixed(1)}
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Customers Affected
                    </div>

                    <div className="report-summary-value">
                        {
                            summary.customersWithOverdueInvoices
                        }
                    </div>
                </div>

            </div>

            <ReportToolbar
                search={query.search}
                onSearchChange={(value) =>
                    updateQuery(
                        "search",
                        value
                    )
                }
                fromDate={query.fromDate}
                toDate={query.toDate}
                onFromDateChange={(value) =>
                    updateQuery(
                        "fromDate",
                        value
                    )
                }
                onToDateChange={(value) =>
                    updateQuery(
                        "toDate",
                        value
                    )
                }
                onRefresh={loadReport}
                onReset={reset}
                onExport={downloadExcel}
                exporting={exporting}
            />

            {loading && (
                <div className="report-loading">
                    <div className="report-loading-spinner" />
                    Loading overdue invoices...
                </div>
            )}

            {!loading &&
                report.items.length === 0 && (
                    <div className="report-empty">

                        <h3 className="report-empty-title">
                            No overdue invoices
                        </h3>

                        <p className="report-empty-text">
                            No overdue invoices match the
                            current filters.
                        </p>

                    </div>
                )}

            {!loading &&
                report.items.length > 0 && (
                    <>
                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th
                                            className="sortable"
                                            onClick={() =>
                                                handleSort(
                                                    "DocumentNumber"
                                                )
                                            }
                                        >
                                            <span className="report-sort-header">
                                                Invoice

                                                {renderSortIcon(
                                                    "DocumentNumber"
                                                )}
                                            </span>
                                        </th>

                                        <th
                                            className="sortable"
                                            onClick={() =>
                                                handleSort(
                                                    "Customer"
                                                )
                                            }
                                        >
                                            <span className="report-sort-header">
                                                Customer

                                                {renderSortIcon(
                                                    "Customer"
                                                )}
                                            </span>
                                        </th>

                                        <th
                                            className="sortable"
                                            onClick={() =>
                                                handleSort(
                                                    "IssueDate"
                                                )
                                            }
                                        >
                                            <span className="report-sort-header">
                                                Issue Date

                                                {renderSortIcon(
                                                    "IssueDate"
                                                )}
                                            </span>
                                        </th>

                                        <th
                                            className="sortable"
                                            onClick={() =>
                                                handleSort(
                                                    "DueDate"
                                                )
                                            }
                                        >
                                            <span className="report-sort-header">
                                                Due Date

                                                {renderSortIcon(
                                                    "DueDate"
                                                )}
                                            </span>
                                        </th>

                                        <th className="report-number">
                                            Total
                                        </th>

                                        <th className="report-number">
                                            Paid
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

                                        <th
                                            className="sortable report-number"
                                            onClick={() =>
                                                handleSort(
                                                    "DaysOverdue"
                                                )
                                            }
                                        >
                                            <span className="report-sort-header">
                                                Days Overdue

                                                {renderSortIcon(
                                                    "DaysOverdue"
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
                                        (invoice) => (
                                            <tr
                                                key={
                                                    invoice.documentId
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            invoice.documentNumber
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        invoice.customerName
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        invoice.issueDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        invoice.dueDate
                                                    )}
                                                </td>

                                                <td className="report-number">
                                                    <span className="report-amount">
                                                        {formatCurrency(
                                                            invoice.total,
                                                            invoice.currency
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="report-number">
                                                    {formatCurrency(
                                                        invoice.amountPaid,
                                                        invoice.currency
                                                    )}
                                                </td>

                                                <td className="report-number">
                                                    <span className="report-amount">
                                                        {formatCurrency(
                                                            invoice.balanceDue,
                                                            invoice.currency
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="report-number">
                                                    <span className="aging-badge aging-danger">
                                                        {
                                                            invoice.daysOverdue
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`aging-badge ${getStatusClass(
                                                            invoice.status
                                                        )}`}
                                                    >
                                                        {
                                                            invoice.status
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
                            page={report.page}
                            pageSize={report.pageSize}
                            totalCount={
                                report.totalCount
                            }
                            totalPages={
                                report.totalPages
                            }
                            onPageChange={setPage}
                            onPageSizeChange={
                                setPageSize
                            }
                        />
                    </>
                )}
        </div>
    );
}

function getStatusClass(status) {
    switch (
    String(status || "").toLowerCase()
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

        default:
            return "aging-neutral";
    }
}