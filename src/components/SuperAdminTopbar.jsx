import {
    FiBell,
    FiChevronDown,
    FiChevronRight,
    FiLogOut
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

import "./Topbar.css";

function getPageContext(pathname) {

    if (
        pathname.startsWith(
            "/superadmin/companies/"
        )
    ) {
        return {
            section: "Platform",
            title: "Company Users"
        };
    }

    if (
        pathname.startsWith(
            "/superadmin/companies"
        )
    ) {
        return {
            section: "Platform",
            title: "Companies"
        };
    }

    if (
        pathname.startsWith(
            "/superadmin/audit"
        )
    ) {
        return {
            section: "Administration",
            title: "Audit Logs"
        };
    }

    return {
        section: "Platform",
        title: "SuperAdmin"
    };
}

export default function SuperAdminTopbar() {

    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const pageContext =
        getPageContext(
            location.pathname
        );

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };

    const email =
        user?.email ||
        "No email";

    const displayName =
        user?.name ||
        user?.firstName ||
        user?.email ||
        "SuperAdmin";

    const initial =
        displayName
            ?.charAt(0)
            ?.toUpperCase() ||
        "S";

    return (
        <header className="app-topbar">

            {/* =====================================================
                LEFT — BREADCRUMB
            ===================================================== */}

            <div className="topbar-left">

                <div className="topbar-breadcrumb">

                    <span className="topbar-breadcrumb-section">
                        {pageContext.section}
                    </span>

                    <FiChevronRight
                        className="topbar-breadcrumb-sep"
                    />

                    <span className="topbar-breadcrumb-title">
                        {pageContext.title}
                    </span>

                </div>

            </div>

            {/* =====================================================
                RIGHT
            ===================================================== */}

            <div className="topbar-right">

                {!isAuthenticated ? (

                    <div className="topbar-auth-actions">
                        Login
                    </div>

                ) : (

                    <>

                        {/* Notifications */}

                        <div className="topbar-notif-wrap">

                            <button
                                type="button"
                                className="topbar-icon-btn"
                                title="Notifications"
                            >
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

                                    <span className="topbar-user-name">
                                        {displayName}
                                    </span>

                                    <span className="topbar-user-email">
                                        {email}
                                    </span>

                                </div>

                                <FiChevronDown
                                    className="topbar-chevron"
                                />

                            </button>

                            <ul className="dropdown-menu dropdown-menu-end topbar-dropdown">

                                <li>

                                    <div className="topbar-dd-header">

                                        <div className="topbar-dd-avatar">
                                            {initial}
                                        </div>

                                        <div className="topbar-dd-user-info">

                                            <div className="topbar-dd-name">
                                                {displayName}
                                            </div>

                                            <div className="topbar-dd-email">
                                                {email}
                                            </div>

                                        </div>

                                    </div>

                                </li>

                                <li>
                                    <hr className="dropdown-divider topbar-dd-divider" />
                                </li>

                                <li>

                                    <button
                                        type="button"
                                        className="dropdown-item topbar-dd-item topbar-dd-item--danger"
                                        onClick={handleLogout}
                                    >

                                        <span className="topbar-dd-item-icon">
                                            <FiLogOut />
                                        </span>

                                        <span>
                                            Sign out
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