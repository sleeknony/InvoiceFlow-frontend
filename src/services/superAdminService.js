import http from "../api/http";

export const getSuperAdminCompanies = async ({
    search = "",
    page = 1,
    pageSize = 20,
} = {}) => {
    const response = await http.get(
        "/superadmin/companies",
        {
            params: {
                search,
                page,
                pageSize,
            },
        }
    );

    return response.data;
};


export const getSuperAdminCompany = async (companyId) => {
    const response = await http.get(
        `/superadmin/companies/${companyId}`
    );

    return response.data;
};


export const getSuperAdminCompanyRoles = async (companyId) => {
    const response = await http.get(
        `/superadmin/companies/${companyId}/roles`
    );

    return response.data;
};


export const getSuperAdminCompanyUser = async (
    companyId,
    companyUserId
) => {
    const response = await http.get(
        `/superadmin/companies/${companyId}/users/${companyUserId}`
    );

    return response.data;
};


export const changeSuperAdminUserRole = async (
    companyId,
    companyUserId,
    roleId,
    reason
) => {
    const response = await http.put(
        `/superadmin/companies/${companyId}/users/${companyUserId}/role`,
        {
            roleId,
            reason,
        }
    );

    return response.data;
};


export const activateSuperAdminCompany = async (companyId) => {
    const response = await http.post(
        `/superadmin/companies/${companyId}/activate`
    );

    return response.data;
};


export const deactivateSuperAdminCompany = async (companyId) => {
    const response = await http.post(
        `/superadmin/companies/${companyId}/deactivate`
    );

    return response.data;
};


export const activateSuperAdminCompanyUser = async (
    companyId,
    companyUserId
) => {
    const response = await http.post(
        `/superadmin/companies/${companyId}/users/${companyUserId}/activate`
    );

    return response.data;
};


export const deactivateSuperAdminCompanyUser = async (
    companyId,
    companyUserId
) => {
    const response = await http.post(
        `/superadmin/companies/${companyId}/users/${companyUserId}/deactivate`
    );

    return response.data;
};


export const getSuperAdminCompanySubscriptionPayments = async (
    companyId,
    page = 1,
    pageSize = 20
) => {
    const response = await http.get(
        `/superadmin/companies/${companyId}/subscription/payments`,
        {
            params: {
                page,
                pageSize,
            },
        }
    );

    return response.data;
};


export const reconcileSuperAdminSubscriptionPayment = async (
    companyId,
    paymentId,
    reason
) => {
    const response = await http.post(
        `/superadmin/companies/${companyId}/subscription/payments/${paymentId}/reconcile`,
        {
            reason,
        }
    );

    return response.data;
};


export const changeSuperAdminCompanySubscription = async (
    companyId,
    plan,
    billingCycle,
    startDate,
    reason
) => {
    const response = await http.put(
        `/superadmin/companies/${companyId}/subscription`,
        {
            plan,
            billingCycle,
            startDate,
            reason,
        }
    );

    return response.data;
};


export const getSuperAdminCompanySubscriptionHistory = async (
    companyId,
    page = 1,
    pageSize = 20
) => {
    const response = await http.get(
        `/superadmin/companies/${companyId}/subscription/history`,
        {
            params: {
                page,
                pageSize,
            },
        }
    );

    return response.data;
};


export const getSuperAdminActivity = async ({
    search = "",
    action = "",
    companyId = "",
    fromDate = "",
    toDate = "",
    page = 1,
    pageSize = 20,
} = {}) => {
    const response = await http.get(
        "/superadmin/activity",
        {
            params: {
                search,
                action,
                companyId,
                fromDate,
                toDate,
                page,
                pageSize,
            },
        }
    );

    return response.data;
};