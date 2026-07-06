import "./PaymentSection.css";

export default function PaymentSection({
    document,
    settings,
    config
}) {

    if (!config.features.showPaymentInstructions)
        return null;

    return (

        <section className="payment-section">

            <h4 className="payment-title">
                Payment Information
            </h4>

            <div className="payment-grid">

                <div className="payment-details">

                    {settings?.bankName && (

                        <div className="payment-row">

                            <span className="payment-label">
                                Bank
                            </span>

                            <span className="payment-value">
                                {settings.bankName}
                            </span>

                        </div>

                    )}

                    {settings?.accountName && (

                        <div className="payment-row">

                            <span className="payment-label">
                                Account Name
                            </span>

                            <span className="payment-value">
                                {settings.accountName}
                            </span>

                        </div>

                    )}

                    {settings?.accountNumber && (

                        <div className="payment-row">

                            <span className="payment-label">
                                Account Number
                            </span>

                            <span className="payment-value">
                                {settings.accountNumber}
                            </span>

                        </div>

                    )}

                    {settings?.swiftCode && (

                        <div className="payment-row">

                            <span className="payment-label">
                                SWIFT
                            </span>

                            <span className="payment-value">
                                {settings.swiftCode}
                            </span>

                        </div>

                    )}

                </div>

                {settings?.paymentInstructions && (

                    <div className="payment-notes">

                        <h5>

                            Payment Instructions

                        </h5>

                        <p>

                            {settings.paymentInstructions}

                        </p>

                    </div>

                )}

            </div>

        </section>

    );

}