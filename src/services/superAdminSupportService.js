
import http from "../api/http";

const BASE_URL = "/superadmin/support";
const AGENTS_URL = `${BASE_URL}/agents`;

// ============================================================
// SUPPORT TICKETS
// ============================================================

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

// ============================================================
// SUPPORT AGENTS
// ============================================================

export const getSupportAgents = async (params = {}) => {
    const response = await http.get(AGENTS_URL, {
        params: {
            includeInactive: true,
            ...params
        }
    });

    return response.data;
};

export const createSupportAgent = async (data) => {
    const response = await http.post(AGENTS_URL, data);

    return response.data;
};

export const resendSupportAgentInvitation = async (userId) => {
    const response = await http.post(
        `${AGENTS_URL}/${encodeURIComponent(userId)}/resend-invitation`
    );

    return response.data;
};

export const updateSupportAgentStatus = async (userId, isActive) => {
    const response = await http.put(
        `${AGENTS_URL}/${encodeURIComponent(userId)}/status`,
        { isActive }
    );

    return response.data;
};


export const getSupportAssignees = async () => {
    const response = await http.get(`${BASE_URL}/assignees`);
    return response.data;
};

