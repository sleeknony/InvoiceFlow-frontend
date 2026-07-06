
import http from "../api/http";

export const getDocuments = async () => {
    const res = await http.get("/documents");
    return res.data;
};

export const getDocument = async (id) => {
    const res = await http.get(`/documents/${id}`);
    return res.data;
};

export const getAllInvoices = async () => {
    const res = await http.get(`/documents/invoices`);
    return res.data;
};

export const createDocument = async (data) => {
    const res = await http.post("/documents", data);
    return res.data;
};

export const updateDocument = async (id, data) => {
    const res = await http.put(`/documents/${id}`, data);
    return res.data;
};

export const deleteDocument = async (id) => {
    const res = await http.delete(`/documents/${id}`);
    return res.data;
};

export const updateDocumentStatus =
    async (id, status) => {
        const res = await http.put(
            `/documents/${id}/status`,
            { status }
        );

        return res.data;
    };


export const convertDocument =
    async (id, targetType) => {
        const res =
            await http.post(
                `/documents/${id}/convert`,
                {
                    targetType
                });

        return res.data;
    };

export const duplicateDocument = async (id) => {
    const res = await http.post(
        `/documents/${id}/duplicate`
    );

    return res.data;
};

export const downloadPdf =
    async (id) => {
        const response =
            await http.get(`/documents/${id}/pdf`,
                {
                    responseType:
                        "blob"
                });

        return response.data;
    };

export const emailDocument =
    async (id, data) => {
        const res =
            await http.post(
                `/documents/${id}/email`,
                data);

        return res.data;
    };

export const approveDocument = async (id) => {
    const res = await http.put(
        `/documents/${id}/approve`
    );

    return res.data;
};

export const rejectDocument = async (
    id, reason = ""
) => {
    const res = await http.put(
        `/documents/${id}/reject`,
        { reason }
    );

    return res.data;
};

//export const reopenDocument =
//    async (id) => {
//        const res =
//            await http.post(
//                `/documents/${id}/reopen`
//            );

//        return res.data;
//    };