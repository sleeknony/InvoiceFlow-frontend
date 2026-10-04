import { NavLink, useLocation } from "react-router-dom";

import {
    FiGrid,
    FiChevronRight,
    FiFileText,
    FiActivity
} from "react-icons/fi";

import "./Sidebar.css";


export default function SuperAdminSidebar() {

    const location = useLocation();


    /*
     * ============================================================
     * COMPANIES
     *
     * Active for:
     *
     * /superadmin/companies
     * /superadmin/companies/123
     * /superadmin/companies/123/subscriptions
     *
     * But NOT:
     *
     * /superadmin/companies/123/users
     * ============================================================
     */

    const companiesActive =
        location.pathname === "/superadmin/companies" ||
        (
            location.pathname.startsWith(
                "/superadmin/companies/"
            ) &&
            !location.pathname.includes("/users")
        );


    /*
     * ============================================================
     * ACTIVITY REPORTS
     * ============================================================
     */

    const activityActive =
        location.pathname.startsWith(
            "/superadmin/activity"
        );


    return (

        <aside className="app-sidebar">

            {/* ==================================================
                BRAND
            ================================================== */}

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


            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <div className="sidebar-navigation">


                {/* ==================================================
                    PLATFORM
                ================================================== */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        Platform
                    </div>


                    <NavLink
                        className={`sidebar-nav-link${companiesActive
                                ? " active"
                                : ""
                            }`}
                        to="/superadmin/companies"
                    >

                        <span className="sidebar-link-icon">
                            <FiGrid />
                        </span>

                        <span className="sidebar-link-label">
                            Companies
                        </span>

                        <FiChevronRight
                            className="sidebar-link-arrow"
                        />

                    </NavLink>


                    <NavLink
                        className={`sidebar-nav-link${activityActive
                                ? " active"
                                : ""
                            }`}
                        to="/superadmin/activity"
                    >

                        <span className="sidebar-link-icon">
                            <FiActivity />
                        </span>

                        <span className="sidebar-link-label">
                            Activity Reports
                        </span>

                        <FiChevronRight
                            className="sidebar-link-arrow"
                        />

                    </NavLink>

                </div>


            </div>

        </aside>

    );

}