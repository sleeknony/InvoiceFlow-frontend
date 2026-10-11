import http from "../api/http";

export const getAgingReport = async () => {
    const response = await http.get("/Reports/aging");
    return response.data;
};

export const getOutstandingInvoices = async (query = {}) => {
    const response = await http.get(
        "/Reports/outstanding",
        {
            params: query,
        }
    );

    return response.data;
};

export const exportOutstandingInvoices = async (
    query = {}
) => {
    const response = await http.get(
        "/Reports/outstanding/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};

export const getOverdueInvoices = async (query = {}) => {
    const response = await http.get(
        "/Reports/overdue",
        {
            params: query,
        }
    );

    return response.data;
};

export const exportOverdueInvoices = async (
    query = {}
) => {
    const response = await http.get(
        "/Reports/overdue/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};

export const getCustomerStatement = async (
    query = {}
) => {
    const response = await http.get(
        "/Reports/customer-statement",
        {
            params: query,
        }
    );

    return response.data;
};

export const exportCustomerStatement = async (
    query = {}
) => {
    const response = await http.get(
        "/Reports/customer-statement/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};


export const getRevenueReport = async (query = {}) => {
    const response = await http.get("/Reports/revenue", {
        params: query,
    });

    return response.data;
};

export const exportRevenueReport = async (query = {}) => {
    const response = await http.get("/Reports/revenue/export", {
        params: query,
        responseType: "blob",
    });

    return response;
};

export const getPaymentCollections = async (query = {}) => {
    const response = await http.get("/Reports/payment-collections", {
        params: query,
    });

    return response.data;
};

export const exportPaymentCollections = async (query = {}) => {
    const response = await http.get(
        "/Reports/payment-collections/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};

export const getInvoiceRegister = async (query = {}) => {
    const response = await http.get("/Reports/invoice-register", {
        params: query,
    });

    return response.data;
};

export const exportInvoiceRegister = async (query = {}) => {
    const response = await http.get(
        "/Reports/invoice-register/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};


export const getActivityLog = async (query = {}) => {
    const response = await http.get("/Reports/activity", {
        params: query,
    });

    return response.data;
};

export const exportActivityLog = async (query = {}) => {
    const response = await http.get(
        "/Reports/activity/export",
        {
            params: query,
            responseType: "blob",
        }
    );

    return response;
};