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

}