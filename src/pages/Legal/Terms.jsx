import { useNavigate } from "react-router-dom";
import "./Legal.css";

export default function Terms() {

    const navigate = useNavigate();

    return (
        <div className="legal-page">

            <div className="legal-container">

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
                        Terms & Conditions
                    </h1>

                    <p className="legal-effective-date">
                        Effective September 1, 2026
                    </p>

                </div>


                <div className="legal-content">

                    <h2>1. About invoiceNgine</h2>

                    <p>
                        invoiceNgine is a business invoicing and document
                        management platform that enables users to create,
                        manage, send and track business documents and related
                        information.
                    </p>


                    <h2>2. Acceptance of Terms</h2>

                    <p>
                        By creating an account or using invoiceNgine, you
                        agree to be bound by these Terms & Conditions. If you
                        do not agree with these terms, you should not use the
                        service.
                    </p>


                    <h2>3. Account Registration</h2>

                    <p>
                        You are responsible for providing accurate information
                        when creating an invoiceNgine account and for keeping
                        your account credentials secure.
                    </p>

                    <p>
                        You are responsible for activities carried out through
                        your account and should promptly notify invoiceNgine
                        if you believe your account has been accessed without
                        authorisation.
                    </p>


                    <h2>4. Use of the Service</h2>

                    <p>
                        You agree to use invoiceNgine only for lawful business
                        purposes and in accordance with these Terms &
                        Conditions.
                    </p>


                    <h2>5. Customer and Business Data</h2>

                    <p>
                        You remain responsible for the information and
                        documents you enter into invoiceNgine, including
                        ensuring that you have the necessary rights,
                        permissions and lawful basis to process such
                        information.
                    </p>


                    <h2>6. Subscription Plans</h2>

                    <p>
                        invoiceNgine may offer different subscription plans
                        with different features, limits and pricing.
                    </p>

                    <p>
                        Features and usage limits applicable to your account
                        are determined by the subscription plan associated
                        with your company or account.
                    </p>


                    <h2>7. Payments</h2>

                    <p>
                        Paid subscriptions are processed through the payment
                        provider made available by invoiceNgine. You agree to
                        provide accurate billing information and authorise the
                        applicable subscription charges.
                    </p>


                    <h2>8. Intellectual Property</h2>

                    <p>
                        The invoiceNgine software, interface, branding,
                        designs and related materials remain the property of
                        invoiceNgine or its respective licensors, except for
                        content supplied by users.
                    </p>


                    <h2>9. Service Availability</h2>

                    <p>
                        We aim to keep invoiceNgine available and reliable,
                        but we do not guarantee uninterrupted or error-free
                        availability of the service.
                    </p>


                    <h2>10. Prohibited Use</h2>

                    <p>
                        You must not use invoiceNgine to engage in unlawful
                        activities, attempt to compromise the security of the
                        service, interfere with other users or gain
                        unauthorised access to systems or information.
                    </p>


                    <h2>11. Suspension or Termination</h2>

                    <p>
                        We may suspend or terminate access to invoiceNgine
                        where reasonably necessary to protect the service,
                        comply with applicable law, address misuse or enforce
                        these Terms & Conditions.
                    </p>


                    <h2>12. Limitation of Liability</h2>

                    <p>
                        To the extent permitted by applicable law, invoiceNgine
                        will not be responsible for indirect, incidental,
                        special or consequential losses arising from the use
                        of the service.
                    </p>


                    <h2>13. Changes to These Terms</h2>

                    <p>
                        We may update these Terms & Conditions from time to
                        time. Changes will be published on this page with an
                        updated effective date.
                    </p>


                    <h2>14. Contact</h2>

                    <p>
                        If you have questions regarding these Terms &
                        Conditions, please contact the invoiceNgine support
                        team.
                    </p>

                </div>


                <div className="legal-footer">

                    <span>&#169;</span> {new Date().getFullYear()} invoiceNgine.
                    All rights reserved.

                </div>

            </div>

        </div>
    );
}

