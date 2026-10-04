import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import http from "../../api/http";
import companyTeamService from "../../services/companyTeamService";

export default function InvitationRegister() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [loadingInvitation, setLoadingInvitation] =
        useState(true);

    const [error, setError] = useState("");

    const [companyName, setCompanyName] =
        useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword,
        setShowConfirmPassword] =
        useState(false);

    useEffect(() => {

        loadInvitation();

    }, []);

    const loadInvitation = async () => {

        try {

            const invitation =
                await companyTeamService
                    .getInvitationByToken(token);

            setCompanyName(
                invitation.companyName
            );

            setFormData(prev => ({
                ...prev,
                email: invitation.email
            }));

        }
        catch (err) {

            setError(
                err?.response?.data?.message ||
                "Invitation is invalid."
            );

        }
        finally {

            setLoadingInvitation(false);

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        const password =
            formData.password;

        if (
            password !==
            formData.confirmPassword
        ) {
            setError(
                "Password and Confirm Password must match."
            );

            return;
        }

        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters long."
            );

            return;
        }

        if (!/[A-Z]/.test(password)) {

            setError(
                "Password must contain at least one uppercase letter."
            );

            return;
        }

        if (!/[0-9]/.test(password)) {

            setError(
                "Password must contain at least one number."
            );

            return;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {

            setError(
                "Password must contain at least one special character."
            );

            return;
        }

        try {

            setLoading(true);

            await http.post(
                "/auth/register",
                {
                    firstName:
                        formData.firstName,

                    lastName:
                        formData.lastName,

                    email:
                        formData.email,

                    password:
                        formData.password
                });

            localStorage.setItem(
                "pendingInvitationToken",
                token
            );

            localStorage.setItem(
                "verificationEmail",
                formData.email
            );

            navigate(
                "/verify-email",
                {
                    state: {
                        email:
                            formData.email
                    }
                });

        }
        catch (err) {

            setError(
                err?.response?.data?.message ||
                "Registration failed."
            );

        }
        finally {

            setLoading(false);

        }

    };

    const passwordChecks = {

        length:
            formData.password.length >= 6,

        uppercase:
            /[A-Z]/.test(
                formData.password
            ),

        number:
            /\d/.test(
                formData.password
            ),

        special:
            /[^A-Za-z0-9]/.test(
                formData.password
            )

    };

    if (loadingInvitation) {

        return (
            <div className="auth-wrapper">
                <div className="auth-container">
                    Loading invitation...
                </div>
            </div>
        );

    }

    return (

        <div className="auth-wrapper">

            <div className="auth-container">

                <div className="auth-hero">

                    <div className="auth-badge">
                        Company Invitation
                    </div>

                    <h1 className="auth-title">

                        Join
                        <br />

                        <span>
                            {companyName}
                        </span>

                    </h1>

                    <p className="auth-text">

                        You have been invited
                        to join this company
                        on invoiceNgine.

                    </p>

                </div>

                <div className="auth-card">

                    <h2 className="auth-card-title">
                        Create Your Account
                    </h2>

                    <p className="auth-card-subtitle">
                        Complete registration
                        to accept the invitation
                    </p>

                    {
                        error &&
                        (
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
                                className="auth-input"
                                value={formData.email}
                                readOnly
                            />

                        </div>

                        <div className="auth-form-group">

                            <label className="auth-form-label">
                                Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    className="auth-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {
                                        showPassword
                                            ? <FiEyeOff />
                                            : <FiEye />
                                    }
                                </button>

                            </div>

                            <div className="password-rules">

                                <div className={passwordChecks.length ? "rule valid" : "rule"}>
                                    {passwordChecks.length ? "✓" : "○"}
                                    <span>At least 6 characters</span>
                                </div>

                                <div className={passwordChecks.uppercase ? "rule valid" : "rule"}>
                                    {passwordChecks.uppercase ? "✓" : "○"}
                                    <span>One uppercase letter</span>
                                </div>

                                <div className={passwordChecks.number ? "rule valid" : "rule"}>
                                    {passwordChecks.number ? "✓" : "○"}
                                    <span>One number</span>
                                </div>

                                <div className={passwordChecks.special ? "rule valid" : "rule"}>
                                    {passwordChecks.special ? "✓" : "○"}
                                    <span>One special character</span>
                                </div>

                            </div>

                        </div>

                        <div className="auth-form-group">

                            <label className="auth-form-label">
                                Confirm Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    className="auth-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {
                                        showConfirmPassword
                                            ? <FiEyeOff />
                                            : <FiEye />
                                    }
                                </button>

                            </div>

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