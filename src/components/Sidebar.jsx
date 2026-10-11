import { NavLink, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiFileText,
    FiPlus,
    FiCreditCard,
    FiSettings,
    FiChevronRight,
    FiChevronLeft,
    FiZap,
    FiUserCheck,
    FiShield,
    FiBarChart2
} from "react-icons/fi";

import { useSubscription } from "../context/useSubscription";
import invoiceNgineLogo from "../assets/images/IN_logo.png";
import "./Sidebar.css";

export default function Sidebar({ collapsed = false, onToggle }) {
    const navigate = useNavigate();

    const {
        planName,
        isFree,
        isEnterprise,
        loading: subscriptionLoading
    } = useSubscription();

    const getNavClass = ({ isActive }) =>
        `sidebar-nav-link${isActive ? " active" : ""}`;

    const displayPlanName =
        subscriptionLoading
            ? "Loading..."
            : `${planName || "Free"} Plan`;

    const permissions = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("permissions") || "[]"
            );
        } catch {
            return [];
        }
    })();

    const hasPermission = (permissionName) =>
        permissions.some(
            p => p.name === permissionName
        );

    const canViewCustomers =
        hasPermission("ViewCustomers") ||
        hasPermission("CreateCustomers");

    const canCreateDocuments =
        hasPermission("CreateDocuments");

    const canViewDocuments =
        hasPermission("ViewDocuments");

    const canViewSettings =
        hasPermission("ViewCompanySettings");

    const canViewReports =
        hasPermission("ViewReports");

    const canViewUsers =
        hasPermission("ViewUsers");

    const canManageRoles =
        hasPermission("ManageUsers");

    const canManageSubscription =
        hasPermission("ManageCompanySubscriptions");

    return (
        <aside
            className={`app-sidebar ${collapsed ? "app-sidebar-collapsed" : ""
                }`}
        >

            {/* ==========================================
                BRAND
            ========================================== */}

            <div className="sidebar-brand">

                <img
                    src={invoiceNgineLogo}
                    alt="invoiceNgine"
                    className="sidebar-logo"
                />

                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">
                        invoiceNgine
                    </span>

                    <span className="sidebar-brand-caption">
                        Documents made simple
                    </span>
                </div>

            </div>

            {/* ==========================================
                COLLAPSE BUTTON
            ========================================== */}

            <button
                type="button"
                className="sidebar-collapse-button"
                onClick={onToggle}
                aria-label={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
                title={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
            >
                {collapsed ? (
                    <FiChevronRight />
                ) : (
                    <FiChevronLeft />
                )}
            </button>

            {/* ==========================================
                NAVIGATION
            ========================================== */}

            <div className="sidebar-navigation">

                {/* MAIN */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        Workspace
                    </div>

                    <NavLink
                        className={getNavClass}
                        to="/dashboard"
                        title={collapsed ? "Dashboard" : undefined}
                    >
                        <span className="sidebar-link-icon">
                            <FiGrid />
                        </span>

                        <span className="sidebar-link-label">
                            Dashboard
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>

                    {canViewCustomers && (
                        <NavLink
                            className={getNavClass}
                            to="/customers"
                            title={collapsed ? "Customers" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiUsers />
                            </span>

                            <span className="sidebar-link-label">
                                Customers
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}

                </div>


                {/* DOCUMENTS */}

                <div className="sidebar-section">

                    {(canViewDocuments ||
                        canCreateDocuments) && (
                            <div className="sidebar-section-label">
                                Documents
                            </div>
                        )}

                    {canViewDocuments && (
                        <NavLink
                            end
                            className={getNavClass}
                            to="/documents"
                            title={collapsed ? "All Documents" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiFileText />
                            </span>

                            <span className="sidebar-link-label">
                                All Documents
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}

                    {canCreateDocuments && (
                        <NavLink
                            className={getNavClass}
                            to="/documents/create"
                            title={collapsed ? "Create Document" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiPlus />
                            </span>

                            <span className="sidebar-link-label">
                                Create Document
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}

                </div>


                {/* ==========================================
                    ACCOUNT
                ========================================== */}

                <div className="sidebar-section">

                    {(canViewUsers ||
                        canManageRoles ||
                        canManageSubscription ||
                        canViewSettings) && (
                            <div className="sidebar-section-label">
                                Account
                            </div>
                        )}


                    {/* SUBSCRIPTION */}

                    {canManageSubscription && (
                        <NavLink
                            className={getNavClass}
                            to="/subscription/billing"
                            title={collapsed ? "Subscription" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiCreditCard />
                            </span>

                            <span className="sidebar-link-label">
                                Subscription
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}


                    {/* TEAM MANAGEMENT */}

                    {canViewUsers && (
                        <NavLink
                            end
                            className={getNavClass}
                            to="/team"
                            title={collapsed ? "Team Management" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiUserCheck />
                            </span>

                            <span className="sidebar-link-label">
                                Team Management
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}


                    {/* ROLE MANAGEMENT */}

                    {canManageRoles && (
                        <NavLink
                            className={getNavClass}
                            to="/settings/roles"
                            title={collapsed ? "Role Management" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiShield />
                            </span>

                            <span className="sidebar-link-label">
                                Role Management
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}


                    {/* REPORT */}

                    {canViewReports && (
                        <NavLink
                            className={getNavClass}
                            to="/reports"
                            title={collapsed ? "Reports" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiBarChart2 />
                            </span>

                            <span className="sidebar-link-label">
                                Reports
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}


                    {/* SETTINGS */}

                    {canViewSettings && (
                        <NavLink
                            end
                            className={getNavClass}
                            to="/settings"
                            title={collapsed ? "Settings" : undefined}
                        >
                            <span className="sidebar-link-icon">
                                <FiSettings />
                            </span>

                            <span className="sidebar-link-label">
                                Settings
                            </span>

                            <FiChevronRight className="sidebar-link-arrow" />
                        </NavLink>
                    )}

                </div>

            </div>

        </aside>
    );
}