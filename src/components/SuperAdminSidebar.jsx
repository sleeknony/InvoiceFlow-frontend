
import { NavLink, useLocation } from "react-router-dom";
import {
    FiGrid,
    FiChevronRight,
    FiFileText,
    FiActivity,
    FiMail,
    FiMessageSquare,
    FiUsers
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import "./Sidebar.css";

export default function SuperAdminSidebar() {
    const location = useLocation();
    const auth = useAuth();

    const roles = Array.isArray(auth?.user?.roles)
        ? auth.user.roles
        : [];

    const hasRole = (expectedRole) =>
        roles.some(
            role =>
                String(role).toLowerCase() ===
                expectedRole.toLowerCase()
        );

    const isSuperAdmin = hasRole("SuperAdmin");
    const isSupportAgent = hasRole("SupportAgent");

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

    const supportTicketsActive =
        location.pathname === "/superadmin/support" ||
        location.pathname.startsWith("/superadmin/support/tickets");

    const supportAgentsActive =
        location.pathname.startsWith("/superadmin/support-agents");

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
                        {isSupportAgent && !isSuperAdmin
                            ? "Support Workspace"
                            : "SuperAdmin"}
                    </span>
                </div>
            </div>

            <div className="sidebar-navigation">
                <div className="sidebar-section">
                    <div className="sidebar-section-label">
                        {isSupportAgent && !isSuperAdmin
                            ? "Customer Support"
                            : "Platform"}
                    </div>

                    {isSuperAdmin && (
                        <>
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
                        </>
                    )}

                    {(isSuperAdmin || isSupportAgent) && (
                        <NavLink
                            className={`sidebar-nav-link${supportTicketsActive ? " active" : ""}`}
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
                    )}

                    {isSuperAdmin && (
                        <NavLink
                            className={`sidebar-nav-link${supportAgentsActive ? " active" : ""}`}
                            to="/superadmin/support-agents"
                        >
                            <span className="sidebar-link-icon">
                                <FiUsers />
                            </span>

                            <span className="sidebar-link-label">
                                Support Agents
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}
                </div>
            </div>
        </aside>
    );
}
