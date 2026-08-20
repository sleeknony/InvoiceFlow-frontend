import {
    FiPlus,
    FiUpload
} from "react-icons/fi";

export default function CustomerHeader({
    totalCustomers,
    canCreateCustomer,
    onNewCustomer,
    onBulkImport
}) {

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Customers
                        </h2>

                        <p className="text-muted mb-0">
                            Manage your customers and billing profiles
                        </p>

                    </div>


                    {canCreateCustomer && (

                        <div className="d-flex align-items-center gap-2">

                            {/* BULK IMPORT */}

                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={onBulkImport}
                            >

                                <FiUpload className="me-2" />

                                Bulk Import

                            </button>


                            {/* NEW CUSTOMER */}

                            <button
                                type="button"
                                className="btn btn-primary rounded-pill px-4"
                                onClick={onNewCustomer}
                            >

                                <FiPlus className="me-2" />

                                New Customer

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}