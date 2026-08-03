import {FiMail,FiPhone,FiMapPin, FiEdit2, FiTrash2, FiFileText, FiUser} from "react-icons/fi";
import "./CustomerCard.css";

export default function CustomerCard({

    customer,

    onOpen,

    onDelete,

    onInvoice

}){

    return (

        <div
            className="card customer-card border-0 shadow-sm rounded-4 h-100"  role="button" onClick={() => onOpen(customer.id)}>

            <div className="card-body p-4">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-start mb-3">

                    <span className="badge bg-success-subtle text-success border">

                        <span className={`badge ${customer.isDeleted
                                ? "bg-danger-subtle text-danger"
                                : "bg-success-subtle text-success"
                            }`}>
                            {customer.isDeleted ? "Inactive" : "Active"}
                        </span>

                    </span>

                    <small className="text-muted">

                        {customer.customerCode}

                    </small>

                </div>

                {/* Company */}

                <h5 className="fw-bold mb-1">

                    <h5 className="fw-bold mb-1 text-default">
                        {customer.companyName}
                    </h5>

                </h5>

                <div className="text-muted mb-4">

                    <FiUser className="me-2" />

                    {customer.contactPerson || "No Contact Person"}

                </div>

                {/* Contact */}

                <div className="mb-2 small">

                    <FiMail className="me-2 text-primary" />

                    {customer.email || "-"}

                </div>

                <div className="mb-2 small">

                    <FiPhone className="me-2 text-primary" />

                    {customer.phone || "-"}

                </div>

                <div className="small">

                    <FiMapPin className="me-2 text-primary" />

                    {[customer.city, customer.country]
                        .filter(Boolean)
                        .join(", ") || "-"}

                </div>

            </div>

            <div className="card-footer bg-white border-top">

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-primary flex-fill"
                        onClick={(e) => {

                            e.stopPropagation();

                            onOpen(customer.id);

                        }}
                    >

                        Open

                    </button>

                    <button
                        className="btn btn-light"
                        onClick={(e) => {

                            e.stopPropagation();

                            onInvoice(customer);

                        }}
                    >

                        <FiFileText />

                    </button>

                    <button
                        className="btn btn-outline-danger"
                        onClick={(e) => {

                            e.stopPropagation();

                            onDelete(customer.id);

                        }}
                    >

                        <FiTrash2 />

                    </button>

                </div>

            </div>

        </div>

    );

}