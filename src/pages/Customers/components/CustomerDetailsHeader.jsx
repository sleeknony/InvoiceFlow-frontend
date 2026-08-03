import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

export default function CustomerDetailsHeader({

    customer,

    onBack,

    onEdit

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <button
                            className="btn btn-link text-decoration-none p-0 mb-3"
                            onClick={onBack}
                        >

                            <FiArrowLeft className="me-2" />

                            Customers

                        </button>

                        <h2 className="fw-bold mb-1">

                            {customer.companyName}

                        </h2>

                        <div className="text-muted">

                            Customer Code

                            <span className="ms-2 fw-semibold">

                                {customer.customerCode}

                            </span>

                        </div>

                    </div>

                    <button
                        className="btn btn-primary rounded-pill px-4"
                        onClick={onEdit}
                    >

                        <FiEdit2 className="me-2" />

                        Edit Customer

                    </button>

                </div>

            </div>

        </div>

    );

}