import {
    FiBell,
    FiChevronDown,
    FiChevronRight,
    FiLogOut,
    FiCheck,
    FiCheckCircle
} from "react-icons/fi";

import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { useAuth } from "../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";

import "./Topbar.css";

function getPageContext(pathname) {
    if (pathname.startsWith("/superadmin/companies/")) {
        return {
            section: "Platform",
            title: "Company Users"
        };
    }

    if (pathname.startsWith("/superadmin/companies")) {
        return {
            section: "Platform",
            title: "Companies"
        };
    }

    if (pathname.startsWith("/superadmin/audit")) {
        return {
            section: "Administration",
            title: "Audit Logs"
        };
    }

    if (pathname.startsWith("/superadmin/support")) {
        return {
            section: "Support",
            title: "Support Tickets"
        };
    }

    return {
        section: "Platform",
        title: "SuperAdmin"
    };
}

function normalizeNotifications(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.notifications)) {
        return response.notifications;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}

function isNotificationRead(notification) {
    return Boolean(
        notification?.isRead ??
        notification?.read ??
        notification?.readAt
    );
}

function getNotificationId(notification) {
    return notification?.id ?? notification?.notificationId;
}

function getNotificationTitle(notification) {
    return (
        notification?.title ??
        notification?.subject ??
        "Notification"
    );
}

function getNotificationMessage(notification) {
    return (
        notification?.message ??
        notification?.body ??
        notification?.description ??
        ""
    );
}

function getNotificationUrl(notification) {
    return (
        notification?.url ??
        notification?.actionUrl ??
        notification?.link ??
        ""
    );
}

function formatNotificationTime(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 1000)
    );

    if (elapsedSeconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(elapsedSeconds / 60);

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

export default function SuperAdminTopbar() {
    const {
        user,
        isAuthenticated,
        logout
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const notificationRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationError, setNotificationError] = useState("");
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const pageContext = getPageContext(location.pathname);

    const loadNotifications = useCallback(async (showLoading = false) => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        if (showLoading) {
            setNotificationsLoading(true);
        }

        try {
            const [notificationResponse, unreadResponse] =
                await Promise.all([
                    getNotifications(20),
                    getUnreadNotificationCount()
                ]);

            setNotifications(
                normalizeNotifications(notificationResponse)
            );

            setUnreadCount(
                Number(unreadResponse) || 0
            );

            setNotificationError("");
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );

            setNotificationError(
                "Unable to load notifications. Please try again."
            );
        } finally {
            if (showLoading) {
                setNotificationsLoading(false);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            setNotificationsOpen(false);
            return undefined;
        }

        loadNotifications();

        const intervalId = window.setInterval(() => {
            loadNotifications();
        }, 60000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isAuthenticated, loadNotifications]);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setNotificationsOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, []);

    const handleLogout = () => {
        logout();

        navigate("/login", {
            replace: true
        });
    };

    const handleToggleNotifications = async () => {
        const willOpen = !notificationsOpen;

        setNotificationsOpen(willOpen);

        if (willOpen) {
            await loadNotifications(true);
        }
    };

    const handleNotificationClick = async (notification) => {
        const notificationId = getNotificationId(notification);
        const alreadyRead = isNotificationRead(notification);
        const targetUrl = getNotificationUrl(notification);

        if (notificationId != null && !alreadyRead) {
            // Update the UI immediately, then synchronize with the API.
            setNotifications((current) =>
                current.map((item) =>
                    String(getNotificationId(item)) ===
                        String(notificationId)
                        ? { ...item, isRead: true, read: true }
                        : item
                )
            );

            setUnreadCount((current) =>
                Math.max(0, current - 1)
            );

            try {
                await markNotificationAsRead(notificationId);
            } catch (error) {
                console.error(
                    "Failed to mark notification as read:",
                    error
                );

                await loadNotifications();
            }
        }

        setNotificationsOpen(false);

        if (
            typeof targetUrl === "string" &&
            targetUrl.startsWith("/") &&
            !targetUrl.startsWith("//")
        ) {
            navigate(targetUrl);
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0 || markingAllRead) {
            return;
        }

        setMarkingAllRead(true);

        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    isRead: true,
                    read: true
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            setNotificationError(
                "Could not mark all notifications as read."
            );

            await loadNotifications();
        } finally {
            setMarkingAllRead(false);
        }
    };

    const email = user?.email || "No email";

    const displayName =
        user?.name ||
        user?.firstName ||
        user?.email ||
        "SuperAdmin";

    const initial =
        displayName?.charAt(0)?.toUpperCase() || "S";

    return (
        <header className="app-topbar">
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

            <div className="topbar-right">
                {!isAuthenticated ? (
                    <div className="topbar-auth-actions">
                        Login
                    </div>
                ) : (
                    <>
                        {/* Notifications dropdown */}
                        <div
                            className="topbar-notif-wrap"
                            ref={notificationRef}
                        >
                            <button
                                type="button"
                                className="topbar-icon-btn"
                                title="Notifications"
                                aria-label={
                                    unreadCount > 0
                                        ? `Notifications, ${unreadCount} unread`
                                        : "Notifications"
                                }
                                aria-expanded={notificationsOpen}
                                aria-haspopup="true"
                                onClick={handleToggleNotifications}
                            >
                                <FiBell />

                                {unreadCount > 0 && (
                                    <span className="topbar-notif-count">
                                        {unreadCount > 99
                                            ? "99+"
                                            : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationsOpen && (
                                <div
                                    className="topbar-notif-dropdown"
                                    role="dialog"
                                    aria-label="Notifications"
                                >
                                    <div className="topbar-notif-header">
                                        <div>
                                            <h6>Notifications</h6>

                                            <span>
                                                {unreadCount === 0
                                                    ? "You're all caught up"
                                                    : `${unreadCount} unread`}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="topbar-notif-mark-all"
                                            disabled={
                                                unreadCount === 0 ||
                                                markingAllRead
                                            }
                                            onClick={handleMarkAllRead}
                                        >
                                            <FiCheck />
                                            {markingAllRead
                                                ? "Updating..."
                                                : "Mark all read"}
                                        </button>
                                    </div>

                                    {notificationError && (
                                        <div className="topbar-notif-error">
                                            {notificationError}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    loadNotifications(true)
                                                }
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    )}

                                    <div className="topbar-notif-list">
                                        {notificationsLoading ? (
                                            <div className="topbar-notif-empty">
                                                Loading notifications...
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="topbar-notif-empty">
                                                <FiBell />
                                                <span>
                                                    No notifications yet.
                                                </span>
                                            </div>
                                        ) : (
                                            notifications.map(
                                                (notification, index) => {
                                                    const id =
                                                        getNotificationId(
                                                            notification
                                                        );

                                                    const read =
                                                        isNotificationRead(
                                                            notification
                                                        );

                                                    const createdAt =
                                                        notification?.createdAt ??
                                                        notification?.createdOn ??
                                                        notification?.timestamp;

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={
                                                                id ??
                                                                `notification-${index}`
                                                            }
                                                            className={
                                                                `topbar-notif-item ${read
                                                                    ? "is-read"
                                                                    : "is-unread"
                                                                }`
                                                            }
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification
                                                                )
                                                            }
                                                        >
                                                            <span className="topbar-notif-item-icon">
                                                                {read ? (
                                                                    <FiCheckCircle />
                                                                ) : (
                                                                    <FiBell />
                                                                )}
                                                            </span>

                                                            <span className="topbar-notif-item-content">
                                                                <span className="topbar-notif-item-title">
                                                                    {getNotificationTitle(
                                                                        notification
                                                                    )}
                                                                </span>

                                                                <span className="topbar-notif-item-message">
                                                                    {getNotificationMessage(
                                                                        notification
                                                                    )}
                                                                </span>

                                                                <span className="topbar-notif-item-time">
                                                                    {formatNotificationTime(
                                                                        createdAt
                                                                    )}
                                                                </span>
                                                            </span>

                                                            {!read && (
                                                                <span
                                                                    className="topbar-notif-unread-dot"
                                                                    aria-label="Unread"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                }
                                            )
                                        )}
                                    </div>

                                    <div className="topbar-notif-footer">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNotificationsOpen(false);
                                                navigate("/superadmin/support");
                                            }}
                                        >
                                            Open Support Tickets
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="topbar-divider" />

                        {/* Existing user dropdown */}
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
