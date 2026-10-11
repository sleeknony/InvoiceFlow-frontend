import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { getAgingReport } from "../../../services/reportsService";

export default function AgingReport() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport() {
        try {
            setLoading(true);

            const data = await getAgingReport();

            setReport(data);
        }
        catch (error) {
            console.error(error);

            toast.error(
                "Failed to load aging report."
            );
        }
        finally {
            setLoading(false);
        }
    }

    function formatCurrency(value, currency = "NGN") {
        const amount = Number(value || 0);

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            }
        ).format(amount);
    }

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        return new Date(value).toLocaleDateString(
            "en-NG"
        );
    }

    if (loading) {
        return (
            <div className="report-loading">
                Loading aging report...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="report-empty">
                No aging report data available.
            </div>
        );
    }

    return (
        <div className="aging-report">

            <div className="report-content-header">

                <div>
                    <h2>Aging Report</h2>

                    <p>
                        Outstanding receivables grouped by age.
                    </p>
                </div>

                <button
                    type="button"
                    className="report-refresh-btn"
                    onClick={loadReport}
                >
                    <FiRefreshCw />
                    Refresh
                </button>

            </div>

            {/* SUMMARY */}
            <div className="aging-summary-grid">

                <div className="aging-summary-card">
                    <span>Total Receivables</span>

                    <strong>
                        {formatCurrency(
                            report.totalReceivables
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>Current</span>

                    <strong>
                        {formatCurrency(
                            report.current
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>1–30 Days</span>

                    <strong>
                        {formatCurrency(
                            report.days1To30
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>31–60 Days</span>

                    <strong>
                        {formatCurrency(
                            report.days31To60
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>61–90 Days</span>

                    <strong>
                        {formatCurrency(
                            report.days61To90
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>91–120 Days</span>

                    <strong>
                        {formatCurrency(
                            report.days91To120
                        )}
                    </strong>
                </div>

                <div className="aging-summary-card">
                    <span>120+ Days</span>

                    <strong>
                        {formatCurrency(
                            report.days120Plus
                        )}
                    </strong>
                </div>

            </div>

            {/* TABLE */}
            <div className="aging-table-wrapper">

                <table className="aging-table">

                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Customer</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Aging</th>
                        </tr>
                    </thead>

                    <tbody>

                        {report.items?.length > 0 ? (
                            report.items.map((item) => (
                                <tr key={item.documentId}>

                                    <td>
                                        <strong>
                                            {item.documentNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.customerName}
                                    </td>

                                    <td>
                                        {formatDate(
                                            item.issueDate
                                        )}
                                    </td>

                                    <td>
                                        {formatDate(
                                            item.dueDate
                                        )}
                                    </td>

                                    <td>
                                        {formatCurrency(
                                            item.total,
                                            item.currency
                                        )}
                                    </td>

                                    <td>
                                        {formatCurrency(
                                            item.amountPaid,
                                            item.currency
                                        )}
                                    </td>

                                    <td className="balance-cell">
                                        {formatCurrency(
                                            item.balanceDue,
                                            item.currency
                                        )}
                                    </td>

                                    <td>
                                        <span
                                            className={`aging-badge ${getAgingClass(
                                                item.agingBucket
                                            )}`}
                                        >
                                            {item.agingBucket}
                                        </span>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="aging-empty-cell"
                                >
                                    No outstanding receivables found.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

function getAgingClass(bucket) {
    switch (bucket) {
        case "Current":
            return "current";

        case "1-30":
            return "days-1-30";

        case "31-60":
            return "days-31-60";

        case "61-90":
            return "days-61-90";

        case "91-120":
            return "days-91-120";

        case "120+":
            return "days-120-plus";

        default:
            return "";
    }
}