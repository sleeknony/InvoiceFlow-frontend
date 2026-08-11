
import { useNavigate } from "react-router-dom";
import http from "../../api/http";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth"; 
import toast from "react-hot-toast";
import companyTeamService from "../../services/companyTeamService";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    const handleLogin = async () => {

        try {

            const res = await http.post("/Auth/login", {

                email,

                password

            });

            login(
                res.data.token,
                res.data.user
            );

            localStorage.setItem(
                "permissions",
                JSON.stringify(
                    res.data.permissions || []
                )
            );

            localStorage.setItem(
                "companyRole",
                res.data.companyRole || ""
            );
            const pendingInvitationToken =
                localStorage.getItem(
                    "pendingInvitationToken"
                );

            if (pendingInvitationToken) {

                try {

                    await companyTeamService
                        .acceptInvitation(
                            pendingInvitationToken
                        );

                    localStorage.removeItem(
                        "pendingInvitationToken"
                    );

                    toast.success(
                        "Invitation accepted successfully."
                    );

                }
                catch (error) {

                   /* console.error(error);*/

                    toast.error(
                        error?.response?.data?.message ||
                        "Unable to accept invitation."
                    );

                }

            }
            const redirectTo =
                localStorage.getItem("redirectAfterLogin");

            if (redirectTo) {

                localStorage.removeItem(
                    "redirectAfterLogin"
                );

                navigate(redirectTo);

                return;

            }

            if (res.data.onboardingCompleted) {

                navigate("/dashboard");

            }
            else {

                navigate("/setup-company");

            }

        }
        catch (err) {

            console.error(err);

            toast.error(
                "Login failed. Please check your credentials."
            );

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

                            <div className="password-input-wrapper">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {
                                        showPassword
                                            ? <FiEyeOff />
                                            : <FiEye />
                                    }
                                </button>

                            </div>

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