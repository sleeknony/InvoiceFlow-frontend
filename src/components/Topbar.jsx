import { Link, useLocation, useNavigate} from "react-router-dom";
import {
    FiBell,
    FiChevronDown,
    FiCreditCard,
    FiFileText,
    FiGrid,
    FiLogOut,
    FiSettings,
    FiUser
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { useSubscription } from "../context/useSubscription";

import "./Topbar.css";

function getPageContext(pathname) {

    // ==========================================
    // SUBSCRIPTION
    // ==========================================

    if (pathname === "/pricing") {
        return {
            section: "Subscription",
            title: "Plans & Pricing"
        };
    }

    if (pathname.startsWith("/subscription/billing")) {
        return {
            section: "Subscription",
            title: "Subscription & Billing"
        };
    }


    // ==========================================
    // CUSTOMERS
    // ==========================================

    if (pathname.startsWith("/customers")) {
        return {
            section: "Workspace",
            title: "Customers"
        };
    }


    // ==========================================
    // DOCUMENTS
    // ==========================================

    if (pathname === "/documents/create") {
        return {
            section: "Documents",
            title: "Create Document"
        };
    }

    // View / edit individual document
    if (
        pathname.startsWith("/documents/") &&
        pathname !== "/documents/create"
    ) {
        return {
            section: "Documents",
            title: "Document Details"
        };
    }

    if (pathname === "/documents") {
        return {
            section: "Documents",
            title: "All Documents"
        };
    }


    // ==========================================
    // SETTINGS
    // ==========================================

    if (pathname.startsWith("/settings")) {
        return {
            section: "Account",
            title: "Settings"
        };
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    if (
        pathname === "/" ||
        pathname.startsWith("/dashboard")
    ) {
        return {
            section: "Workspace",
            title: "Dashboard"
        };
    }


    // ==========================================
    // FALLBACK
    // ==========================================

    return {
        section: "Workspace",
        title: "InvoiceFlow"
    };
}

export default function Topbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const pageContext =
        getPageContext(location.pathname);

    const {
        planName,
        isFree,
        isEnterprise,
        loading: subscriptionLoading
    } = useSubscription();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const email =
        user?.email || "No email";

    const displayName =
        user?.name ||
        user?.firstName ||
        user?.email ||
        "User";

    const initial =
        displayName
            ?.charAt(0)
            ?.toUpperCase() || "U";

    const planActionLabel =
        isEnterprise
            ? "Manage Plan"
            : isFree
                ? "Upgrade Plan"
                : "Change Plan";

    return (
        <header className="app-topbar">

            {/* ==========================================
                LEFT
            ========================================== */}

            <div className="topbar-left">

                <div className="topbar-page-context">

                    <span className="topbar-context-label">
                        {pageContext.section}
                    </span>

                    <span className="topbar-context-name">
                        {pageContext.title}
                    </span>

                </div>

            </div>


            {/* ==========================================
                RIGHT
            ========================================== */}

            <div className="topbar-right">

                {!isAuthenticated ? (
                    <div className="topbar-auth-actions">

                        <Link
                            to="/login"
                            className="topbar-login-btn"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="topbar-register-btn"
                        >
                            Register
                        </Link>

                    </div>
                ) : (
                    <>
                        {/* ==================================
                            CURRENT PLAN
                        ================================== */}

                        {!subscriptionLoading && (
                            <button
                                type="button"
                                className="topbar-plan"
                                onClick={() =>
                                    navigate(
                                        "/subscription/billing"
                                    )
                                }
                                title="Subscription & Billing"
                            >
                                <span className="topbar-plan-dot" />

                                <span>
                                    {planName || "Free"}
                                </span>
                            </button>
                        )}


                        {/* ==================================
                            NOTIFICATIONS
                        ================================== */}

                        <button
                            type="button"
                            className="topbar-icon-btn"
                            title="Notifications"
                        >
                            <FiBell />
                        </button>


                        <div className="topbar-divider" />


                        {/* ==================================
                            USER
                        ================================== */}

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

                                    <span className="topbar-user-name">
                                        {displayName}
                                    </span>

                                    <span className="topbar-user-email">
                                        {email}
                                    </span>

                                </div>

                                <FiChevronDown className="topbar-chevron" />
                            </button>


                            {/* ==============================
                                DROPDOWN
                            ============================== */}

                            <ul className="dropdown-menu dropdown-menu-end topbar-dropdown">

                                {/* USER HEADER */}

                                <li className="topbar-dropdown-header">

                                    <div className="topbar-dropdown-avatar">
                                        {initial}
                                    </div>

                                    <div>
                                        <div className="topbar-dropdown-name">
                                            {displayName}
                                        </div>

                                        <div className="topbar-dropdown-email">
                                            {email}
                                        </div>
                                    </div>

                                </li>


                                {!subscriptionLoading && (
                                    <li className="topbar-dropdown-plan">

                                        <span>
                                            Current plan
                                        </span>

                                        <strong>
                                            {planName || "Free"}
                                        </strong>

                                    </li>
                                )}


                                <li>
                                    <hr className="dropdown-divider" />
                                </li>


                                {/* NAVIGATION */}

                                <li>
                                    <Link
                                        className="dropdown-item topbar-dropdown-item"
                                        to="/dashboard"
                                    >
                                        <FiGrid />

                                        <span>
                                            Dashboard
                                        </span>
                                    </Link>
                                </li>


                                <li>
                                    <Link
                                        className="dropdown-item topbar-dropdown-item"
                                        to="/documents"
                                    >
                                        <FiFileText />

                                        <span>
                                            My Documents
                                        </span>
                                    </Link>
                                </li>


                                <li>
                                    <Link
                                        className="dropdown-item topbar-dropdown-item"
                                        to="/settings"
                                    >
                                        <FiSettings />

                                        <span>
                                            Settings
                                        </span>
                                    </Link>
                                </li>


                                <li>
                                    <Link
                                        className="dropdown-item topbar-dropdown-item"
                                        to="/subscription/billing"
                                    >
                                        <FiCreditCard />

                                        <span>
                                            Subscription & Billing
                                        </span>
                                    </Link>
                                </li>


                                <li>
                                    <hr className="dropdown-divider" />
                                </li>


                                {/* PLAN */}

                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item topbar-dropdown-item topbar-plan-action"
                                        onClick={() =>
                                            navigate("/pricing")
                                        }
                                    >
                                        <FiCreditCard />

                                        <span>
                                            {planActionLabel}
                                        </span>
                                    </button>
                                </li>


                                <li>
                                    <hr className="dropdown-divider" />
                                </li>


                                {/* LOGOUT */}

                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item topbar-dropdown-item topbar-logout"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut />

                                        <span>
                                            Logout
                                        </span>
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