import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowUpRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiRefreshCw,
    FiXCircle
} from "react-icons/fi";

import http from "../../api/http";
import { useSubscription } from "../../context/useSubscription";
import "./SubscriptionBilling.css";


// =====================================================
// PAYMENT STATUS PRESENTATION
//
// Backend owns PaymentStatus.
// React only controls presentation.
// =====================================================

function getPaymentStatus(statusName) {
    switch (statusName?.toLowerCase()) {
        case "successful":
            return {
                label: "Successful",
                className: "payment-status successful",
                icon: FiCheckCircle
            };

        case "failed":
            return {
                label: "Failed",
                className: "payment-status failed",
                icon: FiXCircle
            };

        case "processing":
            return {
                label: "Processing",
                className: "payment-status processing",
                icon: FiRefreshCw
            };

        case "pending":
            return {
                label: "Pending",
                className: "payment-status pending",
                icon: FiClock
            };

        default:
            return {
                label: statusName || "Unknown",
                className: "payment-status",
                icon: FiClock
            };
    }
}


// =====================================================
// DATE FORMATTER
// =====================================================

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}


// =====================================================
// MONEY FORMATTER
// =====================================================

function formatMoney(amount, currency) {
    const numericAmount =
        Number(amount ?? 0);

    const currencyCode =
        currency || "NGN";

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericAmount);
    } catch {
        return `${currencyCode} ${numericAmount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    }
}


export default function SubscriptionBilling() {
    const navigate = useNavigate();

    // =====================================================
    // SUBSCRIPTION CONTEXT
    //
    // Current subscription is owned by SubscriptionContext.
    // Do not fetch /subscription/current again here.
    // =====================================================

    const {
        subscription,
        planName,
        isFree,
        planActionLabel,
        loading: subscriptionLoading,
        error: subscriptionError,
        refreshSubscription
    } = useSubscription();


    // =====================================================
    // PAYMENT HISTORY STATE
    // =====================================================

    const [payments, setPayments] =
        useState([]);

    const [paymentsLoading, setPaymentsLoading] =
        useState(true);

    const [paymentsError, setPaymentsError] =
        useState("");

    const [refreshing, setRefreshing] =
        useState(false);


    // =====================================================
    // LOAD PAYMENT HISTORY
    // =====================================================

    const loadPayments = useCallback(async () => {
        try {
            setPaymentsLoading(true);
            setPaymentsError("");

            const response =
                await http.get(
                    "/subscription/payments"
                );

            setPayments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Unable to load payment history:",
                err
            );

            setPayments([]);

            setPaymentsError(
                err?.response?.data?.message ||
                "Unable to load payment history."
            );
        } finally {
            setPaymentsLoading(false);
        }
    }, []);


    // =====================================================
    // INITIAL PAYMENT LOAD
    // =====================================================

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);


    // =====================================================
    // REFRESH SUBSCRIPTION + PAYMENTS
    // =====================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            await Promise.all([
                refreshSubscription(),
                loadPayments()
            ]);
        } finally {
            setRefreshing(false);
        }
    };


    // =====================================================
    // DISPLAY VALUES
    // =====================================================

    const displayPlanName =
        planName || subscription?.planName || "Unknown";

    const billingCycle =
        subscription?.billingCycleName || "—";

    const renewalLabel =
        subscription?.isActive && !isFree
            ? "Renews / Expires"
            : "End Date";

    const pageError =
        subscriptionError || paymentsError;

    const initialLoading =
        subscriptionLoading &&
        !subscription;


    // =====================================================
    // INITIAL LOADING
    // =====================================================

    if (initialLoading) {
        return (
            <div className="subscription-billing-page">

                <div className="billing-loading">

                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div>
                        Loading subscription information...
                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="subscription-billing-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="billing-page-header">

                <div>
                    <h2>
                        Subscription & Billing
                    </h2>

                    <p>
                        Manage your InvoiceFlow plan and
                        review your payment history.
                    </p>
                </div>


                <button
                    type="button"
                    className="billing-refresh-btn"
                    onClick={handleRefresh}
                    disabled={
                        refreshing ||
                        subscriptionLoading ||
                        paymentsLoading
                    }
                >
                    <FiRefreshCw />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {pageError && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {pageError}
                </div>
            )}


            {/* =================================================
                CURRENT SUBSCRIPTION
            ================================================= */}

            {subscription && (

                <section className="billing-section">

                    <div className="billing-section-heading">

                        <div>

                            <span className="section-eyebrow">
                                Subscription
                            </span>

                            <h4>
                                Current Plan
                            </h4>

                        </div>

                    </div>


                    <div className="current-plan-card">

                        {/* PLAN */}

                        <div className="current-plan-main">

                            <div className="plan-icon">
                                <FiCreditCard />
                            </div>


                            <div>

                                <div className="plan-name-row">

                                    <h3>
                                        {displayPlanName}
                                    </h3>

                                    <span
                                        className={
                                            subscription.isActive
                                                ? "subscription-status active"
                                                : "subscription-status inactive"
                                        }
                                    >
                                        {subscription.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>


                                <p>
                                    {isFree
                                        ? "You are currently using the Free plan."
                                        : `${billingCycle} billing`}
                                </p>

                            </div>

                        </div>


                        {/* SUBSCRIPTION DETAILS */}

                        <div className="subscription-details">

                            <div className="subscription-detail">

                                <FiCalendar />

                                <div>

                                    <span>
                                        Started
                                    </span>

                                    <strong>
                                        {formatDate(
                                            subscription.startDate
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {!isFree && (

                                <div className="subscription-detail">

                                    <FiRefreshCw />

                                    <div>

                                        <span>
                                            {renewalLabel}
                                        </span>

                                        <strong>
                                            {formatDate(
                                                subscription.endDate
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            )}


                            {subscription.isTrial && (

                                <div className="subscription-detail">

                                    <FiClock />

                                    <div>

                                        <span>
                                            Trial Ends
                                        </span>

                                        <strong>
                                            {formatDate(
                                                subscription.trialEnds
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* ACTION */}

                        <div className="current-plan-actions">

                            <button
                                type="button"
                                className="change-plan-btn"
                                onClick={() =>
                                    navigate("/pricing")
                                }
                            >
                                {planActionLabel}

                                <FiArrowUpRight />
                            </button>

                        </div>

                    </div>

                </section>

            )}


            {/* =================================================
                PAYMENT HISTORY
            ================================================= */}

            <section className="billing-section">

                <div className="billing-section-heading">

                    <div>

                        <span className="section-eyebrow">
                            Billing
                        </span>

                        <h4>
                            Payment History
                        </h4>

                        <p>
                            Your subscription payment
                            transactions are shown below.
                        </p>

                    </div>

                </div>


                <div className="payment-history-card">

                    {paymentsLoading ? (

                        // =========================================
                        // PAYMENT LOADING
                        // =========================================

                        <div className="payment-empty-state">

                            <div
                                className="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p>
                                Loading payment history...
                            </p>

                        </div>

                    ) : payments.length === 0 ? (

                        // =========================================
                        // EMPTY STATE
                        // =========================================

                        <div className="payment-empty-state">

                            <div className="empty-payment-icon">
                                <FiCreditCard />
                            </div>

                            <h5>
                                No payments yet
                            </h5>

                            <p>
                                Your subscription payments
                                will appear here after you
                                make a payment.
                            </p>

                        </div>

                    ) : (

                        // =========================================
                        // PAYMENT TABLE
                        // =========================================

                        <div className="table-responsive">

                            <table className="billing-table">

                                <thead>

                                    <tr>
                                        <th>Date</th>
                                        <th>Plan</th>
                                        <th>Billing Cycle</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Reference</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {payments.map(payment => {

                                        const status =
                                            getPaymentStatus(
                                                payment.statusName
                                            );

                                        const StatusIcon =
                                            status.icon;

                                        return (

                                            <tr key={payment.id}>

                                                {/* DATE */}

                                                <td>

                                                    <div className="payment-date">

                                                        {formatDate(
                                                            payment.paidAt ||
                                                            payment.createdAt
                                                        )}

                                                    </div>


                                                    {payment.paidAt && (

                                                        <small>

                                                            Created{" "}

                                                            {formatDate(
                                                                payment.createdAt
                                                            )}

                                                        </small>

                                                    )}

                                                </td>


                                                {/* PLAN */}

                                                <td>
                                                    <strong>
                                                        {payment.planName || "—"}
                                                    </strong>
                                                </td>


                                                {/* BILLING CYCLE */}

                                                <td>
                                                    {payment.billingCycleName || "—"}
                                                </td>


                                                {/* AMOUNT */}

                                                <td>

                                                    <strong>

                                                        {formatMoney(
                                                            payment.amount,
                                                            payment.currency
                                                        )}

                                                    </strong>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            status.className
                                                        }
                                                    >
                                                        <StatusIcon />

                                                        {status.label}
                                                    </span>

                                                </td>


                                                {/* REFERENCE */}

                                                <td>

                                                    <span
                                                        className="transaction-reference"
                                                        title={
                                                            payment.transactionReference || ""
                                                        }
                                                    >
                                                        {payment.transactionReference || "—"}
                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </section>

        </div>
    );
}