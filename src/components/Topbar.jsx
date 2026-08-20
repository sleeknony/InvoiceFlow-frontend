import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiBell,
    FiChevronDown,
    FiChevronRight,
    FiCreditCard,
    FiFileText,
    FiGrid,
    FiLogOut,
    FiSettings,
    FiZap
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { useSubscription } from "../context/useSubscription";

import "./Topbar.css";

function getPageContext(pathname) {

    if (pathname === "/pricing")
        return { section: "Subscription", title: "Plans & Pricing" };

    if (pathname.startsWith("/subscription/billing"))
        return { section: "Subscription", title: "Billing" };

    if (pathname.startsWith("/customers"))
        return { section: "Workspace", title: "Customers" };

    if (pathname === "/documents/create")
        return { section: "Documents", title: "Create Document" };

    if (pathname.startsWith("/documents/") && pathname !== "/documents/create")
        return { section: "Documents", title: "Document Details" };

    if (pathname === "/documents")
        return { section: "Documents", title: "All Documents" };

    if (pathname.startsWith("/settings"))
        return { section: "Account", title: "Settings" };

    if (pathname === "/" || pathname.startsWith("/dashboard"))
        return { section: "Workspace", title: "Dashboard" };

    return { section: "Workspace", title: "InvoiceFlow" };
}

export default function Topbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const pageContext = getPageContext(location.pathname);

    const {
        planName,
        isFree,
        isEnterprise,
        loading: subscriptionLoading
    } = useSubscription();

    const handleLogout = () => { logout(); navigate("/login"); };

    const email = user?.email || "No email";
    const displayName = user?.name || user?.firstName || user?.email || "User";
    const initial = displayName?.charAt(0)?.toUpperCase() || "U";

    const planActionLabel = isEnterprise ? "Manage Plan"
        : isFree ? "Upgrade Plan"
            : "Change Plan";

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

    const canViewSettings =
        hasPermission("ViewCompanySettings") ||
        hasPermission("ManageCompanySettings");

    const canCreateDocuments =
        hasPermission("CreateDocuments");

    const canViewDocuments =
        hasPermission("ViewDocuments");

    const canManageUsers =
        hasPermission("ViewUsers") ||
        hasPermission("ManageUsers");

    const canManageSubscription =
        hasPermission("ManageCompanySubscriptions");

    return (
        <header className="app-topbar">

            {/* ── LEFT — breadcrumb ─────────────────── */}
            <div className="topbar-left">
                <div className="topbar-breadcrumb">
                    <span className="topbar-breadcrumb-section">
                        {pageContext.section}
                    </span>
                    <FiChevronRight className="topbar-breadcrumb-sep" />
                    <span className="topbar-breadcrumb-title">
                        {pageContext.title}
                    </span>
                </div>
            </div>

            {/* ── RIGHT ────────────────────────────── */}
            <div className="topbar-right">

                {!isAuthenticated ? (
                    <div className="topbar-auth-actions">
                        <Link to="/login" className="topbar-login-btn">Login</Link>
                        <Link to="/register" className="topbar-register-btn">Register</Link>
                    </div>
                ) : (
                    <>
                        {/* Plan pill */}
                        {!subscriptionLoading && (
                            <button
                                type="button"
                                className={`topbar-plan ${isFree ? "topbar-plan--free" : "topbar-plan--paid"}`}
                                onClick={() => navigate("/subscription/billing")}
                                title="Subscription & Billing"
                            >
                                <FiZap className="topbar-plan-icon" />
                                <span>{planName || "Free"} Plan</span>
                            </button>
                        )}

                        {/* Notifications */}
                        <div className="topbar-notif-wrap">
                            <button type="button" className="topbar-icon-btn" title="Notifications">
                                <FiBell />
                                <span className="topbar-notif-dot" />
                            </button>
                        </div>

                        <div className="topbar-divider" />

                        {/* User dropdown */}
                        <div className="dropdown">
                            <button
                                className="topbar-user-btn"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="topbar-avatar">
                                    {initial}
                                </div>
                                <div className="topbar-user-info">
                                    <span className="topbar-user-name">{displayName}</span>
                                    <span className="topbar-user-email">{email}</span>
                                </div>
                                <FiChevronDown className="topbar-chevron" />
                            </button>

                            {/* ── Dropdown ──────────────────── */}
                            <ul className="dropdown-menu dropdown-menu-end topbar-dropdown">

                                {/* Header */}
                                <li>
                                    <div className="topbar-dd-header">
                                        <div className="topbar-dd-avatar">{initial}</div>
                                        <div className="topbar-dd-user-info">
                                            <div className="topbar-dd-name">{displayName}</div>
                                            <div className="topbar-dd-email">{email}</div>
                                        </div>
                                    </div>
                                </li>

                                {/* Plan row */}
                                    {canManageSubscription && !subscriptionLoading && (
                                        <li>
                                            <div className="topbar-dd-plan">
                                                <div className="topbar-dd-plan-left">
                                                    <span className="topbar-dd-plan-label">
                                                        Current plan
                                                    </span>

                                                    <span className="topbar-dd-plan-name">
                                                        {planName || "Free"}
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="topbar-dd-plan-btn"
                                                    onClick={() => navigate("/pricing")}
                                                >
                                                    {planActionLabel}
                                                </button>
                                            </div>
                                        </li>
                                    )}

                                <li><hr className="dropdown-divider topbar-dd-divider" /></li>

                                {/* Nav items */}
                                {[
                                        { to: "/dashboard", icon: <FiGrid />, label: "Dashboard" },

                                        ...(canViewDocuments ? [{
                                            to: "/documents",
                                            icon: <FiFileText />,
                                            label:"My Documents"

                                        }]:[]),

                                       

                                        ...(canViewSettings
                                            ? [{
                                                to: "/settings",
                                                icon: <FiSettings />,
                                                label: "Settings"
                                            }]
                                            : []),

                                        ...(canManageSubscription ? [{
                                            to: "/subscription/billing",
                                            icon: <FiCreditCard />,
                                            label: "Subscription & Billing"
                                        }]:[])
                                   
                                    ].map(({ to, icon, label }) => (




                                    <li key={to}>
                                        <Link className="dropdown-item topbar-dd-item" to={to}>
                                            <span className="topbar-dd-item-icon">{icon}</span>
                                            <span>{label}</span>
                                        </Link>
                                    </li>
                                ))}

                                <li><hr className="dropdown-divider topbar-dd-divider" /></li>

                                {/* Logout */}
                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item topbar-dd-item topbar-dd-item--danger"
                                        onClick={handleLogout}
                                    >
                                        <span className="topbar-dd-item-icon">
                                            <FiLogOut />
                                        </span>
                                        <span>Sign out</span>
                                    </button>
                                </li>

                            </ul>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
