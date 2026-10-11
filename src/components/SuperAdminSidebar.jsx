
import { NavLink, useLocation } from "react-router-dom";

import {
    FiGrid,
    FiChevronRight,
    FiFileText,
    FiActivity,
    FiMail,
    FiMessageSquare
} from "react-icons/fi";

import "./Sidebar.css";

export default function SuperAdminSidebar() {
    const location = useLocation();

    /*
     * Companies:
     * /superadmin/companies
     * /superadmin/companies/:companyId
     * /superadmin/companies/:companyId/subscriptions
     *
     * Excludes:
     * /superadmin/companies/:companyId/users
     */
    const companiesActive =
        location.pathname === "/superadmin/companies" ||
        (
            location.pathname.startsWith("/superadmin/companies/") &&
            !location.pathname.includes("/users")
        );

    const activityActive =
        location.pathname.startsWith("/superadmin/activity");

    const commActive =
        location.pathname.startsWith("/superadmin/communications");

    const supportActive =
        location.pathname.startsWith("/superadmin/support");

    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <FiFileText />
                </div>

                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">
                        invoiceNgine
                    </span>

                    <span className="sidebar-brand-caption">
                        SuperAdmin
                    </span>
                </div>
            </div>

            <div className="sidebar-navigation">
                <div className="sidebar-section">
                    <div className="sidebar-section-label">
                        Platform
                    </div>

                    <NavLink
                        className={`sidebar-nav-link${companiesActive ? " active" : ""}`}
                        to="/superadmin/companies"
                    >
                        <span className="sidebar-link-icon">
                            <FiGrid />
                        </span>

                        <span className="sidebar-link-label">
                            Companies
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>

                    <NavLink
                        className={`sidebar-nav-link${activityActive ? " active" : ""}`}
                        to="/superadmin/activity"
                    >
                        <span className="sidebar-link-icon">
                            <FiActivity />
                        </span>

                        <span className="sidebar-link-label">
                            Activity Reports
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>

                    <NavLink
                        className={`sidebar-nav-link${commActive ? " active" : ""}`}
                        to="/superadmin/communications"
                    >
                        <span className="sidebar-link-icon">
                            <FiMail />
                        </span>

                        <span className="sidebar-link-label">
                            Communications
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>

                    <NavLink
                        className={`sidebar-nav-link${supportActive ? " active" : ""}`}
                        to="/superadmin/support"
                    >
                        <span className="sidebar-link-icon">
                            <FiMessageSquare />
                        </span>

                        <span className="sidebar-link-label">
                            Support Tickets
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>
                </div>
            </div>
        </aside>
    );
}
