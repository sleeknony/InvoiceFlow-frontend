import { useNavigate } from "react-router-dom";
import "./Legal.css";

export default function Privacy() {

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
                        Privacy Policy
                    </h1>

                    <p className="legal-effective-date">
                        Effective September 1, 2026
                    </p>

                </div>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="legal-content">

                    <h2>1. Introduction</h2>

                    <p>
                        This Privacy Policy explains how invoiceNgine
                        collects, uses and protects information associated
                        with your use of the service.
                    </p>


                    <h2>2. Information We Collect</h2>

                    <p>
                        Depending on how you use invoiceNgine, we may collect
                        information such as your name, email address,
                        company information, account information, customer
                        information and documents created through the
                        platform.
                    </p>


                    <h2>3. How We Use Information</h2>

                    <p>
                        Information may be used to provide and operate
                        invoiceNgine, authenticate users, process
                        subscriptions, provide customer support, maintain
                        security, improve the service and communicate
                        important service-related information.
                    </p>


                    <h2>4. Business and Customer Data</h2>

                    <p>
                        Information entered into invoiceNgine may contain
                        business and customer information. You are
                        responsible for ensuring that you have an appropriate
                        legal basis and necessary permissions to provide such
                        information to the platform.
                    </p>


                    <h2>5. Payment Information</h2>

                    <p>
                        Payments for subscriptions are processed through our
                        payment provider. Payment information may therefore
                        be handled by the payment provider in accordance
                        with its own privacy policy and security practices.
                    </p>


                    <h2>6. Security</h2>

                    <p>
                        We use reasonable technical and organisational
                        measures designed to protect information against
                        unauthorised access, alteration, disclosure or
                        destruction.
                    </p>

                    <p>
                        However, no internet-based service can guarantee
                        absolute security.
                    </p>


                    <h2>7. Data Retention</h2>

                    <p>
                        Information may be retained for as long as reasonably
                        necessary to provide the service, meet legal or
                        regulatory obligations, resolve disputes and enforce
                        applicable agreements.
                    </p>


                    <h2>8. Third-Party Services</h2>

                    <p>
                        invoiceNgine may rely on third-party service
                        providers for functions such as payment processing,
                        hosting, communications, analytics and infrastructure.
                        These providers may process information only as
                        necessary to provide their services.
                    </p>


                    <h2>9. Your Rights</h2>

                    <p>
                        Depending on applicable law, you may have rights
                        relating to access, correction, deletion, restriction
                        or other processing of your personal information.
                    </p>


                    <h2>10. Cookies and Similar Technologies</h2>

                    <p>
                        invoiceNgine may use cookies or similar technologies
                        where necessary for authentication, security,
                        functionality and service improvement.
                    </p>


                    <h2>11. Changes to This Privacy Policy</h2>

                    <p>
                        We may update this Privacy Policy from time to time.
                        Any changes will be published on this page with an
                        updated effective date.
                    </p>


                    <h2>12. Contact</h2>

                    <p>
                        If you have questions about this Privacy Policy or
                        how your information is handled, please contact the
                        invoiceNgine support team.
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

