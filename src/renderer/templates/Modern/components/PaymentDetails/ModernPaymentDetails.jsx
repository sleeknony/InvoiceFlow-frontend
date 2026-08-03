import "./ModernPaymentDetails.css";

import { useDocument } from "../../../../RenderContext";

import formatCurrency from "../../../../../utils/currency";

export default function ModernPaymentDetails() {

    const {

        payment,
        totals

    } = useDocument();

    const bank = payment.bank ?? {};

    const currency = totals.currency ?? "NGN";

    const hasBankDetails =

        bank.bankName ||
        bank.accountName ||
        bank.accountNumber ||
        bank.sortCode ||
        bank.swiftCode ||
        bank.iban;

    const hasPaymentHistory =

        payment.history.length > 0;

    if (!hasBankDetails && !hasPaymentHistory) {

        return null;

    }

    return (

        <section className="modern-payment-details">
            <div className="payment-card">

                <div className="payment-title">Payment Details</div>

                <div className="payment-grid">

                    {bank.name && (
                        <div>
                            <span>Bank:</span>
                            <strong>{bank.name}</strong>
                        </div>
                    )}

                    {bank.accountName && (
                        <div>
                            <span>Account name:</span>
                            <strong>{bank.accountName}</strong>
                        </div>
                    )}

                    {bank.accountNumber && (
                        <div>
                            <span>Account no.:</span>
                            <strong>{bank.accountNumber}</strong>
                        </div>
                    )}

                    {bank.sortCode && (
                        <div>
                            <span>Sort code:</span>
                            <strong>{bank.sortCode}</strong>
                        </div>
                    )}

                </div>
            </div>
        </section>

    );

}