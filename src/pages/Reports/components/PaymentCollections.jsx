import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiDollarSign,
    FiUsers,
    FiCreditCard,
    FiHash,
} from "react-icons/fi";

import {
    getPaymentCollections,
    exportPaymentCollections,
} from "../../../services/reportsService";

import useReportQuery from "../hooks/useReportQuery";
import ReportToolbar from "./ReportToolbar";
import ReportPagination from "./ReportPagination";

const INITIAL_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "PaymentDate",
    sortDirection: "desc",
    fromDate: "",
    toDate: "",
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

const getPaymentMethodLabel = (value) => {
    if (!value) return "-";

    const text = String(value);

    return text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
};

export default function PaymentCollections() {
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
            const data = await getPaymentCollections(query);
            setReport(data);
        } catch (err) {
            console.error("Failed to load payment collections:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to load payment collections."
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
            const response = await exportPaymentCollections(query);

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
            link.download = `payment-collections-${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export payment collections:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to export payment collections."
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

    const totalCollected = Number(
        summary.totalCollected ?? 0
    );

    const paymentCount = Number(
        summary.paymentCount ?? report?.totalCount ?? 0
    );

    const averagePayment = Number(
        summary.averagePayment ?? 0
    );

    const customersPaid = Number(
        summary.customersPaid ?? 0
    );

    const totalPages = Number(
        report?.totalPages ?? 0
    );

    const renderSortIcon = (column) => {
        if (query.sortBy?.toLowerCase() !== column.toLowerCase()) {
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
                        Payment Collections
                    </h2>

                    <p className="report-section-subtitle">
                        View and analyse payments collected against invoices.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">
                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiDollarSign />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Total Collected
                        </div>

                        <div className="report-summary-value">
                            {formatCurrency(totalCollected)}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiHash />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Payment Count
                        </div>

                        <div className="report-summary-value">
                            {paymentCount.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiCreditCard />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Average Payment
                        </div>

                        <div className="report-summary-value">
                            {formatCurrency(averagePayment)}
                        </div>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiUsers />
                    </div>

                    <div>
                        <div className="report-summary-label">
                            Customers Paid
                        </div>

                        <div className="report-summary-value">
                            {customersPaid.toLocaleString()}
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
                                    handleSort("PaymentDate")
                                }
                            >
                                <span>
                                    Payment Date
                                    {renderSortIcon("PaymentDate")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("PaymentReference")
                                }
                            >
                                <span>
                                    Reference
                                    {renderSortIcon("PaymentReference")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("DocumentNumber")
                                }
                            >
                                <span>
                                    Invoice
                                    {renderSortIcon("DocumentNumber")}
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
                                    {renderSortIcon("CustomerName")}
                                </span>
                            </th>

                            <th
                                className="sortable text-end"
                                onClick={() =>
                                    handleSort("Amount")
                                }
                            >
                                <span>
                                    Amount
                                    {renderSortIcon("Amount")}
                                </span>
                            </th>

                            <th
                                className="sortable"
                                onClick={() =>
                                    handleSort("PaymentMethod")
                                }
                            >
                                <span>
                                    Payment Method
                                    {renderSortIcon("PaymentMethod")}
                                </span>
                            </th>

                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="report-table-loading"
                                >
                                    Loading payment collections...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="report-table-empty"
                                >
                                    No payment collections found.
                                </td>
                            </tr>
                        ) : (
                            rows.map(payment => (
                                <tr
                                    key={
                                        payment.paymentId ??
                                        `${payment.documentId}-${payment.paymentDate}-${payment.paymentReference}`
                                    }
                                >
                                    <td>
                                        {formatDate(
                                            payment.paymentDate
                                        )}
                                    </td>

                                    <td>
                                        <span className="report-reference">
                                            {payment.paymentReference ||
                                                "-"}
                                        </span>
                                    </td>

                                    <td>
                                        {payment.documentNumber || "-"}
                                    </td>

                                    <td>
                                        {payment.customerName || "-"}
                                    </td>

                                    <td className="text-end report-amount">
                                        {formatCurrency(
                                            payment.amount,
                                            payment.currency
                                        )}
                                    </td>

                                    <td>
                                        {getPaymentMethodLabel(
                                            payment.paymentMethod
                                        )}
                                    </td>

                                    <td>
                                        <span className="report-status-badge">
                                            {payment.status || "-"}
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
                    page={report.page ?? query.page}
                    pageSize={
                        report.pageSize ??
                        query.pageSize
                    }
                    totalCount={
                        report.totalCount ?? 0
                    }
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    );
}