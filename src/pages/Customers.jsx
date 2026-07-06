import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import toast from "react-hot-toast";

import {
    getCustomers,
    createCustomer,
    deleteCustomer as deleteCustomerApi
} from "../services/customerService";

const emptyForm = {
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    taxNumber: "",
    notes: ""
};

export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

    // =========================
    // LOAD CUSTOMERS
    // =========================
    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            setLoading(true);
            const res = await getCustomers();
            setCustomers(res.data);
        } catch (err) {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // FILTER
    // =========================
    const filteredCustomers = useMemo(() => {
        if (!search) return customers;

        return customers.filter(c =>
            (c.companyName || "")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [customers, search]);

    // =========================
    // VALIDATION
    // =========================
    const canSave = form.companyName.trim().length > 0;

    // =========================
    // CREATE CUSTOMER
    // =========================
    async function handleAddCustomer() {
        if (!canSave) return;

        try {
            setSaving(true);

            const res = await createCustomer(form);

            setCustomers([res.data, ...customers]);
            setForm(emptyForm);

            toast.success("Customer created successfully");
        } catch (err) {
            toast.error("Failed to create customer");
        } finally {
            setSaving(false);
        }
    }

    // =========================
    // DELETE CUSTOMER
    // =========================
    async function handleDeleteCustomer(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) return;

        try {
            await deleteCustomerApi(id);

            setCustomers(customers.filter(c => c.id !== id));

            toast.success("Customer deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    }

    // =========================
    // RESET FORM
    // =========================
    function resetForm() {
        setForm(emptyForm);
    }

    return (
        <div>

            {/* HEADER */}
            <PageHeader
                title="Customers"
                subtitle="Manage all customers for invoices, quotes and receipts"
            />

            <div className="row">

                {/* FORM */}
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">

                        <div className="card-header bg-white">
                            <h5 className="mb-0">New Customer</h5>
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">Company Name *</label>
                                    <input
                                        className="form-control"
                                        value={form.companyName}
                                        onChange={(e) =>
                                            setForm({ ...form, companyName: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Contact Person</label>
                                    <input
                                        className="form-control"
                                        value={form.contactPerson}
                                        onChange={(e) =>
                                            setForm({ ...form, contactPerson: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        className="form-control"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Phone</label>
                                    <input
                                        className="form-control"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">City</label>
                                    <input
                                        className="form-control"
                                        value={form.city}
                                        onChange={(e) =>
                                            setForm({ ...form, city: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">State</label>
                                    <input
                                        className="form-control"
                                        value={form.state}
                                        onChange={(e) =>
                                            setForm({ ...form, state: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Country</label>
                                    <input
                                        className="form-control"
                                        value={form.country}
                                        onChange={(e) =>
                                            setForm({ ...form, country: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Tax Number</label>
                                    <input
                                        className="form-control"
                                        value={form.taxNumber}
                                        onChange={(e) =>
                                            setForm({ ...form, taxNumber: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={form.address}
                                        onChange={(e) =>
                                            setForm({ ...form, address: e.target.value })}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={form.notes}
                                        onChange={(e) =>
                                            setForm({ ...form, notes: e.target.value })}
                                    />
                                </div>

                                <div className="col-12 d-flex justify-content-end gap-2">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        disabled={!canSave || saving}
                                        onClick={handleAddCustomer}
                                    >
                                        {saving ? "Saving..." : "Add Customer"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* SIDE PANEL */}
                <div className="col-lg-4">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h2>{customers.length}</h2>
                            <p className="text-muted">Total Customers</p>

                            <input
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* TABLE */}
            <div className="card shadow-sm border-0 mt-4">

                <div className="card-header bg-white">
                    <h5 className="mb-0">Customer List</h5>
                </div>

                <div className="table-responsive">

                    <table className="table table-hover">

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.companyName}</td>
                                        <td>{c.contactPerson}</td>
                                        <td>{c.email}</td>
                                        <td>{c.phone}</td>
                                        <td>{c.city}, {c.country}</td>

                                        <td className="d-flex gap-2">

                                            <button className="btn btn-sm btn-outline-primary">
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteCustomer(c.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}