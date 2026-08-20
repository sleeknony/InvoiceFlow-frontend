import { useEffect, useState } from "react";
import CustomerHeader from "./components/CustomerHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerToolbar from "./components/CustomerToolbar";
import CustomerGrid from "./components/CustomerGrid";
import CustomerModal from "./components/CustomerModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getCustomers, getCustomer, createCustomer, updateCustomer,  deleteCustomer as deleteCustomerApi} from "../../services/customerService";
import { useLocation } from "react-router-dom";

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
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const location = useLocation();
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    useEffect(() => {

        if (location.state?.editCustomerId) {

            handleEditCustomer(
                location.state.editCustomerId
            );
        }

    }, [location.state]);
    // =========================
    // FILTER
    // =========================

    const filteredCustomers = customers.filter(customer => {

        const keyword = search.toLowerCase();

        const matchesSearch =

            customer.companyName?.toLowerCase().includes(keyword) ||

            customer.contactPerson?.toLowerCase().includes(keyword) ||

            customer.email?.toLowerCase().includes(keyword) ||

            customer.phone?.toLowerCase().includes(keyword);

        if (status === "All")
            return matchesSearch;

        if (status === "Active")
            return matchesSearch && !customer.isDeleted;

        return matchesSearch && customer.isDeleted;

    });


    const permissions = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("permissions") || "[]"
            );
        }
        catch {
            return [];
        }
    })();


    const hasPermission = (permissionName) =>
        permissions.some(
            p => p.name === permissionName
        );


    const canCreateCustomer =
          hasPermission("CreateCustomers");

    
   

    // =========================
    // VALIDATION
    // =========================
    const canSave = form.companyName.trim().length > 0;

    // =========================
    // CREATE CUSTOMER
    // =========================
    async function handleSaveCustomer() {

        if (!canSave)
            return;

        try {

            setSaving(true);

            if (editingId) {

                const updated =
                    await updateCustomer(
                        editingId,
                        {
                            ...form,
                            id: editingId
                        });

                setCustomers(customers.map(c =>

                    c.id === editingId

                        ? updated.data

                        : c

                ));

                toast.success("Customer updated");

            }

            else {

                const created =
                    await createCustomer(form);

                setCustomers([
                    created.data,
                    ...customers
                ]);

                toast.success("Customer created");

            }

            setEditingId(null);

            setForm(emptyForm);

        }

        catch {

            toast.error("Unable to save customer");

        }

        finally {

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

    async function handleEditCustomer(id) {

        try {

            const customer =
                await getCustomer(id);

            setEditingId(id);

            setForm(customer);

            setShowModal(true);

        }

        catch {

            toast.error("Failed to load customer");

        }

    }

    // =========================
    // RESET FORM
    // =========================
    function resetForm() {

        setEditingId(null);

        setForm(emptyForm);

    }

    return (
        <div>

            {/* HEADER */}
            <CustomerHeader

                totalCustomers={customers.length}

                canCreateCustomer={canCreateCustomer}

                onBulkImport={() =>
                    navigate("/customers/bulk-import")
                }

                onNewCustomer={() => {

                    setEditingId(null);

                    setForm(emptyForm);

                    setShowModal(true);

                }}

            />

            <CustomerStats
                customers={customers}
            />

            <CustomerToolbar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                onRefresh={loadCustomers}
            />

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                    <h5 className="fw-bold mb-1">

                        Customers

                    </h5>

                    <small className="text-muted">

                        {filteredCustomers.length} customer(s)

                    </small>

                </div>

            </div>

            {
                loading ? (

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            Loading customers...

                        </div>

                    </div>

                ) : (

                        <CustomerGrid

                            customers={filteredCustomers}

                            onOpen={(id) =>

                                navigate(`/customers/${id}`)

                            }

                            onDelete={handleDeleteCustomer}

                            onInvoice={(customer) =>

                                navigate("/documents/create", {
                                    state: {
                                        customerId: customer.id
                                    }
                                })

                            }

                        />

                )
            }

            <CustomerModal

                show={showModal}

                editing={editingId != null}

                form={form}

                setForm={setForm}

                saving={saving}

                onSave={handleSaveCustomer}

                onClose={() => {

                    setShowModal(false);

                    resetForm();

                }}

            />

        </div>
    );
}