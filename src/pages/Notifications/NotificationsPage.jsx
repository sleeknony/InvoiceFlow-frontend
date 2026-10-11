import { useCallback, useEffect, useState } from "react";
import {
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiRefreshCw,
    FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../services/notificationService";

import "./NotificationsPage.css";


function formatNotificationTime(dateValue) {
    if (!dateValue) return "";

    let date;

    if (
        typeof dateValue === "string" &&
        !dateValue.endsWith("Z") &&
        !/[+-]\d{2}:\d{2}$/.test(dateValue)
    ) {
        date = new Date(`${dateValue}Z`);
    } else {
        date = new Date(dateValue);
    }

    if (Number.isNaN(date.getTime())) {
        return "";
    }

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


export default function NotificationsPage() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const loadNotifications = useCallback(async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getNotifications(100);

            setNotifications(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            setNotifications([]);

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }, []);


    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);


    const unreadCount = notifications.filter(
        notification => !notification.isRead
    ).length;


    const displayedNotifications =
        activeFilter === "unread"
            ? notifications.filter(
                notification => !notification.isRead
            )
            : notifications;


    const handleNotificationClick = async (notification) => {

        try {

            if (!notification.isRead) {

                await markNotificationAsRead(
                    notification.id
                );

                setNotifications(current =>
                    current.map(item =>
                        item.id === notification.id
                            ? {
                                ...item,
                                isRead: true,
                            }
                            : item
                    )
                );

            }

            if (notification.url) {
                navigate(notification.url);
            }

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

        }

    };


    const handleMarkAllAsRead = async () => {

        if (unreadCount === 0) {
            return;
        }

        try {

            setMarkingAllRead(true);

            await markAllNotificationsAsRead();

            setNotifications(current =>
                current.map(notification => ({
                    ...notification,
                    isRead: true,
                }))
            );

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

        } finally {

            setMarkingAllRead(false);

        }

    };


    return (
        <div className="notifications-page">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="notifications-page-header">

                <div>

                    <div className="notifications-page-kicker">
                        NOTIFICATIONS
                    </div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay up to date with activity and important
                        updates from your InvoiceFlow account.
                    </p>

                </div>


                <button
                    type="button"
                    className="notifications-refresh-btn"
                    onClick={() => loadNotifications(true)}
                    disabled={refreshing}
                >
                    <FiRefreshCw
                        className={
                            refreshing
                                ? "notifications-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =====================================================
                TOOLBAR
            ===================================================== */}

            <div className="notifications-toolbar">

                <div className="notifications-filters">

                    <button
                        type="button"
                        className={
                            activeFilter === "all"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() => setActiveFilter("all")}
                    >
                        All

                        <span className="notification-filter-count">
                            {notifications.length}
                        </span>
                    </button>


                    <button
                        type="button"
                        className={
                            activeFilter === "unread"
                                ? "notification-filter active"
                                : "notification-filter"
                        }
                        onClick={() => setActiveFilter("unread")}
                    >
                        Unread

                        <span className="notification-filter-count">
                            {unreadCount}
                        </span>
                    </button>

                </div>


                <button
                    type="button"
                    className="notifications-mark-all-btn"
                    onClick={handleMarkAllAsRead}
                    disabled={
                        unreadCount === 0 ||
                        markingAllRead
                    }
                >
                    <FiCheckCircle />

                    {markingAllRead
                        ? "Marking..."
                        : "Mark all as read"}
                </button>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="notifications-card">

                {loading ? (

                    <div className="notifications-state">

                        <div className="notifications-loading-icon">
                            <FiBell />
                        </div>

                        <p>
                            Loading notifications...
                        </p>

                    </div>

                ) : displayedNotifications.length === 0 ? (

                    <div className="notifications-state">

                        <div className="notifications-empty-icon">
                            <FiBell />
                        </div>

                        <h3>
                            {activeFilter === "unread"
                                ? "No unread notifications"
                                : "No notifications yet"}
                        </h3>

                        <p>
                            {activeFilter === "unread"
                                ? "You're all caught up."
                                : "Important account activity and updates will appear here."}
                        </p>

                    </div>

                ) : (

                    <div className="notifications-list">

                        {displayedNotifications.map(
                            notification => (

                                <button
                                    key={notification.id}
                                    type="button"
                                    className={
                                        notification.isRead
                                            ? "notification-row"
                                            : "notification-row unread"
                                    }
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                >

                                    <div className="notification-row-icon">

                                        <FiBell />

                                    </div>


                                    <div className="notification-row-content">

                                        <div className="notification-row-top">

                                            <h3>
                                                {notification.title}
                                            </h3>

                                            <span className="notification-row-time">
                                                {formatNotificationTime(
                                                    notification.createdAt
                                                )}
                                            </span>

                                        </div>


                                        <p>
                                            {notification.message}
                                        </p>


                                        {notification.url && (

                                            <span className="notification-row-action">

                                                View details

                                                <FiArrowRight />

                                            </span>

                                        )}

                                    </div>


                                    {!notification.isRead && (

                                        <span
                                            className="notification-unread-dot"
                                            title="Unread"
                                        />

                                    )}

                                </button>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}