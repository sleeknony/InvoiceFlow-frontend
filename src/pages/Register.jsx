//import { useState } from "react";
//import http from "../api/http";

//export default function Register() {
//    const [firstName, setfirstName] = useState("");
//    const [lastName, setlastName] = useState("");
//    const [email, setEmail] = useState("");
//    const [password, setPassword] = useState("");

//    const handleRegister = async () => {
//        try {
//            await http.post("/auth/register", {
//                firstName,
//                lastName,
//                email,
//                password
//            });

//            alert("Registered successfully");
//        } catch {
//            alert("Error registering");
//        }
//    };

//    return (
        
//            <h2>Register</h2>

//            <input placeholder="First Name" onChange={e => setfirstName(e.target.value)} />
//            <input placeholder="Last Name" onChange={e => setlastName(e.target.value)} />
//            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
//            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          
       

//        <div className="auth-wrapper">

//            <div className="auth-container">

//                {/* LEFT SIDE */}
//                <div className="auth-hero">

//                    <div className="auth-badge">
//                        Smart Invoice Management
//                    </div>

//                    <h1 className="auth-title">
//                        Simplify Your
//                        <br />
//                        Business With
//                        <br />
//                        <span>InvoiceFlow</span>
//                    </h1>

//                    <p className="auth-text">
//                        Create invoices, manage customers,
//                        track payments, generate receipts,
//                        and streamline your entire billing
//                        workflow from one powerful dashboard.
//                    </p>

//                    <div className="auth-features">

//                        <div className="auth-feature">
//                            <div className="auth-feature-icon">
//                                ✓
//                            </div>

//                            Smart Invoice Generation
//                        </div>

//                        <div className="auth-feature">
//                            <div className="auth-feature-icon">
//                                ✓
//                            </div>

//                            Customer & Payment Tracking
//                        </div>

//                        <div className="auth-feature">
//                            <div className="auth-feature-icon">
//                                ✓
//                            </div>

//                            Secure Cloud Document Storage
//                        </div>

//                    </div>
//                </div>

//                {/* RIGHT SIDE */}
//                <div className="auth-card">

//                    <h2 className="auth-card-title">
//                        Welcome Back
//                    </h2>

//                    <p className="auth-card-subtitle">
//                        Login to continue to InvoiceFlow
//                    </p>

//                    <form className="auth-form">

//                        <div className="auth-form-group">
//                            <label className="auth-form-label">
//                                Email
//                            </label>

//                            <input
//                                type="email"
//                                className="auth-input"
//                                placeholder="Enter your email"
//                            />
//                        </div>

//                        <div className="auth-form-group">
//                            <label className="auth-form-label">
//                                Password
//                            </label>

//                            <input
//                                type="password"
//                                className="auth-input"
//                                placeholder="Enter your password"
//                            />
//                        </div>
//                          <button className="auth-btn" onClick={handleRegister}>Register</button>

//                    </form>

//                    <div className="auth-footer">
//                        Already have an account?
//                        {" "}
//                        <a href="/login">
//                            Login
//                        </a>
//                    </div>

//                </div>

//            </div>

//        </div>
//    );
//}


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import http from "../api/http";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match");

            return;
        }

        try {

            setLoading(true);

            await http.post("/auth/register", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            navigate("/login");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-hero">

                    <div className="auth-badge">
                        Modern Invoice Automation
                    </div>

                    <h1 className="auth-title">
                        Start Managing
                        <br />
                        Your Business With
                        <br />
                        <span>InvoiceFlow</span>
                    </h1>

                    <p className="auth-text">
                        Join businesses using InvoiceFlow
                        to generate invoices, manage customers,
                        track payments, and streamline billing
                        operations from one secure platform.
                    </p>

                    <div className="auth-features">

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Fast Invoice Creation
                        </div>

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Secure Cloud Access
                        </div>

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Customer & Payment Tracking
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="auth-card">

                    <h2 className="auth-card-title">
                        Create Account
                    </h2>

                    <p className="auth-card-subtitle">
                        Register to start using InvoiceFlow
                    </p>

                    {
                        error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )
                    }

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="row g-3">

                            <div className="col-md-6">

                                <div className="auth-form-group">

                                    <label className="auth-form-label">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        className="auth-input"
                                        placeholder="First name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="auth-form-group">

                                    <label className="auth-form-label">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        className="auth-input"
                                        placeholder="Last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="auth-form-group">

                            <label className="auth-form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="auth-form-group">

                            <label className="auth-form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="auth-form-group">

                            <label className="auth-form-label">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                className="auth-input"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Creating Account..."
                                    : "Create Account"
                            }
                        </button>

                    </form>

                    <div className="auth-footer">

                        Already have an account?

                        {" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}