import { useCallback, useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import { FiArrowUpRight, FiCalendar, FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiCreditCard, FiRefreshCw, FiXCircle} from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import http from "../../api/http";
import { useSubscription } from "../../context/useSubscription";
import "./SubscriptionBilling.css";


// =====================================================
// PAYMENT STATUS PRESENTATION
// =====================================================

function getPaymentStatus(
    statusName
) {

    switch (
    statusName?.toLowerCase()
    ) {

        case "successful":

            return {
                label:
                    "Successful",

                className:
                    "payment-status successful",

                icon:
                    FiCheckCircle
            };


        case "failed":

            return {
                label:
                    "Failed",

                className:
                    "payment-status failed",

                icon:
                    FiXCircle
            };


        case "processing":

            return {
                label:
                    "Processing",

                className:
                    "payment-status processing",

                icon:
                    FiRefreshCw
            };


        case "pending":

            return {
                label:
                    "Pending",

                className:
                    "payment-status pending",

                icon:
                    FiClock
            };


        default:

            return {
                label:
                    statusName ||
                    "Unknown",

                className:
                    "payment-status",

                icon:
                    FiClock
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


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }


    return new Intl.DateTimeFormat(
        "en-NG",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"
        }
    ).format(date);
}


// =====================================================
// MONEY FORMATTER
// =====================================================

function formatMoney(
    amount,
    currency
) {

    const numericAmount =
        Number(
            amount ?? 0
        );


    const currencyCode =
        currency ||
        "NGN";


    try {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style:
                    "currency",

                currency:
                    currencyCode,

                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        ).format(
            numericAmount
        );

    }
    catch {

        return `${currencyCode} ${numericAmount.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        )}`;
    }
}


// =====================================================
// PAGE SIZE
// =====================================================

const PAYMENT_PAGE_SIZE =
    10;


// =====================================================
// COMPONENT
// =====================================================

export default function SubscriptionBilling() {

    const navigate =
        useNavigate();


    // =================================================
    // SUBSCRIPTION CONTEXT
    // =================================================

    const {
        subscription,
        planName,
        isFree,
        planActionLabel,
        loading: subscriptionLoading,
        error: subscriptionError,
        refreshSubscription
    } = useSubscription();


    // =================================================
    // PAYMENT HISTORY
    // =================================================

    const [payments, setPayments] =
        useState([]);

    const [paymentsLoading, setPaymentsLoading] =
        useState(true);

    const [paymentsError, setPaymentsError] =
        useState("");


    // =================================================
    // PAYMENT PAGINATION
    // =================================================

    const [paymentPage, setPaymentPage] =
        useState(1);

    const [paymentTotalPages, setPaymentTotalPages] =
        useState(0);

    const [paymentTotalCount, setPaymentTotalCount] =
        useState(0);


    // =================================================
    // GENERAL REFRESH
    // =================================================

    const [refreshing, setRefreshing] =
        useState(false);


    // =================================================
    // CANCELLATION
    // =================================================

    const [cancelling, setCancelling] =
        useState(false);


    // =================================================
    // SCHEDULED PLAN CHANGE
    // =================================================

    const [
        cancellingScheduledChange,
        setCancellingScheduledChange
    ] = useState(false);


    // =================================================
    // LOAD PAYMENTS
    // =================================================

    const loadPayments =
        useCallback(
            async (
                page = 1
            ) => {

                try {

                    setPaymentsLoading(
                        true
                    );

                    setPaymentsError(
                        ""
                    );


                    const response =
                        await http.get(
                            "/subscription/payments",
                            {
                                params: {
                                    page,

                                    pageSize:
                                        PAYMENT_PAGE_SIZE
                                }
                            }
                        );


                    const data =
                        response.data;


                    setPayments(
                        Array.isArray(
                            data?.items
                        )
                            ? data.items
                            : []
                    );


                    setPaymentPage(
                        Number(
                            data?.page ??
                            page
                        )
                    );


                    setPaymentTotalPages(
                        Number(
                            data?.totalPages ??
                            0
                        )
                    );


                    setPaymentTotalCount(
                        Number(
                            data?.totalCount ??
                            0
                        )
                    );

                }
                catch (err) {

                    console.error(
                        "Unable to load payment history:",
                        err
                    );


                    setPayments(
                        []
                    );


                    setPaymentsError(
                        err?.response
                            ?.data
                            ?.message ||
                        "Unable to load payment history."
                    );

                }
                finally {

                    setPaymentsLoading(
                        false
                    );
                }

            },
            []
        );


    // =================================================
    // INITIAL PAYMENTS
    // =================================================

    useEffect(() => {

        loadPayments(1);

    }, [loadPayments]);


    // =================================================
    // CHANGE PAGE
    // =================================================

    const handlePaymentPageChange =
        async page => {

            if (page < 1) {
                return;
            }


            if (
                paymentTotalPages > 0 &&
                page >
                paymentTotalPages
            ) {
                return;
            }


            if (
                page ===
                paymentPage
            ) {
                return;
            }


            await loadPayments(
                page
            );
        };


    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh =
        async () => {

            try {

                setRefreshing(
                    true
                );


                await Promise.all([
                    refreshSubscription(),
                    loadPayments(
                        paymentPage
                    )
                ]);

            }
            finally {

                setRefreshing(
                    false
                );
            }
        };


    // =================================================
    // CANCEL SCHEDULED PLAN CHANGE
    // =================================================

    const handleCancelScheduledChange =
        async () => {

            if (
                !subscription
                    ?.scheduledPlan
            ) {
                return;
            }


            const targetPlanName =
                subscription
                    .scheduledPlanName ||
                "the scheduled plan";


            const result =
                await Swal.fire({

                    title:
                        "Cancel scheduled downgrade?",

                    text:
                        `Your current ${displayPlanName} plan will continue instead of changing to ${targetPlanName}.`,

                    icon:
                        "question",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Yes, cancel downgrade",

                    cancelButtonText:
                        "Keep scheduled change",

                    reverseButtons:
                        true,

                    confirmButtonColor:
                        "#0d6efd",

                    cancelButtonColor:
                        "#6c757d"
                });


            if (!result.isConfirmed) {
                return;
            }


            try {

                setCancellingScheduledChange(
                    true
                );


                await http.post(
                    "/subscription/downgrade/cancel"
                );


                await refreshSubscription();


                toast.success(
                    "Scheduled plan change cancelled."
                );


                await Swal.fire({

                    title:
                        "Scheduled Change Cancelled",

                    text:
                        `Your ${displayPlanName} subscription will continue on its current plan.`,

                    icon:
                        "success",

                    confirmButtonText:
                        "OK",

                    confirmButtonColor:
                        "#0d6efd"
                });

            }
            catch (error) {

                console.error(
                    "Unable to cancel scheduled plan change:",
                    error
                );


                await Swal.fire({

                    title:
                        "Unable to Cancel",

                    text:
                        error?.response
                            ?.data
                            ?.message ||
                        error?.response
                            ?.data
                            ?.title ||
                        "Unable to cancel the scheduled plan change.",

                    icon:
                        "error",

                    confirmButtonText:
                        "OK",

                    confirmButtonColor:
                        "#dc3545"
                });

            }
            finally {

                setCancellingScheduledChange(
                    false
                );
            }
        };


    // =================================================
    // CANCEL SUBSCRIPTION
    // =================================================

    const handleCancelSubscription =
        async () => {

            if (!subscription) {
                return;
            }


            if (isFree) {
                return;
            }


            // Correct backend DTO property.
            if (
                subscription
                    .isCancellationRequested
            ) {
                return;
            }


            if (
                subscription
                    .scheduledPlan
            ) {

                await Swal.fire({

                    title:
                        "Scheduled plan change exists",

                    text:
                        "Cancel the scheduled downgrade first before cancelling your subscription.",

                    icon:
                        "info",

                    confirmButtonText:
                        "OK",

                    confirmButtonColor:
                        "#0d6efd"
                });


                return;
            }


            const result =
                await Swal.fire({

                    title:
                        "Cancel subscription?",

                    text:
                        "Your subscription will remain active until the end of your current billing period. You will not be charged for the next renewal.",

                    icon:
                        "warning",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Yes, cancel subscription",

                    cancelButtonText:
                        "Keep subscription",

                    reverseButtons:
                        true,

                    confirmButtonColor:
                        "#dc3545",

                    cancelButtonColor:
                        "#6c757d",

                    buttonsStyling:
                        true
                });


            if (!result.isConfirmed) {
                return;
            }


            try {

                setCancelling(
                    true
                );


                await http.post(
                    "/subscription/cancel"
                );


                await refreshSubscription();


                toast.success(
                    "Subscription cancellation has been scheduled."
                );


                await Swal.fire({

                    title:
                        "Cancellation Scheduled",

                    text:
                        "Your subscription will remain active until the end of your current billing period.",

                    icon:
                        "success",

                    confirmButtonText:
                        "OK",

                    confirmButtonColor:
                        "#0d6efd"
                });

            }
            catch (error) {

                console.error(
                    "Unable to cancel subscription:",
                    error
                );


                await Swal.fire({

                    title:
                        "Cancellation Failed",

                    text:
                        error?.response
                            ?.data
                            ?.message ||
                        error?.response
                            ?.data
                            ?.title ||
                        "Unable to cancel your subscription.",

                    icon:
                        "error",

                    confirmButtonText:
                        "OK",

                    confirmButtonColor:
                        "#dc3545"
                });

            }
            finally {

                setCancelling(
                    false
                );
            }
        };


    // =================================================
    // DISPLAY VALUES
    // =================================================

    const displayPlanName =
        planName ||
        subscription?.planName ||
        "Unknown";


    const billingCycle =
        subscription
            ?.billingCycleName ||
        "—";


    const cancellationRequested =
        Boolean(
            subscription
                ?.isCancellationRequested
        );


    const scheduledPlan =
        subscription
            ?.scheduledPlan;


    const scheduledPlanName =
        subscription
            ?.scheduledPlanName;


    const scheduledPlanDate =
        subscription
            ?.scheduledPlanDate;


    const hasScheduledPlanChange =
        Boolean(
            scheduledPlan
        );


    const renewalLabel =
        cancellationRequested
            ? "Subscription Ends"
            : hasScheduledPlanChange
                ? "Current Plan Ends"
                : subscription?.isActive &&
                    !isFree
                    ? "Renews / Expires"
                    : "End Date";


    const pageError =
        subscriptionError ||
        paymentsError;


    const initialLoading =
        subscriptionLoading &&
        !subscription;


    const actionBusy =
        cancelling ||
        cancellingScheduledChange;


    // =================================================
    // INITIAL LOADING
    // =================================================

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


    // =================================================
    // UI
    // =================================================

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
                        Manage your invoiceNgine plan and
                        review your payment history.
                    </p>

                </div>


                <button
                    type="button"
                    className="billing-refresh-btn"
                    onClick={
                        handleRefresh
                    }
                    disabled={
                        refreshing ||
                        subscriptionLoading ||
                        paymentsLoading ||
                        actionBusy
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


                    {/* =========================================
                        SCHEDULED PLAN CHANGE
                    ========================================= */}

                    {hasScheduledPlanChange && (

                        <div className="subscription-cancellation-notice">

                            <div className="subscription-cancellation-icon">

                                <FiClock />

                            </div>


                            <div>

                                <strong>
                                    Downgrade Scheduled
                                </strong>


                                <p>

                                    Your{" "}

                                    <strong>
                                        {displayPlanName}
                                    </strong>

                                    {" "}plan remains active until{" "}

                                    <strong>
                                        {formatDate(
                                            scheduledPlanDate ||
                                            subscription.endDate
                                        )}
                                    </strong>.


                                    {" "}It will then change to{" "}

                                    <strong>
                                        {scheduledPlanName ||
                                            "the selected plan"}
                                    </strong>.

                                </p>


                                {scheduledPlanName
                                    ?.toLowerCase() !==
                                    "free" && (

                                        <p>
                                            Your saved payment authorization
                                            will be used for the new plan at
                                            the start of the next billing period.
                                        </p>

                                    )}

                            </div>

                        </div>

                    )}


                    {/* =========================================
                        CANCELLATION NOTICE
                    ========================================= */}

                    {cancellationRequested &&
                        !hasScheduledPlanChange && (

                            <div className="subscription-cancellation-notice">

                                <div className="subscription-cancellation-icon">
                                    <FiClock />
                                </div>


                                <div>

                                    <strong>
                                        Cancellation Scheduled
                                    </strong>


                                    <p>

                                        Your {displayPlanName}
                                        {" "}subscription will remain
                                        active until{" "}

                                        <strong>
                                            {formatDate(
                                                subscription.endDate
                                            )}
                                        </strong>.

                                    </p>

                                </div>

                            </div>

                        )}


                    <div className="current-plan-card">


                        {/* =====================================
                            PLAN
                        ===================================== */}

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

                                            ? cancellationRequested
                                                ? "Cancellation Scheduled"

                                                : hasScheduledPlanChange
                                                    ? "Plan Change Scheduled"

                                                    : "Active"

                                            : "Inactive"}

                                    </span>

                                </div>


                                <p>

                                    {isFree

                                        ? "You are currently using the Free plan."

                                        : cancellationRequested

                                            ? "Your subscription will not renew after the current billing period."

                                            : hasScheduledPlanChange

                                                ? `Your plan will change to ${scheduledPlanName || "the selected plan"} at the end of this billing period.`

                                                : `${billingCycle} billing`
                                    }

                                </p>

                            </div>

                        </div>


                        {/* =====================================
                            DETAILS
                        ===================================== */}

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


                            {hasScheduledPlanChange && (

                                <div className="subscription-detail">

                                    <FiClock />


                                    <div>

                                        <span>
                                            Next Plan
                                        </span>


                                        <strong>
                                            {scheduledPlanName ||
                                                "—"}
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


                        {/* =====================================
                            ACTIONS
                        ===================================== */}

                        <div className="current-plan-actions">


                            <button
                                type="button"
                                className="change-plan-btn"
                                onClick={() =>
                                    navigate(
                                        "/pricing"
                                    )
                                }
                                disabled={
                                    actionBusy
                                }
                            >

                                {planActionLabel}

                                <FiArrowUpRight />

                            </button>


                            {/* =================================
                                CANCEL SCHEDULED DOWNGRADE
                            ================================= */}

                            {!isFree &&
                                subscription.isActive &&
                                hasScheduledPlanChange && (

                                    <button
                                        type="button"
                                        className="cancel-subscription-btn"
                                        onClick={
                                            handleCancelScheduledChange
                                        }
                                        disabled={
                                            cancellingScheduledChange
                                        }
                                    >

                                        {cancellingScheduledChange ? (

                                            <>

                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />

                                                Cancelling...

                                            </>

                                        ) : (

                                            <>

                                                <FiXCircle />

                                                Cancel Scheduled Downgrade

                                            </>

                                        )}

                                    </button>

                                )}


                            {/* =================================
                                CANCEL SUBSCRIPTION
                            ================================= */}

                            {!isFree &&
                                subscription.isActive &&
                                !cancellationRequested &&
                                !hasScheduledPlanChange && (

                                    <button
                                        type="button"
                                        className="cancel-subscription-btn"
                                        onClick={
                                            handleCancelSubscription
                                        }
                                        disabled={
                                            cancelling
                                        }
                                    >

                                        {cancelling ? (

                                            <>

                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />

                                                Cancelling...

                                            </>

                                        ) : (

                                            <>

                                                <FiXCircle />

                                                Cancel Subscription

                                            </>

                                        )}

                                    </button>

                                )}


                            {/* =================================
                                CANCELLATION SCHEDULED
                            ================================= */}

                            {!isFree &&
                                subscription.isActive &&
                                cancellationRequested &&
                                !hasScheduledPlanChange && (

                                    <button
                                        type="button"
                                        className="cancel-subscription-btn cancellation-scheduled-btn"
                                        disabled
                                    >

                                        <FiClock />

                                        Cancellation Scheduled

                                    </button>

                                )}

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

                        <>

                            <div className="table-responsive">

                                <table className="billing-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Plan
                                            </th>

                                            <th>
                                                Billing Cycle
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Reference
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {payments.map(
                                            payment => {

                                                const status =
                                                    getPaymentStatus(
                                                        payment.statusName
                                                    );


                                                const StatusIcon =
                                                    status.icon;


                                                return (

                                                    <tr
                                                        key={
                                                            payment.id
                                                        }
                                                    >

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


                                                        <td>

                                                            <strong>
                                                                {payment.planName ||
                                                                    "—"}
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            {payment.billingCycleName ||
                                                                "—"}

                                                        </td>


                                                        <td>

                                                            <strong>

                                                                {formatMoney(
                                                                    payment.amount,
                                                                    payment.currency
                                                                )}

                                                            </strong>

                                                        </td>


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


                                                        <td>

                                                            <span
                                                                className="transaction-reference"
                                                                title={
                                                                    payment.transactionReference ||
                                                                    ""
                                                                }
                                                            >

                                                                {payment.transactionReference ||
                                                                    "—"}

                                                            </span>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* =================================
                                PAGINATION
                            ================================= */}

                            {paymentTotalPages > 0 && (

                                <div className="payment-pagination">

                                    <div className="payment-pagination-info">

                                        Showing{" "}

                                        <strong>
                                            {
                                                (
                                                    (
                                                        paymentPage -
                                                        1
                                                    ) *
                                                    PAYMENT_PAGE_SIZE
                                                ) +
                                                1
                                            }
                                        </strong>

                                        {" "}-{" "}

                                        <strong>
                                            {
                                                Math.min(
                                                    paymentPage *
                                                    PAYMENT_PAGE_SIZE,

                                                    paymentTotalCount
                                                )
                                            }
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {paymentTotalCount}
                                        </strong>

                                        {" "}payments

                                    </div>


                                    <div className="payment-pagination-controls">

                                        <button
                                            type="button"
                                            className="payment-pagination-btn"
                                            onClick={() =>
                                                handlePaymentPageChange(
                                                    paymentPage -
                                                    1
                                                )
                                            }
                                            disabled={
                                                paymentPage <= 1 ||
                                                paymentsLoading
                                            }
                                            aria-label="Previous page"
                                        >

                                            <FiChevronLeft />

                                            <span>
                                                Previous
                                            </span>

                                        </button>


                                        <div className="payment-page-indicator">

                                            Page{" "}

                                            <strong>
                                                {paymentPage}
                                            </strong>

                                            {" "}of{" "}

                                            <strong>
                                                {paymentTotalPages}
                                            </strong>

                                        </div>


                                        <button
                                            type="button"
                                            className="payment-pagination-btn"
                                            onClick={() =>
                                                handlePaymentPageChange(
                                                    paymentPage +
                                                    1
                                                )
                                            }
                                            disabled={
                                                paymentPage >=
                                                paymentTotalPages ||
                                                paymentsLoading
                                            }
                                            aria-label="Next page"
                                        >

                                            <span>
                                                Next
                                            </span>

                                            <FiChevronRight />

                                        </button>

                                    </div>

                                </div>

                            )}

                        </>

                    )}

                </div>

            </section>

        </div>
    );
}