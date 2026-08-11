import "../Tab.css";

export default function PaymentInstructions({

    form,

    setForm

}) {

    function update(value) {

        setForm({

            ...form,

            paymentInstructions: value

        });

    }

    return (

        <div className="card payment-instructions-card">

            <div className="card-header">

                <h5 className="mb-1">

                    Payment Instructions

                </h5>

                <small className="text-muted">

                    These instructions will appear on invoices and other
                    payment-related documents.

                </small>

            </div>

            <div className="card-body">

                <textarea

                    className="form-control"

                    rows="5"

                    value={form.paymentInstructions || ""}

                    onChange={(e) =>

                        update(e.target.value)

                    }

                    placeholder={`Example:

Kindly make payment within 30 days.

Please use your invoice number as the payment reference.

Thank you for your business.`}

                />

                <div className="payment-instructions-note">

                    <i className="bi bi-info-circle"></i>

                    <span>

                        Customers will see these instructions on every invoice unless you override them for a specific document.

                    </span>

                </div>

            </div>

        </div>

    );

}