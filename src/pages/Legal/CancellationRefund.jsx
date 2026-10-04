import { useNavigate } from "react-router-dom";
import "./Legal.css";

export default function CancellationRefund() {

    const navigate = useNavigate();

    return (
        <div className="legal-page">

            <div className="legal-container">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="legal-header">

                    <button
                        type="button"
                        className="legal-back"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left" />
                        Back
                    </button>

                    <span className="legal-eyebrow">
                        LEGAL
                    </span>

                    <h1 className="legal-title">
                        Cancellation & Refund Policy
                    </h1>

                    <p className="legal-effective-date">
                        Effective September 1, 2026
                    </p>

                </div>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="legal-content">

                    <h2>1. Subscription Cancellation</h2>

                    <p>
                        You may request cancellation of your paid
                        invoiceNgine subscription through the available
                        subscription-management options or by contacting
                        invoiceNgine support.
                    </p>


                    <h2>2. Effect of Cancellation</h2>

                    <p>
                        Cancellation stops the applicable subscription from
                        renewing for the next billing period. Unless
                        otherwise required by applicable law or expressly
                        stated at the time of purchase, cancellation does not
                        automatically create a refund for the current billing
                        period.
                    </p>


                    <h2>3. Refund Requests</h2>

                    <p>
                        Refund requests are considered on a case-by-case
                        basis and may depend on the circumstances of the
                        request, the subscription plan, the timing of the
                        request and applicable law.
                    </p>


                    <h2>4. Duplicate or Incorrect Charges</h2>

                    <p>
                        If you believe that you have been charged more than
                        once for the same subscription or that a charge was
                        made incorrectly, please contact support with the
                        relevant transaction details so that the transaction
                        can be investigated.
                    </p>


                    <h2>5. Service Problems</h2>

                    <p>
                        If you experience a significant technical problem
                        that prevents you from using a paid feature, please
                        contact support promptly so that we can investigate
                        and attempt to resolve the issue.
                    </p>


                    <h2>6. Promotional Offers</h2>

                    <p>
                        Promotional pricing, discounts or special offers may
                        have additional terms. Where applicable, those terms
                        will be communicated at the time the offer is made.
                    </p>


                    <h2>7. Refund Processing</h2>

                    <p>
                        Where a refund is approved, the refund will normally
                        be processed through the original payment method,
                        subject to the processing procedures of the relevant
                        payment provider.
                    </p>


                    <h2>8. Contact</h2>

                    <p>
                        To request cancellation or discuss a refund, please
                        contact the invoiceNgine support team.
                    </p>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="legal-footer">

                    <span>&#169;</span> {new Date().getFullYear()} invoiceNgine.
                    All rights reserved.

                </div>

            </div>

        </div>
    );
}

