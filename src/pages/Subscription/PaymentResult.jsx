import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../../api/http";
import { useSubscription } from "../../context/useSubscription";

export default function PaymentResult() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState(
        "Verifying your payment..."
    );
    const [result, setResult] = useState(null);

    // Prevent React StrictMode from verifying twice
    // during development.
    const verificationStarted = useRef(false);
    const { refreshSubscription } = useSubscription();

    useEffect(() => {

        if (verificationStarted.current) {
            return;
        }

        verificationStarted.current = true;

        const reference =
            searchParams.get("reference") ||
            searchParams.get("trxref");

        if (!reference) {

            setStatus("failed");

            setMessage(
                "Payment reference was not returned."
            );

            return;
        }

        verifyPayment(reference);

    }, [searchParams]);

    async function verifyPayment(reference) {

        try {

            setStatus("verifying");

            setMessage(
                "Verifying your payment..."
            );

            const response =
                await http.post(
                    "/subscription/verify-payment",
                    {
                        transactionReference:
                            reference
                    }
                );

            const data =
                response.data;

            if (!data?.successful) {

                setStatus("failed");

                setMessage(
                    data?.message ||
                    "Payment could not be verified."
                );

                return;
            }

            setResult(data);

            try {
                await refreshSubscription();
            }
            catch (refreshError) {
                console.error(
                    "Subscription refresh failed after successful payment:",
                    refreshError
                );
            }

            setStatus("success");

            setMessage(
                data.message ||
                "Payment verified and subscription activated."
            );

        }
        catch (error) {

            console.error(
                "Payment verification failed:",
                error
            );

            setStatus("failed");

            setMessage(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                "Unable to verify payment."
            );
        }
    }

  

    return (

        <div
            className="container py-5"
            style={{
                maxWidth: "700px"
            }}
        >

            <div className="card shadow-sm">

                <div className="card-body p-5 text-center">

                    {status === "verifying" && (
                        <>
                            <div
                                className="spinner-border text-primary mb-4"
                                role="status"
                            />

                            <h4>
                                Verifying Payment
                            </h4>

                            <p className="text-muted mb-0">
                                {message}
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div
                                className="mb-3"
                                style={{
                                    fontSize: "48px"
                                }}
                            >
                                ✓
                            </div>

                            <h4>
                                Payment Successful
                            </h4>

                            <p className="text-muted">
                                {message}
                            </p>

                            {result?.plan != null && (
                                <p>
                                    Your subscription has
                                    been activated.
                                </p>
                            )}

                            <button
                                className="btn btn-primary mt-3"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {status === "failed" && (
                        <>
                            <div
                                className="mb-3"
                                style={{
                                    fontSize: "48px"
                                }}
                            >
                                ✕
                            </div>

                            <h4>
                                Payment Verification Failed
                            </h4>

                            <p className="text-muted">
                                {message}
                            </p>

                            <button
                                className="btn btn-outline-primary mt-3"
                                onClick={() =>
                                    navigate("/pricing")
                                }
                            >
                                Return to Pricing
                            </button>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}