import http from "../api/http";

export const getCustomers = () =>
    http.get("/customers");

export const createCustomer = (data) =>
    http.post("/customers", data);

export const updateCustomer = (id, data) =>
    http.put(`/customers/${id}`, data);

export const deleteCustomer = (id) =>
    http.delete(`/customers/${id}`);