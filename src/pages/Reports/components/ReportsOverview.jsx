import {
    FiBarChart2,
    FiDollarSign,
    FiCreditCard,
    FiUsers,
} from "react-icons/fi";

export default function ReportsOverview() {
    return (
        <div className="reports-overview">

            <div className="report-content-header">
                <div>
                    <h2>Reports Overview</h2>

                    <p>
                        Get a quick overview of your business reporting
                        activities.
                    </p>
                </div>
            </div>

            <div className="reports-summary-grid">

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiDollarSign />
                    </div>

                    <div>
                        <span>Sales & Revenue</span>
                        <strong>View Reports</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiBarChart2 />
                    </div>

                    <div>
                        <span>Receivables</span>
                        <strong>View Reports</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiCreditCard />
                    </div>

                    <div>
                        <span>Payments</span>
                        <strong>View Reports</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon">
                        <FiUsers />
                    </div>

                    <div>
                        <span>Customer Reports</span>
                        <strong>View Reports</strong>
                    </div>
                </div>

            </div>

            <div className="reports-info-box">
                <h3>Business Reporting</h3>

                <p>
                    Use the report sections on the left to view sales,
                    receivables, payment, document, and activity reports.
                </p>
            </div>

        </div>
    );
}