import { useNavigate } from "react-router-dom";
import {

    FiFileText,

    FiShoppingCart,

    FiCreditCard,

    FiDollarSign

} from "react-icons/fi";

export default function CustomerDetailsQuickActions({

    customerId,
    canCreateInvoice

}) {
    const navigate = useNavigate();


    return (

        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body">

                <h5 className="fw-bold mb-4">

                    Quick Actions

                </h5>

                <div className="d-grid gap-3">

                    {canCreateInvoice && (
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/documents/create", {
                                    state: {
                                        customerId,
                                        type: "Invoice"
                                    }
                                })
                            }
                        >
                            <FiFileText className="me-2" />
                            Create Invoice
                        </button>
                    )}

                    {/*<button*/}
                    {/*    className="btn btn-outline-primary"*/}
                    {/*    onClick={() =>*/}
                    {/*        navigate("/documents/create", {*/}
                    {/*            state: {*/}
                    {/*                customerId,*/}
                    {/*                documentType: "Quote"*/}
                    {/*            }*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*>*/}

                    {/*    <FiShoppingCart className="me-2" />*/}

                    {/*    Create Quote*/}

                    {/*</button>*/}

                    <button
                        className="btn btn-outline-primary"
                        disabled
                    >

                        <FiCreditCard className="me-2" />

                        Record Payment

                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        disabled
                    >

                        <FiDollarSign className="me-2" />

                        Customer Statement

                    </button>

                </div>

            </div>

        </div>

    );

}