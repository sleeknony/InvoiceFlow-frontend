import { useCallback, useEffect, useState } from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiMinus,
} from "react-icons/fi";

import {
    getRevenueReport,
    exportRevenueReport,
} from "../../../services/reportsService";

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

function formatCurrency(value, currency = "NGN") {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency || "NGN",
        minimumFractionDigits: 2,
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getSummary(report) {
    return report?.summary || {};
}

export default function RevenueReport() {
    const {
        query,
        updateQuery,
        setPage,
        setPageSize,
        setSorting,
        reset,
    } = useReportQuery(INITIAL_QUERY);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const loadReport = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getRevenueReport(query);
            setReport(data);
        } catch (error) {
            console.error(
                "Failed to load revenue report:",
                error
            );
            setReport(null);
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
            const response =
                await exportRevenueReport(query);

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
                "Revenue-Report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Failed to export revenue report:",
                error
            );
        } finally {
            setExporting(false);
        }
    };

    const handleReset = () => {
        reset();
    };

    const handleSort = (field) => {
        setSorting(field);
    };

    const summary = getSummary(report);

    const items = report?.items || [];

    const totalCount =
        report?.totalCount || 0;

    const totalPages =
        report?.totalPages || 0;

    const renderSortIcon = (field) => {
        if (query.sortBy !== field) {
            return (
                <FiMinus
                    className="report-sort-icon"
                />
            );
        }

        return query.sortDirection === "asc" ? (
            <FiArrowUp
                className="report-sort-icon active"
            />
        ) : (
            <FiArrowDown
                className="report-sort-icon active"
            />
        );
    };

    return (
        <div className="report-panel">
            <div className="report-panel-header">
                <div>
                    <h2 className="report-panel-title">
                        Revenue Report
                    </h2>

                    <p className="report-panel-description">
                        View invoice revenue, payments
                        collected and outstanding
                        balances.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">
                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Total Revenue
                    </div>

                    <div className="report-summary-value">
                        {formatCurrency(
                            summary.totalRevenue
                        )}
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Total Collected
                    </div>

                    <div className="report-summary-value">
                        {formatCurrency(
                            summary.totalCollected
                        )}
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Outstanding
                    </div>

                    <div className="report-summary-value">
                        {formatCurrency(
                            summary.totalOutstanding
                        )}
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-label">
                        Invoice Count
                    </div>

                    <div className="report-summary-value">
                        {summary.invoiceCount || 0}
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
            />

            {loading ? (
                <div className="report-loading">
                    <div className="report-loading-spinner" />
                    <span>
                        Loading revenue report...
                    </span>
                </div>
            ) : items.length === 0 ? (
                <div className="report-empty">
                    <div className="report-empty-title">
                        No revenue records found
                    </div>

                    <div className="report-empty-text">
                        There are no invoices matching
                        the selected filters.
                    </div>
                </div>
            ) : (
                <>
                    <div className="report-table-wrapper">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th
                                        className="sortable"
                                        onClick={() =>
                                            handleSort(
                                                "IssueDate"
                                            )
                                        }
                                    >
                                        <span className="report-sort-header">
                                            Date
                                            {renderSortIcon(
                                                "IssueDate"
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
                                        className="sortable text-end"
                                        onClick={() =>
                                            handleSort(
                                                "Total"
                                            )
                                        }
                                    >
                                        <span className="report-sort-header justify-content-end">
                                            Invoice Total
                                            {renderSortIcon(
                                                "Total"
                                            )}
                                        </span>
                                    </th>

                                    <th
                                        className="sortable text-end"
                                        onClick={() =>
                                            handleSort(
                                                "AmountPaid"
                                            )
                                        }
                                    >
                                        <span className="report-sort-header justify-content-end">
                                            Amount Paid
                                            {renderSortIcon(
                                                "AmountPaid"
                                            )}
                                        </span>
                                    </th>

                                    <th
                                        className="sortable text-end"
                                        onClick={() =>
                                            handleSort(
                                                "Balance"
                                            )
                                        }
                                    >
                                        <span className="report-sort-header justify-content-end">
                                            Outstanding
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
                                {items.map((item) => (
                                    <tr
                                        key={
                                            item.documentId
                                        }
                                    >
                                        <td>
                                            {formatDate(
                                                item.issueDate
                                            )}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    item.documentNumber
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                item.customerName
                                            }
                                        </td>

                                        <td className="text-end report-amount">
                                            {formatCurrency(
                                                item.total,
                                                item.currency
                                            )}
                                        </td>

                                        <td className="text-end report-amount">
                                            {formatCurrency(
                                                item.amountPaid,
                                                item.currency
                                            )}
                                        </td>

                                        <td className="text-end report-amount">
                                            {formatCurrency(
                                                item.balanceDue,
                                                item.currency
                                            )}
                                        </td>

                                        <td>
                                            <span className="report-status">
                                                {
                                                    item.status
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <ReportPagination
                        page={
                            report?.page || query.page
                        }
                        pageSize={
                            report?.pageSize ||
                            query.pageSize
                        }
                        totalCount={totalCount}
                        totalPages={totalPages}
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