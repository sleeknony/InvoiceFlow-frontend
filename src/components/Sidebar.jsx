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
    FiUserCheck
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

    const canViewSettings =
        permissions.includes(
            "ViewCompanySettings"
        ) ||
        permissions.includes(
            "ManageCompanySettings"
        );

    const canManageUsers =
        permissions.includes(
            "ViewCompanySettings"
        ) ||
        permissions.includes(
            "ManageCompanySettings"
        );

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
                        to="/dashboard"
                    >
                        <span className="sidebar-link-icon">
                            <FiGrid />
                        </span>

                        <span className="sidebar-link-label">
                            Dashboard
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>


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

                </div>


                {/* DOCUMENTS */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        Documents
                    </div>


                    <NavLink
                        className={getNavClass}
                        to="/documents"
                        end
                    >
                        <span className="sidebar-link-icon">
                            <FiFileText />
                        </span>

                        <span className="sidebar-link-label">
                            All Documents
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>


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

                </div>


                {/* ACCOUNT */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        Account
                    </div>


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
                    {canManageUsers && (
                    <NavLink
                        className={getNavClass}
                        to="/team" >
                        <span className="sidebar-link-icon">
                            <FiUserCheck />
                        </span>
                        
                        <span className="sidebar-link-label">
                            Team Management
                        </span>

                        <FiChevronRight className="sidebar-link-arrow" />
                    </NavLink>
                     )}

                    {canViewSettings && (
                    <NavLink
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


            {/* ==========================================
                SUBSCRIPTION CARD
            ========================================== */}

            <div className="sidebar-footer">

                <div className="sidebar-plan-card">

                    <div className="sidebar-plan-header">

                        <div className="sidebar-plan-icon">
                            <FiZap />
                        </div>

                        <div>
                            <span className="sidebar-plan-label">
                                Current plan
                            </span>

                            <strong className="sidebar-plan-name">
                                {displayPlanName}
                            </strong>
                        </div>

                    </div>


                    {!subscriptionLoading && (

                        <button
                            type="button"
                            className="sidebar-plan-button"
                            onClick={() =>
                                navigate("/pricing")
                            }
                        >
                            {isEnterprise
                                ? "Manage Plan"
                                : isFree
                                    ? "Upgrade Plan"
                                    : "Change Plan"}

                            <FiChevronRight />
                        </button>

                    )}

                </div>

            </div>

        </aside>
    );
}