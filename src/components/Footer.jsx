import { Link } from "react-router-dom";
import "./Footer.css";
import { FaCopyright } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="app-footer-inner">

                <div className="app-footer-brand">
                    <span className="app-footer-logo">
                        
                    </span>

                    <span className="app-footer-copy">
                        <span>&#169;</span> {currentYear} invoiceNgine. All rights reserved.
                    </span>
                </div>

                <nav
                    className="app-footer-links"
                    aria-label="Legal and information"
                >
                    <Link to="/pricing">
                        Pricing
                    </Link>

                    <Link to="/terms">
                        Terms & Conditions
                    </Link>

                    <Link to="/privacy">
                        Privacy Policy
                    </Link>

                    <Link to="/cancellation-refund">
                        Cancellation & Refund Policy
                    </Link>
                </nav>

            </div>
        </footer>
    );
}