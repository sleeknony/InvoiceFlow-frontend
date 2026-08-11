import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import "./VerifyEmail.css";

export default function VerifyEmail() {

    const navigate = useNavigate();

    const location = useLocation();

    const email =
        location.state?.email ||
        localStorage.getItem(
            "verificationEmail"
        );

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [countdown, setCountdown] = useState(60);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);


    useEffect(() => {

        if (!email) {

            navigate("/register");

            return;

        }

        const timer = setInterval(() => {

            setCountdown(previous => {

                if (previous <= 1) {

                    clearInterval(timer);

                    return 0;

                }

                return previous - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    async function handleVerify(
        verificationCode = code
    ) {

        if (verificationCode.length !== 6) {

            setError(
                "Enter the 6-digit verification code."
            );

            return;

        }

        try {

            setLoading(true);

            setError("");

            const response =
                await authService.verifyEmail({

                    email,

                    code: verificationCode

                });

            setSuccess(true);

            localStorage.removeItem(
                "verificationEmail"
            );

        }
        catch (err) {

            setError(

                err.response?.data?.message ??

                "Invalid verification code."

            );

            setCode("");

        }
        finally {

            setLoading(false);

        }

    }

    async function resendCode() {

        try {

            await authService.resendVerificationCode(email);

            setCountdown(60);

        }
        catch {

        }

    }

    return (

       
        <div className="verify-page">

            <div className="verify-card">

            {success ? (

                <>

                    <div className="verify-success-icon">

                        ✓

                    </div>

                    <h1>

                        Verification Successful

                    </h1>

                    <p>

                        Your email has been verified successfully.

                    </p>

                    <button

                        className="verify-button"

                        onClick={() => navigate("/login")}

                    >

                        Continue to Login

                    </button>

                </>

            ) : (

                <>

                    <h1>

                        Verify Your Email

                    </h1>

                    <p>

                        We've sent a verification code to

                    </p>

                    <strong>

                        {email}

                    </strong>

                    {error && (

                        <div className="verify-error">

                            {error}

                        </div>

                    )}

                    <input

                        className="verify-input"

                        type="text"

                        inputMode="numeric"

                        maxLength={6}

                        autoFocus

                        value={code}

                        onChange={(e) => {

                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);

                            setCode(value);

                            if (value.length === 6 && !loading) {

                                handleVerify(value);

                            }

                        }}

                        placeholder="000000"

                    />

                    <button

                        className="verify-button"

                        onClick={handleVerify}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Verifying..."

                                : "Verify Email"

                        }

                    </button>

                    <div className="verify-footer">

                        {

                            countdown > 0

                                ? (

                                    <span>

                                        Resend code in {countdown}s

                                    </span>

                                )

                                : (

                                    <button

                                        className="verify-link"

                                        onClick={resendCode}

                                    >

                                        Resend Code

                                    </button>

                                )

                        }

                    </div>

                </>

            )}

        </div>
        </div>
    );

}