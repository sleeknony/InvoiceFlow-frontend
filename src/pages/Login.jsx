
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import { useMemo, useState } from "react";
import { useAuth } from "../context/useAuth"; 
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    //const handleLogin = async () => {
    //    try {
    //        const res = await http.post("/Auth/login", { email, password });

    //        console.log("LOGIN RESPONSE:", res.data);

    //        login(res.data.token, res.data.user); //  token + user both stored now

    //        navigate("/dashboard");
    //    } catch (err) {
    //        alert("Login failed. Please check your credentials.");
    //    }
    //};

    const handleLogin = async () => {
        try {
            const res = await http.post("/Auth/login", {
                email,
                password
            });

            console.log("LOGIN RESPONSE:", res.data);

            // Store token and user
            login(res.data.token, res.data.user);

            // Return user to the page they were on before session expired
            const redirectTo =
                localStorage.getItem("redirectAfterLogin");

            if (redirectTo) {
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectTo);
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (

        <div className="auth-wrapper">

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-hero">

                    <div className="auth-badge">
                        Smart Invoice Management
                    </div>

                    <h1 className="auth-title">
                        Simplify Your
                        <br />
                        Business With
                        <br />
                        <span>InvoiceFlow</span>
                    </h1>

                    <p className="auth-text">
                        Create invoices, manage customers,
                        track payments, generate receipts,
                        and streamline your entire billing
                        workflow from one powerful dashboard.
                    </p>

                    <div className="auth-features">

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Smart Invoice Generation
                        </div>

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Customer & Payment Tracking
                        </div>

                        <div className="auth-feature">
                            <div className="auth-feature-icon">
                                ✓
                            </div>

                            Secure Cloud Document Storage
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="auth-card">

                    <h2 className="auth-card-title">
                        Welcome Back
                    </h2>

                    <p className="auth-card-subtitle">
                        Login to continue to InvoiceFlow
                    </p>

                    
                    <form
                        className="auth-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <div className="auth-form-group">
                            <label className="auth-form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="auth-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                className="auth-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="auth-btn">
                            Login
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don’t have an account?
                        {" "}
                        <a href="/register">
                            Register
                        </a>
                    </div>

                </div>

            </div>

        </div>
        
    );
}