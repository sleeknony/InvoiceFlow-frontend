import "./Tab.css";

export default function PaymentTab({ form, setForm }) {

    function update(field, value) {
        setForm({
            ...form,
            [field]: value
        });
    }

    return (
        <>
            <h4 className="tab-title">
                Payment Information
            </h4>

            <p className="tab-subtitle">
                Configure the payment details that appear on your documents.
            </p>

            <div className="card mb-4">
                <div className="card-body">

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Bank Name</label>

                            <input
                                className="form-control"
                                value={form.bankName || ""}
                                onChange={(e) =>
                                    update("bankName", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Account Name</label>

                            <input
                                className="form-control"
                                value={form.accountName || ""}
                                onChange={(e) =>
                                    update("accountName", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Account Number</label>

                            <input
                                className="form-control"
                                value={form.accountNumber || ""}
                                onChange={(e) =>
                                    update("accountNumber", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Bank Sort Code</label>

                            <input
                                className="form-control"
                                value={form.sortCode || ""}
                                onChange={(e) =>
                                    update("sortCode", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>SWIFT Code</label>

                            <input
                                className="form-control"
                                value={form.swiftCode || ""}
                                onChange={(e) =>
                                    update("swiftCode", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>IBAN</label>

                            <input
                                className="form-control"
                                value={form.iban || ""}
                                onChange={(e) =>
                                    update("iban", e.target.value)
                                }
                            />
                        </div>

                        <div className="form-group full-width">

                            <label>
                                Payment Instructions
                            </label>

                            <textarea
                                rows="5"
                                className="form-control"
                                value={form.paymentInstructions || ""}
                                onChange={(e) =>
                                    update("paymentInstructions", e.target.value)
                                }
                                placeholder="e.g. Kindly make payment within 30 days..."
                            />

                        </div>

                    </div>

                </div>
            </div>

            <div className="card border-warning">

                <div className="card-body">

                    <h6>Premium Features</h6>

                    <div className="premium-grid">

                        <div className="premium-item">
                            🔒 QR Payment Code
                        </div>

                        <div className="premium-item">
                            🔒 Stripe Integration
                        </div>

                        <div className="premium-item">
                            🔒 Paystack Integration
                        </div>

                        <div className="premium-item">
                            🔒 Flutterwave Integration
                        </div>

                        <div className="premium-item">
                            🔒 PayPal
                        </div>

                        <div className="premium-item">
                            🔒 Multiple Bank Accounts
                        </div>

                    </div>

                </div>

            </div>

        </>
    );

}