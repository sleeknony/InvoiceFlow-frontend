import { useState } from "react";
import {
    FiBarChart2,
    FiDollarSign,
    FiFileText,
    FiActivity,
    FiCreditCard,
    FiUsers,
    FiClock,
} from "react-icons/fi";

import ReportsOverview from "./components/ReportsOverview";
import AgingReport from "./components/AgingReport";
import OutstandingInvoices from "./components/OutstandingInvoices";
import OverdueInvoices from "./components/OverdueInvoices";
import CustomerStatement from "./components/CustomerStatement";
import RevenueReport from "./components/RevenueReport";
import PaymentCollections from "./components/PaymentCollections";
import InvoiceRegister from "./components/InvoiceRegister";
import UserActivity from "./Activity/UserActivity";

import "./Reports.css";

const REPORT_SECTIONS = [
    {
        key: "overview",
        label: "Overview",
        icon: FiBarChart2,
    },
    {
        key: "sales",
        label: "Sales & Revenue",
        icon: FiDollarSign,
    },
    {
        key: "receivables",
        label: "Receivables",
        icon: FiClock,
        reports: [
            {
                key: "aging",
                label: "Aging Report",
            },
            {
                key: "outstanding",
                label: "Outstanding Invoices",
            },
            {
                key: "overdue",
                label: "Overdue Invoices",
            },
            {
                key: "customer-statement",
                label: "Customer Statement",
            },
        ],
    },
    {
        key: "payments",
        label: "Payments",
        icon: FiCreditCard,
    },
    {
        key: "documents",
        label: "Documents",
        icon: FiFileText,
    },
    {
        key: "activity",
        label: "Activity",
        icon: FiActivity,
    },
];

export default function ReportsPage() {
    const [activeSection, setActiveSection] = useState("overview");
    const [activeReport, setActiveReport] = useState("overview");

    function handleSectionClick(section) {
        setActiveSection(section.key);

        if (section.key === "overview") {
            setActiveReport("overview");
            return;
        }

        if (section.reports?.length) {
            setActiveReport(section.reports[0].key);
            return;
        }

        setActiveReport(section.key);
    }

    function handleReportClick(sectionKey, reportKey) {
        setActiveSection(sectionKey);
        setActiveReport(reportKey);
    }

    function renderReportContent() {
        switch (activeReport) {
            case "overview":
                return <ReportsOverview />;

            case "aging":
                return <AgingReport />;

            case "sales":
                return <RevenueReport />;

            case "payments":
                return <PaymentCollections />;

            case "documents":
                return <InvoiceRegister />;

            case "activity":
                return <UserActivity />;

            case "outstanding":
                return <OutstandingInvoices />;
                

            case "overdue":
                return <OverdueInvoices />;

            case "customer-statement":
                return <CustomerStatement />;

            default:
                return <ReportsOverview />;
        }
    }

    return (
        <div className="reports-page">

            {/* PAGE HEADER */}
            <div className="reports-header">
                <div>
                    <h1 className="reports-page-title">
                        Reports
                    </h1>

                    <p className="reports-page-subtitle">
                        View reports and insights about your business.
                    </p>
                </div>
            </div>

            {/* REPORTS LAYOUT */}
            <div className="reports-layout">

                {/* INTERNAL REPORT NAVIGATION */}
                <aside className="reports-sidebar">

                    <div className="reports-sidebar-header">
                        <FiBarChart2 />
                        <span>Reports</span>
                    </div>

                    <nav className="reports-nav">

                        {REPORT_SECTIONS.map((section) => {
                            const Icon = section.icon;

                            return (
                                <div
                                    key={section.key}
                                    className="reports-nav-group"
                                >

                                    <button
                                        type="button"
                                        className={`reports-nav-item ${activeSection === section.key
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handleSectionClick(section)
                                        }
                                    >
                                        <Icon />

                                        <span>
                                            {section.label}
                                        </span>
                                    </button>

                                    {section.reports &&
                                        activeSection === section.key && (
                                            <div className="reports-subnav">

                                                {section.reports.map(
                                                    (report) => (
                                                        <button
                                                            key={report.key}
                                                            type="button"
                                                            className={`reports-subnav-item ${activeReport ===
                                                                    report.key
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                            onClick={() =>
                                                                handleReportClick(
                                                                    section.key,
                                                                    report.key
                                                                )
                                                            }
                                                        >
                                                            {report.label}
                                                        </button>
                                                    )
                                                )}

                                            </div>
                                        )}

                                </div>
                            );
                        })}

                    </nav>
                </aside>

                {/* REPORT CONTENT */}
                <section className="reports-content">
                    <div className="reports-panel">
                        {renderReportContent()}
                    </div>
                </section>

            </div>
        </div>
    );
}


function ReportPlaceholder({ title, description }) {
    return (
        <div className="report-placeholder">

            <div className="report-placeholder-icon">
                <FiBarChart2 />
            </div>

            <h2>{title}</h2>

            <p>
                {description}
            </p>

        </div>
    );
}