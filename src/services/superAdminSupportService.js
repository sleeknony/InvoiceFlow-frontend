import http from "../api/http";

const BASE_URL = "/superadmin/support";

export const getSupportTickets = async (params = {}) => {
    const response = await http.get(`${BASE_URL}/tickets`, {
        params
    });

    return response.data;
};

export const getSupportTicket = async (ticketId) => {
    const response = await http.get(
        `${BASE_URL}/tickets/${ticketId}`
    );

    return response.data;
};

export const getSupportTicketAudit = async (ticketId) => {
    const response = await http.get(
        `${BASE_URL}/tickets/${ticketId}/audit`
    );

    return response.data;
};

export const assignSupportTicket = async (ticketId, data) => {
    const response = await http.put(
        `${BASE_URL}/tickets/${ticketId}/assignment`,
        data
    );

    return response.data;
};

export const updateSupportTicketStatus = async (ticketId, data) => {
    const response = await http.put(
        `${BASE_URL}/tickets/${ticketId}/status`,
        data
    );

    return response.data;
};

export const updateSupportTicketPriority = async (ticketId, data) => {
    const response = await http.put(
        `${BASE_URL}/tickets/${ticketId}/priority`,
        data
    );

    return response.data;
};

export const linkTawkConversation = async (ticketId, data) => {
    const response = await http.put(
        `${BASE_URL}/tickets/${ticketId}/tawk-conversation`,
        data
    );

    return response.data;
};