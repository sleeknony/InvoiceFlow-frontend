import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FiBell,
    FiChevronDown,
    FiChevronRight,
    FiCreditCard,
    FiFileText,
    FiGrid,
    FiHelpCircle,
    FiLogOut,
    FiSettings,
    FiCheck,
    FiX,
    FiZap
} from "react-icons/fi";

import { useAuth } from "../context/useAuth";
import { useSubscription } from "../context/useSubscription";
import { getSettings } from "../services/settingsService";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";

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

    if (
        pathname.startsWith("/documents/") &&
        pathname !== "/documents/create"
    )
        return { section: "Documents", title: "Document Details" };

    if (pathname === "/documents")
        return { section: "Documents", title: "All Documents" };

    if (pathname.startsWith("/settings"))
        return { section: "Account", title: "Settings" };

    if (pathname === "/" || pathname.startsWith("/dashboard"))
        return { section: "Workspace", title: "Dashboard" };

    return { section: "Workspace", title: "invoiceNgine" };
}

function formatNotificationTime(dateValue) {
    if (!dateValue) return "";

    let date;

    // ASP.NET Core may return an ISO UTC timestamp with Z.
    // If the value does not contain timezone information,
    // explicitly treat it as UTC.
    if (
        typeof dateValue === "string" &&
        !dateValue.endsWith("Z") &&
        !/[+-]\d{2}:\d{2}$/.test(dateValue)
    ) {
        date = new Date(`${dateValue}Z`);
    } else {
        date = new Date(dateValue);
    }

    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();

    let diffSeconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    if (diffSeconds < 0) {
        diffSeconds = 0;
    }

    if (diffSeconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(diffSeconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString();
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

    const [settings, setSettings] = useState(null);

    // ---------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------

    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] =
        useState(0);

    const [notificationsOpen, setNotificationsOpen] =
        useState(false);

    const [notificationsLoading, setNotificationsLoading] =
        useState(false);

    const [markingAllRead, setMarkingAllRead] =
        useState(false);

    const notificationRef = useRef(null);

    // ---------------------------------------------------------
    // Company settings
    // ---------------------------------------------------------

    useEffect(() => {
        async function loadCompanySettings() {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (err) {
                console.error(
                    "Failed to load company settings:",
                    err
                );
            }
        }

        if (isAuthenticated) {
            loadCompanySettings();
        }
    }, [isAuthenticated]);

    // ---------------------------------------------------------
    // Load notification count
    // ---------------------------------------------------------

    useEffect(() => {
        if (!isAuthenticated) {
            setUnreadNotificationCount(0);
            return;
        }

        async function loadUnreadCount() {
            try {
                const count =
                    await getUnreadNotificationCount();

                setUnreadNotificationCount(count);
            } catch (err) {
                console.error(
                    "Failed to load notification count:",
                    err
                );
            }
        }

        loadUnreadCount();

        // Refresh the unread count periodically.
        const interval = setInterval(
            loadUnreadCount,
            60000
        );

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // ---------------------------------------------------------
    // Load notifications
    // ---------------------------------------------------------

    const loadNotifications = async () => {
        if (!isAuthenticated) return;

        try {
            setNotificationsLoading(true);

            const data = await getNotifications(10);

            setNotifications(
                Array.isArray(data) ? data : []
            );

            const count =
                await getUnreadNotificationCount();

            setUnreadNotificationCount(count);
        } catch (err) {
            console.error(
                "Failed to load notifications:",
                err
            );
        } finally {
            setNotificationsLoading(false);
        }
    };

    // ---------------------------------------------------------
    // Notification dropdown
    // ---------------------------------------------------------

    const handleNotificationToggle = async () => {
        const nextState = !notificationsOpen;

        setNotificationsOpen(nextState);

        if (nextState) {
            await loadNotifications();
        }
    };

    // ---------------------------------------------------------
    // Close notification dropdown when clicking outside
    // ---------------------------------------------------------

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // ---------------------------------------------------------
    // Mark notification as read
    // ---------------------------------------------------------

    const handleNotificationClick = async (
        notification
    ) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(
                    notification.id
                );

                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id
                            ? {
                                ...item,
                                isRead: true
                            }
                            : item
                    )
                );

                setUnreadNotificationCount(
                    (current) =>
                        Math.max(0, current - 1)
                );
            }

            if (notification.url) {
                setNotificationsOpen(false);
                navigate(notification.url);
            }
        } catch (err) {
            console.error(
                "Failed to mark notification as read:",
                err
            );
        }
    };

    // ---------------------------------------------------------
    // Mark all as read
    // ---------------------------------------------------------

    const handleMarkAllAsRead = async () => {
        if (unreadNotificationCount === 0) return;

        try {
            setMarkingAllRead(true);

            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );

            setUnreadNotificationCount(0);
        } catch (err) {
            console.error(
                "Failed to mark all notifications as read:",
                err
            );
        } finally {
            setMarkingAllRead(false);
        }
    };

    // ---------------------------------------------------------
    // Logout
    // ---------------------------------------------------------

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const email = user?.email || "No email";

    const displayName =
        user?.name ||
        user?.firstName ||
        user?.email ||
        "User";

    const initial =
        displayName?.charAt(0)?.toUpperCase() || "U";

    const companyName =
        settings?.companyName || "";

    const planActionLabel =
        isEnterprise
            ? "Manage Plan"
            : isFree
                ? "Upgrade Plan"
                : "Change Plan";

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

    const canViewSettings =
        hasPermission("ViewCompanySettings") ||
        hasPermission("ManageCompanySettings");

    const canViewDocuments =
        hasPermission("ViewDocuments");

    const canManageSubscription =
        hasPermission(
            "ManageCompanySubscriptions"
        );

    return (
        <header className="app-topbar">

            {/* ── LEFT — company + breadcrumb ─────────── */}

            <div className="topbar-left">

                {companyName && (
                    <div
                        className="topbar-company-name"
                        title={companyName}
                    >
                        {companyName}
                    </div>
                )}

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

                        {/* Plan pill */}

                        {!subscriptionLoading && (
                            <button
                                type="button"
                                className={`topbar-plan ${isFree
                                        ? "topbar-plan--free"
                                        : "topbar-plan--paid"
                                    }`}
                                onClick={() =>
                                    navigate(
                                        "/subscription/billing"
                                    )
                                }
                                title="Subscription & Billing"
                            >
                                <FiZap className="topbar-plan-icon" />

                                <span>
                                    {planName || "Free"} Plan
                                </span>
                            </button>
                        )}

                        {/* Notifications */}

                        <div
                            className="topbar-notif-wrap"
                            ref={notificationRef}
                        >

                            <button
                                type="button"
                                className={`topbar-icon-btn ${notificationsOpen
                                        ? "topbar-icon-btn--active"
                                        : ""
                                    }`}
                                title="Notifications"
                                onClick={
                                    handleNotificationToggle
                                }
                                aria-label="Notifications"
                                aria-expanded={
                                    notificationsOpen
                                }
                            >
                                <FiBell />

                                {unreadNotificationCount >
                                    0 && (
                                        <span className="topbar-notif-badge">
                                            {unreadNotificationCount >
                                                99
                                                ? "99+"
                                                : unreadNotificationCount}
                                        </span>
                                    )}
                            </button>

                            {notificationsOpen && (
                                <div className="topbar-notification-dropdown">

                                    <div className="topbar-notification-header">

                                        <div>
                                            <div className="topbar-notification-title">
                                                Notifications
                                            </div>

                                            <div className="topbar-notification-subtitle">
                                                {unreadNotificationCount >
                                                    0
                                                    ? `${unreadNotificationCount} unread`
                                                    : "You're all caught up"}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="topbar-notification-mark-all"
                                            onClick={
                                                handleMarkAllAsRead
                                            }
                                            disabled={
                                                markingAllRead ||
                                                unreadNotificationCount ===
                                                0
                                            }
                                        >
                                            <FiCheck />

                                            {markingAllRead
                                                ? "Marking..."
                                                : "Mark all read"}
                                        </button>

                                    </div>

                                    <div className="topbar-notification-list">

                                        {notificationsLoading ? (

                                            <div className="topbar-notification-empty">
                                                Loading notifications...
                                            </div>

                                        ) : notifications.length ===
                                            0 ? (

                                            <div className="topbar-notification-empty">

                                                <div className="topbar-notification-empty-icon">
                                                    <FiBell />
                                                </div>

                                                <strong>
                                                    No notifications
                                                </strong>

                                                <span>
                                                    You're all caught up.
                                                </span>

                                            </div>

                                        ) : (

                                            notifications.map(
                                                (notification) => (
                                                    <button
                                                        key={
                                                            notification.id
                                                        }
                                                        type="button"
                                                        className={`topbar-notification-item ${notification.isRead
                                                                ? ""
                                                                : "topbar-notification-item--unread"
                                                            }`}
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification
                                                            )
                                                        }
                                                    >

                                                        <span className="topbar-notification-indicator" />

                                                        <span className="topbar-notification-content">

                                                            <span className="topbar-notification-item-title">
                                                                {
                                                                    notification.title
                                                                }
                                                            </span>

                                                            <span className="topbar-notification-item-message">
                                                                {
                                                                    notification.message
                                                                }
                                                            </span>

                                                            <span className="topbar-notification-time">
                                                                {formatNotificationTime(
                                                                    notification.createdAt
                                                                )}
                                                            </span>

                                                        </span>

                                                    </button>
                                                )
                                            )

                                        )}

                                    </div>

                                    <div className="topbar-notification-footer">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNotificationsOpen(
                                                    false
                                                );
                                                navigate(
                                                    "/notifications"
                                                );
                                            }}
                                        >
                                            View all notifications
                                            <FiChevronRight />
                                        </button>

                                    </div>

                                </div>
                            )}

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

                                <FiChevronDown className="topbar-chevron" />

                            </button>

                            {/* ── Dropdown ──────────────────── */}

                            <ul className="dropdown-menu dropdown-menu-end topbar-dropdown">

                                {/* Header */}

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

                                {/* Plan row */}

                                {canManageSubscription &&
                                    !subscriptionLoading && (
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
                                                    onClick={() =>
                                                        navigate(
                                                            "/pricing"
                                                        )
                                                    }
                                                >
                                                    {planActionLabel}
                                                </button>

                                            </div>

                                        </li>
                                    )}

                                <li>
                                    <hr className="dropdown-divider topbar-dd-divider" />
                                </li>

                                {/* Nav items */}

                                {[
                                    {
                                        to: "/dashboard",
                                        icon: <FiGrid />,
                                        label: "Dashboard"
                                    },

                                        
                                    ...(canViewDocuments
                                        ? [{
                                            to: "/documents",
                                            icon: <FiFileText />,
                                            label: "My Documents"
                                        }]
                                        : []),

                                    ...(canViewSettings
                                        ? [{
                                            to: "/settings",
                                            icon: <FiSettings />,
                                            label: "Settings"
                                        }]
                                        : []),

                                    ...(canManageSubscription
                                        ? [{
                                            to: "/subscription/billing",
                                            icon: <FiCreditCard />,
                                            label: "Subscription & Billing"
                                        }]
                                        : [])
                                ].map(({ to, icon, label }) => (

                                    <li key={to}>

                                        <Link
                                            className="dropdown-item topbar-dd-item"
                                            to={to}
                                        >

                                            <span className="topbar-dd-item-icon">
                                                {icon}
                                            </span>

                                            <span>
                                                {label}
                                            </span>

                                        </Link>

                                    </li>

                                ))}


                                    <li>
                                        <hr className="dropdown-divider topbar-dd-divider" />
                                    </li>

                                    {/* Help & Support */}

                                    <li>
                                        <Link
                                            className="dropdown-item topbar-dd-item"
                                            to="/help"
                                        >
                                            <span className="topbar-dd-item-icon">
                                                <FiHelpCircle />
                                            </span>

                                            <span>
                                                Help & Support
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider topbar-dd-divider" />
                                    </li>

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