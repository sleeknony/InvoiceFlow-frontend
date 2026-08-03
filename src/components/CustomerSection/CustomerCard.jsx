import {FiEdit,FiMail,FiPhone, FiPlus, FiUser} from "react-icons/fi";
import { Link } from "react-router-dom";
import Select from "react-select";

export default function CustomerCard({

    behavior,

    customers,

    customerId,

    onCustomerChange,

    onCreateCustomer,

    onEditCustomer

}) {

    const selectedCustomer =
        customers.find(x => x.id === customerId);

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <div>

                        <h5 className="fw-bold mb-1">

                            {behavior.customerLabel}

                        </h5>

                        <small className="text-muted">

                            Select who this document is for

                        </small>

                    </div>

                    <Link
                        to="/customers"
                        className="text-decoration-none fw-semibold small"
                    >

                        <FiPlus className="me-1" />

                        New Customer

                    </Link>

                </div>

                <Select
                    classNamePrefix="react-select"
                    placeholder={`Search ${behavior.customerLabel}...`}
                    isClearable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                        menuPortal: base => ({
                            ...base,
                            zIndex: 9999
                        })
                    }}
                    options={customers.map(customer => ({
                        value: customer.id,
                        label: customer.companyName
                    }))}
                    value={
                        customers
                            .filter(c => c.id === customerId)
                            .map(c => ({
                                value: c.id,
                                label: c.companyName
                            }))[0] ?? null
                    }
                    onChange={(option) =>
                        onCustomerChange(option?.value ?? "")
                    }
                />

                {

                    selectedCustomer && (

                        <div
                            className="rounded-4 border p-4 bg-light mt-4">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h5 className="mb-1">

                                        {selectedCustomer.companyName}

                                    </h5>

                                    <small className="text-muted">

                                        Customer Information

                                    </small>

                                </div>

                                <button

                                    className="btn btn-outline-secondary btn-sm"

                                    onClick={() =>

                                        onEditCustomer(

                                            selectedCustomer.id

                                        )

                                    }

                                >

                                    <FiEdit className="me-2" />

                                    Edit

                                </button>

                            </div>

                            <hr />

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <div className="text-muted small">

                                        Contact Person

                                    </div>

                                    <div>

                                        <FiUser className="me-2" />

                                        {selectedCustomer.contactPerson || "-"}

                                    </div>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <div className="text-muted small">

                                        Email

                                    </div>

                                    <div>

                                        <FiMail className="me-2" />

                                        {selectedCustomer.email || "-"}

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="text-muted small">

                                        Phone

                                    </div>

                                    <div>

                                        <FiPhone className="me-2" />

                                        {selectedCustomer.phone || "-"}

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <div className="text-muted small">

                                        Address

                                    </div>

                                    <div>

                                        {selectedCustomer.address || "-"}

                                    </div>

                                </div>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}