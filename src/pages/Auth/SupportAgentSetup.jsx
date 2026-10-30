
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiCheckCircle, FiLock, FiMail } from "react-icons/fi";

import http from "../../api/http";
import "./SupportAgentSetup.css";

function getErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        return Object.values(data.errors).flat().join("\n");
    }

    return error?.message || "Unable to complete account setup. Please try again.";
}

export default function SupportAgentSetup() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const invitationValid = Boolean(email.trim() && token.trim());

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!invitationValid) {
            await Swal.fire({
                icon: "error",
                title: "Invalid invitation",
                text: "The invitation link is incomplete. Please use the latest invitation email or contact your administrator."
            });
            return;
        }

        if (password.length < 12) {
            await Swal.fire({
                icon: "warning",
                title: "Password too short",
                text: "Your password must contain at least 12 characters."
            });
            return;
        }

        if (password !== confirmPassword) {
            await Swal.fire({
                icon: "warning",
                title: "Passwords do not match",
                text: "Enter the same password in both fields."
            });
            return;
        }

        setSubmitting(true);

        try {
            await http.post(
                "/superadmin/support/agents/complete-setup",
                {
                    email: email.trim(),
                    token,
                    password,
                    confirmPassword
                }
            );

            setPassword("");
            setConfirmPassword("");

            await Swal.fire({
                icon: "success",
                title: "Account setup complete",
                text: "Your Support Agent account is ready. You can now sign in.",
                confirmButtonText: "Go to login"
            });

            navigate("/login", { replace: true });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Setup unsuccessful",
                text: getErrorMessage(error)
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="support-agent-setup-page">
            <section className="support-agent-setup-card">
                <div className="support-agent-setup-brand">
                    <div className="support-agent-setup-logo">
                        <FiCheckCircle />
                    </div>

                    <div>
                        <span className="support-agent-setup-brand-name">
                            invoiceNgine
                        </span>
                        <span className="support-agent-setup-brand-caption">
                            Support Team
                        </span>
                    </div>
                </div>

                <div className="support-agent-setup-heading">
                    <span className="support-agent-setup-eyebrow">
                        ACCOUNT INVITATION
                    </span>

                    <h1>Set up your account</h1>

                    <p>
                        Welcome to the InvoiceNgine Support Team.
                        Create a password to complete your account setup.
                    </p>
                </div>

                {!invitationValid ? (
                    <div className="support-agent-setup-invalid" role="alert">
                        <strong>Invitation link is invalid or incomplete.</strong>
                        <p>
                            Open the complete link from your invitation email.
                            If the link has expired or no longer works, ask
                            your Super Admin to resend the invitation.
                        </p>

                        <Link to="/login">
                            Return to login
                        </Link>
                    </div>
                ) : (
                    <form
                        className="support-agent-setup-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="support-agent-setup-email">
                            <FiMail />

                            <div>
                                <span>Invited email address</span>
                                <strong>{email}</strong>
                            </div>
                        </div>

                        <div className="support-agent-setup-field">
                            <label htmlFor="support-agent-password">
                                Create password
                            </label>

                            <div className="support-agent-setup-password-input">
                                <FiLock />

                                <input
                                    id="support-agent-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="At least 12 characters"
                                    minLength={12}
                                    maxLength={100}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <span className="support-agent-setup-hint">
                                Use at least 12 characters.
                            </span>
                        </div>

                        <div className="support-agent-setup-field">
                            <label htmlFor="support-agent-confirm-password">
                                Confirm password
                            </label>

                            <div className="support-agent-setup-password-input">
                                <FiLock />

                                <input
                                    id="support-agent-confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Enter your password again"
                                    minLength={12}
                                    maxLength={100}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        <label className="support-agent-setup-show-password">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(event) =>
                                    setShowPassword(event.target.checked)
                                }
                            />
                            Show passwords
                        </label>

                        <button
                            type="submit"
                            className="support-agent-setup-submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Completing setup..."
                                : "Complete account setup"}
                        </button>

                        <p className="support-agent-setup-security">
                            Your password will be securely processed by
                            InvoiceNgine. Never share your password with anyone.
                        </p>
                    </form>
                )}

                <div className="support-agent-setup-footer">
                    Need help? Contact your InvoiceNgine administrator.
                </div>
            </section>
        </main>
    );
}
