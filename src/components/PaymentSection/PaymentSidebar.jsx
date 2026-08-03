import {
    FiCreditCard,
    FiHash,
    FiHome
} from "react-icons/fi";

export default function PaymentSidebar({

    settings

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4">

                <h5 className="fw-bold mb-4">

                    Payment Information

                </h5>

                <div className="mb-4">

                    <div className="text-muted small">

                        <FiHome className="me-2" />

                        Bank

                    </div>

                    <div className="fw-semibold">

                        {settings.bankName || "-"}

                    </div>

                </div>

                <div className="mb-4">

                    <div className="text-muted small">

                        Account Name

                    </div>

                    <div className="fw-semibold">

                        {settings.accountName || "-"}

                    </div>

                </div>

                <div className="mb-4">

                    <div className="text-muted small">

                        <FiHash className="me-2" />

                        Account Number

                    </div>

                    <div className="fw-semibold">

                        {settings.accountNumber || "-"}

                    </div>

                </div>

                {

                    settings.paymentInstructions && (

                        <div
                            className="alert alert-light border rounded-4 mb-0">

                            <div className="fw-semibold mb-2">

                                <FiCreditCard className="me-2" />

                                Payment Instructions

                            </div>

                            <small>

                                {

                                    settings.paymentInstructions

                                }

                            </small>

                        </div>

                    )

                }

            </div>

        </div>

    );

}