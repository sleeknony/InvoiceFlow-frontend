import { NavLink, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiFileText,
    FiPlus,
    FiCreditCard,
    FiSettings,
    FiChevronRight,
    FiZap,
    FiUserCheck,
    FiShield
} from "react-icons/fi";

import { useSubscription } from "../context/useSubscription";
import "./Sidebar.css";

export default function Sidebar() {
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
        }
        catch {
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

    const canViewUsers =
        hasPermission("ViewUsers");

    const canManageRoles =
        hasPermission("ManageUsers");

    const canManageSubscription =
        hasPermission("ManageCompanySubscriptions");
    
    return (
        <aside className="app-sidebar">

            {/* ==========================================
                BRAND
            ========================================== */}

            <div className="sidebar-brand">

                <div className="sidebar-brand-icon">
                    <FiFileText />
                </div>

                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">
                        InvoiceFlow
                    </span>

                    <span className="sidebar-brand-caption">
                        Documents made simple
                    </span>
                </div>

            </div>

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
                        to="/dashboard" >

                        <span className="sidebar-link-icon">
                            <FiGrid />
                        </span>

                        <span className="sidebar-link-label">
                            Dashboard
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>

                    {canViewCustomers &&(
                    <NavLink
                        className={getNavClass}
                        to="/customers"
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
                            to="/documents">

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


                    {/* SETTINGS */}

                    {canViewSettings && (

                        <NavLink
                        end
                            className={getNavClass}
                            to="/settings"
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