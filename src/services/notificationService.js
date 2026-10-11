import http from "../api/http";

/**
 * Get the latest notifications for the current user.
 */
export const getNotifications = async (limit = 20) => {
    const response = await http.get("/Notifications", {
        params: { limit },
    });

    return response.data;
};

/**
 * Get the unread notification count.
 */
export const getUnreadNotificationCount = async () => {
    const response = await http.get("/Notifications/unread-count");

    return response.data?.count ?? 0;
};

/**
 * Mark one notification as read.
 */
export const markNotificationAsRead = async (id) => {
    const response = await http.put(`/Notifications/${id}/read`);

    return response.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsAsRead = async () => {
    const response = await http.put("/Notifications/read-all");

    return response.data;
};