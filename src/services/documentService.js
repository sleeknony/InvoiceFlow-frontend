
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

export async function downloadPdf({ html, fileName}) {

    const response = await http.post( "/pdf",{ html, fileName},

        {
            responseType: "blob"
        }

    );

    const blob = new Blob(
        [response.data],
        {
            type: "application/pdf"
        });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = fileName.endsWith(".pdf")
        ? fileName
        : `${fileName}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

}

export const emailDocument =
    async (id, data) => {
        const res =
            await http.post(
                `/documents/${id}/email`,
                data);

        return res.data;
    };

export const approveDocument = async (
    id,
    comment = ""
) => {
    const response = await http.post(
        `/documents/${id}/approve`,
        {
            comment
        }
    );

    return response.data;
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

export const addPayment = async (id, data) => {
    const res = await http.post(
        `/documents/${id}/payments`,
        data
    );

    return res.data;
};

export const getApprovalHistory = async (id) => {
    const res = await http.get(
        `/documents/${id}/history`
    );

    return res.data;
};


export const getPayments =
    async (id) => {
        const res =
            await http.get(
                `/documents/${id}/payments`);

        return res.data;
    };

export const getReceivables =
    async () => {
        const res =
            await http.get(
                "/dashboard/receivables"
            );

        return res.data;
    };

//export const getPreviewUrl = (id) =>
//    `${http.defaults.baseURL}/documents/${id}/preview`;


export const getDocumentPreview = async (id) => {

    const response =
        await http.get(
            `/documents/${id}/preview`,
            {
                responseType: "blob"
            }
        );

    return response.data;
};


export const downloadDocumentPdf = async (id) => {

        try {
            const response =
                await http.get(
                    `/documents/${id}/download`,
                    {
                        responseType: "blob"
                    }
                );

            return response;
        }
        catch (err) {

            // Because responseType is blob,
            // ASP.NET JSON/problem responses may also
            // arrive as Blob objects.

            const data =
                err?.response?.data;

            if (data instanceof Blob) {
                try {
                    const text =
                        await data.text();

                    const contentType =
                        data.type || "";

                    if (
                        contentType.includes(
                            "application/json"
                        ) ||
                        contentType.includes(
                            "application/problem+json"
                        )
                    ) {
                        const json =
                            JSON.parse(text);

                        err.downloadMessage =
                            json.message ||
                            json.detail ||
                            json.title;
                    }
                    else if (text) {
                        err.downloadMessage =
                            text;
                    }
                }
                catch (parseError) {
                    console.error(
                        "Unable to parse download error:",
                        parseError
                    );
                }
            }

            throw err;
        }
};


export async function submitForApproval(id) {

    const { data } =
        await http.post(
            `/documents/${id}/submit-for-approval`
        );

    return data;
}

//export const reopenDocument =
//    async (id) => {
//        const res =
//            await http.post(
//                `/documents/${id}/reopen`
//            );

//        return res.data;
//    };