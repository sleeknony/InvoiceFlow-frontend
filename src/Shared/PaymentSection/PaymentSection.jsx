import "./PaymentSection.css";
import PrintableSection from "../../renderer/PrintableSection";
import { useRenderDocument} from "../../renderer/RenderContext";
import { useDocument } from "../../renderer/RenderContext";

export default function PaymentSection() {

    const {

        payment,

        features

    } = useDocument();

    if (!features.showPaymentInstructions)
        return null;

    if (!payment.bank)
        return null;

    const {

        name,

        accountName,

        accountNumber,

        sortCode,

        swiftCode,

        iban,

        instructions

    } = payment.bank;

    const hasBankInfo =

        name ||
        accountName ||
        accountNumber ||
        sortCode ||
        swiftCode ||
        iban ||
        instructions;

    if (!hasBankInfo)
        return null;
    
    return (

        <PrintableSection type="payment">

            <h4 className="payment-title">

                Payment Information

            </h4>

            <div
                className={`payment-grid${instructions ? " has-notes" : ""}`}
            >

                <div className="payment-details">

                    {name && (

                        <div className="payment-row">

                            <span className="payment-label">

                                Bank

                            </span>

                            <span className="payment-value">

                                {name}

                            </span>

                        </div>

                    )}

                    {accountName && (

                        <div className="payment-row">

                            <span className="payment-label">

                                Account Name

                            </span>

                            <span className="payment-value">

                                {accountName}

                            </span>

                        </div>

                    )}

                    {accountNumber && (

                        <div className="payment-row">

                            <span className="payment-label">

                                Account No.

                            </span>

                            <span className="payment-value">

                                {accountNumber}

                            </span>

                        </div>

                    )}

                    {sortCode && (

                        <div className="payment-row">

                            <span className="payment-label">

                                Sort Code

                            </span>

                            <span className="payment-value">

                                {sortCode}

                            </span>

                        </div>

                    )}

                    {swiftCode && (

                        <div className="payment-row">

                            <span className="payment-label">

                                SWIFT Code

                            </span>

                            <span className="payment-value">

                                {swiftCode}

                            </span>

                        </div>

                    )}

                    {iban && (

                        <div className="payment-row">

                            <span className="payment-label">

                                IBAN

                            </span>

                            <span className="payment-value">

                                {iban}

                            </span>

                        </div>

                    )}

                </div>

                {instructions && (

                    <div className="payment-notes">

                        <h5>

                             Instructions

                        </h5>

                        <p>

                            {instructions}

                        </p>

                    </div>

                )}

            </div>

        </PrintableSection>

    );

}