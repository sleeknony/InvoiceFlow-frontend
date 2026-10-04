import http from "../api/http";

export const getCustomers = () =>
    http.get("/customers");

export async function getCustomer(id) {
    const response =
        await http.get(`/customers/${id}`);

    return response.data;
}

export const createCustomer = (data) =>
    http.post("/customers", data);

export const updateCustomer = (id, data) =>
    http.put(`/customers/${id}`, data);

export const deleteCustomer = (id) =>
    http.delete(`/customers/${id}`);

export async function getCustomerDetails(id) {

    const response =
        await http.get(`/customers/${id}/details`);

    return response.data;

};

export async function downloadBulkImportTemplate() {

    const response = await http.get(
        "/customers/bulk-import/template",
        {
            responseType: "blob"
        }
    );

    const blob =
        new Blob(
            [response.data],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "invoiceNgine-Customer-Import-Template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};

export async function previewBulkImport(file) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await http.post(
            "/customers/bulk-import/preview",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};


export async function importBulkCustomers(file) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await http.post(
            "/customers/bulk-import",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
}