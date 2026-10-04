import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    FiArrowLeft,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiCreditCard,
    FiActivity,
    FiRefreshCw,
    FiAlertCircle,
} from "react-icons/fi";

import {
    getSuperAdminCompany,
    activateSuperAdminCompany,
    deactivateSuperAdminCompany,
    getSuperAdminCompanySubscriptionPayments,
    reconcileSuperAdminSubscriptionPayment,
    changeSuperAdminCompanySubscription,
} from "../../services/superAdminService";


export default function SuperAdminCompanyDetails() {

    const { companyId } = useParams();
    const navigate = useNavigate();


    // =========================================================
    // COMPANY
    // =========================================================

    const [company, setCompany] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // COMPANY STATUS
    // =========================================================

    const [changingStatus, setChangingStatus] =
        useState(false);

    const [statusMessage, setStatusMessage] =
        useState("");

    const [statusError, setStatusError] =
        useState("");


    // =========================================================
    // SUBSCRIPTION PAYMENTS
    // =========================================================

    const [payments, setPayments] =
        useState([]);


    const [paymentPage, setPaymentPage] =
        useState(1);

    const [paymentPageSize, setPaymentPageSize] =
        useState(20);

    const [paymentTotalCount, setPaymentTotalCount] =
        useState(0);

    const [paymentTotalPages, setPaymentTotalPages] =
        useState(0);

    const [paymentsLoading, setPaymentsLoading] =
        useState(false);

    const [paymentsError, setPaymentsError] =
        useState("");

    const [reconcilingPaymentId, setReconcilingPaymentId] =
        useState(null);


    // =========================================================
    // LOAD COMPANY
    // =========================================================

    const loadCompany = async () => {

        try {

            setLoading(true);
            setError("");

            const result =
                await getSuperAdminCompany(companyId);

            setCompany(result);

        } catch (err) {

            console.error(
                "Failed to load SuperAdmin company:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load company."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD SUBSCRIPTION PAYMENTS
    // =========================================================

    const loadSubscriptionPayments = async (
        page = paymentPage,
        pageSize = paymentPageSize
    ) => {

        try {

            setPaymentsLoading(true);

            const result =
                await getSuperAdminCompanySubscriptionPayments(
                    companyId,
                    page,
                    pageSize
                );

            setPayments(
                result.items ??
                result.Items ??
                []
            );

            setPaymentPage(
                result.page ??
                result.Page ??
                page
            );

            setPaymentPageSize(
                result.pageSize ??
                result.PageSize ??
                pageSize
            );

            setPaymentTotalCount(
                result.totalCount ??
                result.TotalCount ??
                0
            );

            setPaymentTotalPages(
                result.totalPages ??
                result.TotalPages ??
                0
            );

        } catch (err) {

            console.error(
                "Failed to load subscription payments:",
                err
            );

            setPayments([]);

            setPaymentTotalCount(0);

            setPaymentTotalPages(0);

            setPaymentsError(
                err?.response?.data?.message ||
                "Unable to load subscription payments."
            );

        } finally {

            setPaymentsLoading(false);

        }
    };


    // =========================================================
    // LOAD PAGE DATA
    // =========================================================

    useEffect(() => {

        if (companyId) {

            loadCompany();

            loadSubscriptionPayments(
                1,
                paymentPageSize
            );

        }

    }, [companyId]);

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (Number.isNaN(
            date.getTime()
        )) {
            return "-";
        }

        return date.toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );

    };


    // =========================================================
    // FORMAT DATE + TIME
    // =========================================================

    const formatDateTime = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (Number.isNaN(
            date.getTime()
        )) {
            return "-";
        }

        return date.toLocaleString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // =========================================================
    // PLAN NAME
    // =========================================================

    const getPlanName = (value) => {
        if (!value) {
            return "-";
        }

        return String(value);
    };

    //const getPlanName = (plan) => {

    //    const plans = {
    //        1: "Free",
    //        2: "Professional",
    //        3: "Business",
    //        4: "Enterprise",
    //    };

    //    return (
    //        plans[plan] ||
    //        plan ||
    //        "-"
    //    );

    //};


    // =========================================================
    // BILLING CYCLE
    // =========================================================

    const getBillingCycleName = (value) => {
        if (!value) {
            return "-";
        }

        return String(value);
    };


    // =========================================================
    // PAYMENT STATUS
    // =========================================================

    const getPaymentStatusName = (value) => {
        if (!value) {
            return "-";
        }

        return String(value);
    };


    // =========================================================
    // PAYMENT STATUS BADGE
    // =========================================================

    const getPaymentStatusClass = (value) => {
        switch (String(value).toLowerCase()) {
            case "successful":
                return "badge bg-success-subtle text-success";

            case "pending":
                return "badge bg-warning-subtle text-warning";

            case "processing":
                return "badge bg-info-subtle text-info";

            case "failed":
                return "badge bg-danger-subtle text-danger";

            default:
                return "badge bg-secondary-subtle text-secondary";
        }
    };


    // =========================================================
    // COMPANY STATUS CHANGE
    // =========================================================

    const handleStatusChange = async () => {

        if (!company || changingStatus) {
            return;
        }

        const isActive =
            company.isActive;


        // =====================================================
        // CONFIRMATION MODAL
        // =====================================================

        const result =
            await Swal.fire({

                title:
                    isActive
                        ? "Deactivate Company?"
                        : "Reactivate Company?",

                html:
                    isActive
                        ? `
                            <p>
                                Are you sure you want to deactivate
                                <strong>${company.name}</strong>?
                            </p>

                            <p class="text-muted mb-0">
                                Users belonging to this company
                                will no longer be able to use the company.
                            </p>
                        `
                        : `
                            <p>
                                Are you sure you want to reactivate
                                <strong>${company.name}</strong>?
                            </p>

                            <p class="text-muted mb-0">
                                This will restore the company's access
                                to the platform.
                            </p>
                        `,

                icon:
                    isActive
                        ? "warning"
                        : "question",

                showCancelButton: true,

                confirmButtonText:
                    isActive
                        ? "Yes, Deactivate"
                        : "Yes, Reactivate",

                cancelButtonText:
                    "Cancel",

                reverseButtons: true,

                focusCancel: true,

                allowOutsideClick:
                    () => !changingStatus,

                allowEscapeKey:
                    () => !changingStatus,

            });


        // =====================================================
        // USER CANCELLED
        // =====================================================

        if (!result.isConfirmed) {
            return;
        }


        try {

            setChangingStatus(true);
            setStatusMessage("");
            setStatusError("");


            // =================================================
            // PROCESSING
            // =================================================

            Swal.fire({

                title:
                    isActive
                        ? "Deactivating Company..."
                        : "Reactivating Company...",

                text:
                    "Please wait.",

                allowOutsideClick:
                    false,

                allowEscapeKey:
                    false,

                showConfirmButton:
                    false,

                didOpen: () => {

                    Swal.showLoading();

                },

            });


            // =================================================
            // API CALL
            // =================================================

            if (isActive) {

                await deactivateSuperAdminCompany(
                    companyId
                );

            } else {

                await activateSuperAdminCompany(
                    companyId
                );

            }


            // =================================================
            // REFRESH
            // =================================================

            await loadCompany();


            setStatusMessage(
                isActive
                    ? "Company deactivated successfully."
                    : "Company reactivated successfully."
            );


            // =================================================
            // SUCCESS
            // =================================================

            await Swal.fire({

                icon:
                    "success",

                title:
                    "Success",

                text:
                    isActive
                        ? "Company deactivated successfully."
                        : "Company reactivated successfully.",

                confirmButtonText:
                    "OK",

                timer:
                    2000,

                timerProgressBar:
                    true,

            });

        } catch (err) {

            console.error(
                "Failed to change company status:",
                err
            );


            const errorMessage =
                err?.response?.data?.message ||
                (
                    isActive
                        ? "Unable to deactivate company."
                        : "Unable to reactivate company."
                );


            setStatusError(
                errorMessage
            );


            // =================================================
            // ERROR
            // =================================================

            await Swal.fire({

                icon:
                    "error",

                title:
                    "Operation Failed",

                text:
                    errorMessage,

                confirmButtonText:
                    "OK",

            });

        } finally {

            setChangingStatus(false);

        }

    };


    // =========================================================
    // RECONCILE SUBSCRIPTION PAYMENT
    // =========================================================

    const handleReconcilePayment = async (payment) => {

        if (!payment) {
            return;
        }

        const paymentId =
            payment.id ??
            payment.Id;

        const status =
            payment.status ??
            payment.Status;

        const isSuccessful =
            String(status).toLowerCase() ===
            "successful";

        const isApplied =
            Boolean(
                payment.isSubscriptionApplied ??
                payment.IsSubscriptionApplied
            );


        // =====================================================
        // VALIDATE PAYMENT STATUS
        // =====================================================

        if (!isSuccessful) {

            await Swal.fire({
                icon: "warning",
                title: "Payment Not Successful",
                text:
                    "Only successful subscription payments can be reconciled.",
                confirmButtonText: "OK",
            });

            return;
        }


        // =====================================================
        // ALREADY APPLIED
        // =====================================================

        if (isApplied) {

            await Swal.fire({
                icon: "info",
                title: "Payment Already Applied",
                text:
                    "This payment has already been applied to the company subscription.",
                confirmButtonText: "OK",
            });

            return;
        }


        // =====================================================
        // ASK FOR REASON
        // =====================================================

        const result = await Swal.fire({

            title: "Reconcile Subscription Payment",

            html: `
            <p class="text-muted mb-3">
                This payment was successful but has not yet
                been applied to the company's subscription.
            </p>

            <div class="text-start mb-3">

                <strong>Transaction:</strong>
                ${payment.transactionReference ??
                payment.TransactionReference ??
                "-"}

                <br />

                <strong>Plan:</strong>
                ${payment.plan ??
                payment.Plan ??
                "-"}

                <br />

                <strong>Amount:</strong>
                ${payment.currency ??
                payment.Currency ??
                "NGN"}
                ${Number(
                    payment.amount ??
                    payment.Amount ??
                    0
                ).toLocaleString()}

            </div>

            <textarea
                id="reconciliation-reason"
                class="swal2-textarea"
                placeholder="Enter the reason for reconciliation..."
                style="width: 85%; margin: 10px auto;"
            ></textarea>
        `,

            icon: "question",

            showCancelButton: true,

            confirmButtonText: "Reconcile Payment",

            cancelButtonText: "Cancel",

            reverseButtons: true,

            focusCancel: true,

            preConfirm: () => {

                const reason =
                    document
                        .getElementById(
                            "reconciliation-reason"
                        )
                        ?.value
                        ?.trim();

                if (!reason) {

                    Swal.showValidationMessage(
                        "A reason is required."
                    );

                    return false;
                }

                return reason;
            },
        });


        // =====================================================
        // USER CANCELLED
        // =====================================================

        if (!result.isConfirmed) {
            return;
        }


        const reason =
            result.value;


        // =====================================================
        // RECONCILE
        // =====================================================

        try {

            setReconcilingPaymentId(
                paymentId
            );


            await reconcileSuperAdminSubscriptionPayment(
                companyId,
                paymentId,
                reason
            );


            // =================================================
            // REFRESH PAYMENT LIST
            // =================================================

            await loadSubscriptionPayments();


            // =================================================
            // SUCCESS
            // =================================================

            await Swal.fire({

                icon: "success",

                title: "Payment Reconciled",

                text:
                    "The successful payment has been applied to the company subscription.",

                confirmButtonText: "OK",

                timer: 2500,

                timerProgressBar: true,
            });


        } catch (err) {

            console.error(
                "Failed to reconcile subscription payment:",
                err
            );


            const errorMessage =
                err?.response?.data?.message ||
                "Unable to reconcile the subscription payment.";


            await Swal.fire({

                icon: "error",

                title: "Reconciliation Failed",

                text: errorMessage,

                confirmButtonText: "OK",
            });


        } finally {

            setReconcilingPaymentId(
                null
            );

        }
    };


    const handleChangeSubscription = async () => {
        const result = await Swal.fire({
            title: "Change Subscription",
            html: `
            <div style="text-align:left">
                <label class="form-label">Subscription Plan</label>
                <select id="swal-plan" class="swal2-select" style="width:100%; margin:8px 0 16px;">
                    <option value="Free">Free</option>
                    <option value="Professional">Professional</option>
                    <option value="Business">Business</option>
                    <option value="Enterprise">Enterprise</option>
                </select>

                <label class="form-label">Billing Cycle</label>
                <select id="swal-billing-cycle" class="swal2-select" style="width:100%; margin:8px 0 16px;">
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                </select>

                <label class="form-label">Start Date</label>
                <input
                    id="swal-start-date"
                    type="date"
                    class="swal2-input"
                    style="width:100%; margin:8px 0 16px;"
                    value="${new Date().toISOString().slice(0, 10)}"
                />

                <label class="form-label">Reason</label>
                <textarea
                    id="swal-reason"
                    class="swal2-textarea"
                    style="width:100%; margin:8px 0;"
                    placeholder="Enter the reason for this subscription change..."
                ></textarea>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: "Change Subscription",
            cancelButtonText: "Cancel",
            focusConfirm: false,

            didOpen: () => {
                const planSelect =
                    document.getElementById("swal-plan");

                const billingCycleSelect =
                    document.getElementById("swal-billing-cycle");

                const updateBillingCycleState = () => {
                    const isFree =
                        planSelect.value === "Free";

                    billingCycleSelect.disabled = isFree;

                    if (isFree) {
                        billingCycleSelect.value = "";
                    }
                };

                planSelect.addEventListener(
                    "change",
                    updateBillingCycleState
                );

                updateBillingCycleState();
            },

            preConfirm: () => {
                const plan =
                    document.getElementById("swal-plan").value;

                const billingCycle =
                    document.getElementById(
                        "swal-billing-cycle"
                    ).value;

                const startDate =
                    document.getElementById(
                        "swal-start-date"
                    ).value;

                const reason =
                    document.getElementById(
                        "swal-reason"
                    ).value.trim();

                if (!plan) {
                    Swal.showValidationMessage(
                        "Please select a subscription plan."
                    );
                    return false;
                }

                if (
                    plan !== "Free" &&
                    !billingCycle
                ) {
                    Swal.showValidationMessage(
                        "Please select a billing cycle."
                    );
                    return false;
                }

                if (!startDate) {
                    Swal.showValidationMessage(
                        "Please select a start date."
                    );
                    return false;
                }

                if (!reason) {
                    Swal.showValidationMessage(
                        "Please provide a reason."
                    );
                    return false;
                }

                return {
                    plan,
                    billingCycle:
                        plan === "Free"
                            ? null
                            : billingCycle,
                    startDate,
                    reason,
                };
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setLoading(true);

            await changeSuperAdminCompanySubscription(
                companyId,
                result.value.plan,
                result.value.billingCycle,
                result.value.startDate,
                result.value.reason
            );

            await Swal.fire({
                icon: "success",
                title: "Subscription Changed",
                text:
                    "The company subscription has been changed successfully.",
                confirmButtonText: "OK",
            });

            await loadCompany();

            await loadSubscriptionPayments(
                1,
                paymentPageSize
            );
        } catch (err) {
            console.error(
                "Failed to change company subscription:",
                err
            );

            Swal.fire({
                icon: "error",
                title: "Unable to Change Subscription",
                text:
                    err?.response?.data?.message ||
                    "An error occurred while changing the company subscription.",
            });
        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="container-fluid">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="text-muted">
                        Loading company...
                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="container-fluid">

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    <FiArrowLeft className="me-2" />
                    Back
                </button>

               

            </div>

        );

    }


    // =========================================================
    // COMPANY NOT FOUND
    // =========================================================

    if (!company) {

        return (

            <div className="container-fluid">

                <div className="alert alert-warning">
                    Company not found.
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    <FiArrowLeft className="me-2" />
                    Back
                </button>

            </div>

        );

    }


    // =========================================================
    // SUCCESSFUL UNAPPLIED PAYMENTS
    // =========================================================

    const unappliedSuccessfulPayments =
        payments.filter(payment => {

            const status =
                Number(
                    payment.status ??
                    payment.Status
                );

            const applied =
                Boolean(
                    payment.isSubscriptionApplied ??
                    payment.IsSubscriptionApplied
                );

            return (
                status === 2 &&
                !applied
            );

        });


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="container-fluid">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mb-3"
                        onClick={() => navigate("/superadmin/companies")}
                        
                    >
                        <FiArrowLeft className="me-2" />
                    Back to Companies
                    </button>

                   

                    <h2 className="mb-1">
                        {company.name}
                    </h2>


                    <p className="text-muted mb-0">
                        Company details and administration.
                    </p>

                </div>


                <div>

                    {company.isActive ? (

                        <span className="badge bg-success-subtle text-success fs-6">

                            <FiCheckCircle className="me-1" />

                            Active

                        </span>

                    ) : (

                        <span className="badge bg-danger-subtle text-danger fs-6">

                            <FiXCircle className="me-1" />

                            Inactive

                        </span>

                    )}

                </div>

            </div>


            {/* =====================================================
                STATUS SUCCESS / ERROR
            ===================================================== */}

            {statusMessage && (

                <div
                    className="alert alert-success d-flex justify-content-between align-items-center"
                    role="alert"
                >

                    <span>
                        {statusMessage}
                    </span>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setStatusMessage("")
                        }
                    />

                </div>

            )}


            {statusError && (

                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                    role="alert"
                >

                    <span>
                        {statusError}
                    </span>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                            setStatusError("")
                        }
                    />

                </div>

            )}


            {/* =====================================================
                COMPANY SUMMARY
            ===================================================== */}

            <div className="row g-4 mb-4">

                {/* OWNER */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-2">
                                Owner
                            </div>

                            <div className="fw-semibold">
                                {company.ownerName || "-"}
                            </div>

                            <div className="text-muted small">
                                {company.ownerEmail || "-"}
                            </div>

                        </div>

                    </div>

                </div>


                {/* USERS */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-2">
                                Users
                            </div>

                            <div className="fs-3 fw-semibold">
                                {company.userCount ?? 0}
                            </div>

                            <div className="text-muted small">
                                Company members
                            </div>

                        </div>

                    </div>

                </div>


                {/* PLAN */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-2">
                                Plan
                            </div>

                            <div className="fs-5 fw-semibold">
                                {company.planName || "Free"}
                            </div>

                            <div className="text-muted small">
                                Current subscription
                            </div>

                        </div>

                    </div>

                </div>


                {/* SUBSCRIPTION END */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-2">
                                Subscription End
                            </div>

                            <div className="fs-5 fw-semibold">
                                {formatDate(
                                    company.subscriptionEndDate
                                )}
                            </div>

                            <div className="text-muted small">
                                Current subscription
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">
                                Subscription Management
                            </h5>

                            <p className="text-muted mb-0">
                                Change the company's subscription plan
                                and billing period.
                            </p>
                        </div>

                       

                        <div className="d-flex align-items-center gap-2">
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    className="btn btn-outline-primary"*/}
                            {/*    onClick={() =>*/}
                            {/*        navigate(*/}
                            {/*            `/superadmin/companies/${companyId}/subscriptions`*/}
                            {/*        )*/}
                            {/*    }*/}
                            {/*>*/}
                            {/*    Subscription History*/}
                            {/*</button>*/}

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleChangeSubscription}
                                disabled={loading}
                            >
                                Change Subscription
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* =====================================================
                SUBSCRIPTION PAYMENT ATTENTION
                ===================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white border-bottom">

                    <div className="d-flex justify-content-between align-items-start">

                        <div>

                            <h5 className="mb-1">
                                Subscription Payments
                            </h5>

                            <small className="text-muted">
                                Review subscription payments and reconcile
                                confirmed payments that were not applied.
                            </small>

                        </div>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled={paymentsLoading}
                            onClick={loadSubscriptionPayments}
                        >

                            <FiRefreshCw
                                className={`me-1 ${paymentsLoading
                                        ? "spin"
                                        : ""
                                    }`}
                            />

                            Refresh

                        </button>

                    </div>

                </div>


                <div className="card-body">

                    {paymentsError && (

                        <div className="alert alert-danger">
                            {paymentsError}
                        </div>

                    )}


                    {paymentsLoading ? (

                        <div className="text-center py-4">

                            <div
                                className="spinner-border text-primary mb-2"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <div className="text-muted small">
                                Loading subscription payments...
                            </div>

                        </div>

                    ) : payments.length === 0 ? (

                        <div className="text-center py-4">

                            <FiCreditCard
                                size={32}
                                className="text-muted mb-2"
                            />

                            <div className="text-muted">
                                No subscription payments found.
                            </div>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead>

                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Billing
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Subscription
                                        </th>

                                        <th className="text-end">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                        <tbody>

                                            {payments.map((payment) => {

                                                const paymentId =
                                                    payment.id ??
                                                    payment.Id;

                                                const plan =
                                                    payment.plan ??
                                                    payment.Plan;

                                                const billingCycle =
                                                    payment.billingCycle ??
                                                    payment.BillingCycle;

                                                const amount =
                                                    payment.amount ??
                                                    payment.Amount;

                                                const currency =
                                                    payment.currency ??
                                                    payment.Currency ??
                                                    "NGN";

                                                const status =
                                                    payment.status ??
                                                    payment.Status;

                                                const applied =
                                                    Boolean(
                                                        payment.isSubscriptionApplied ??
                                                        payment.IsSubscriptionApplied
                                                    );

                                                const isSuccessful =
                                                    String(status).toLowerCase() ===
                                                    "successful";

                                                const transactionReference =
                                                    payment.transactionReference ??
                                                    payment.TransactionReference ??
                                                    "-";

                                                const isReconciling =
                                                    reconcilingPaymentId === paymentId;

                                                return (
                                                    <tr key={paymentId}>

                                                        {/* DATE */}
                                                        <td>

                                                            <div className="fw-semibold">
                                                                {formatDate(
                                                                    payment.createdAt ??
                                                                    payment.CreatedAt
                                                                )}
                                                            </div>

                                                            <div className="text-muted small">
                                                                {formatDateTime(
                                                                    payment.paidAt ??
                                                                    payment.PaidAt
                                                                )}
                                                            </div>

                                                        </td>


                                                        {/* PLAN */}
                                                        <td>
                                                            {getPlanName(plan)}
                                                        </td>


                                                        {/* BILLING */}
                                                        <td>
                                                            {getBillingCycleName(
                                                                billingCycle
                                                            )}
                                                        </td>


                                                        {/* AMOUNT */}
                                                        <td>

                                                            <div className="fw-semibold">
                                                                {currency}{" "}
                                                                {Number(
                                                                    amount || 0
                                                                ).toLocaleString()}
                                                            </div>

                                                        </td>


                                                        {/* STATUS */}
                                                        <td>

                                                            <span
                                                                className={`badge ${getPaymentStatusClass(
                                                                    status
                                                                )}`}
                                                            >
                                                                {getPaymentStatusName(
                                                                    status
                                                                )}
                                                            </span>

                                                        </td>


                                                        {/* SUBSCRIPTION */}
                                                        <td>

                                                            {isSuccessful ? (

                                                                applied ? (

                                                                    <span className="badge bg-success-subtle text-success">
                                                                        <FiCheckCircle className="me-1" />
                                                                        Applied
                                                                    </span>

                                                                ) : (

                                                                    <span className="badge bg-warning-subtle text-warning">
                                                                        <FiAlertCircle className="me-1" />
                                                                        Not Applied
                                                                    </span>

                                                                )

                                                            ) : (

                                                                <span className="text-muted">
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* ACTION */}
                                                        <td className="text-end">

                                                            {isSuccessful && !applied ? (

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() =>
                                                                        handleReconcilePayment(
                                                                            payment
                                                                        )
                                                                    }
                                                                    disabled={isReconciling}
                                                                >

                                                                    {isReconciling ? (

                                                                        <>
                                                                            <span
                                                                                className="spinner-border spinner-border-sm me-1"
                                                                                role="status"
                                                                                aria-hidden="true"
                                                                            />

                                                                            Reconciling...
                                                                        </>

                                                                    ) : (

                                                                        <>
                                                                            <FiCreditCard className="me-1" />
                                                                            Reconcile
                                                                        </>

                                                                    )}

                                                                </button>

                                                            ) : (

                                                                <span className="text-muted">
                                                                    No action
                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>
                                                );

                                            })}

                                        </tbody>

                            </table>
                                    {paymentTotalPages > 0 && (

                                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">

                                            {/* SUMMARY */}

                                            <div className="text-muted small">

                                                Showing{" "}

                                                {((paymentPage - 1) * paymentPageSize) + 1}

                                                {" - "}

                                                {Math.min(
                                                    paymentPage * paymentPageSize,
                                                    paymentTotalCount
                                                )}

                                                {" of "}

                                                {paymentTotalCount}

                                                {" payments"}

                                            </div>


                                            {/* PAGE SIZE */}

                                            <div className="d-flex align-items-center gap-2">

                                                <span className="text-muted small">
                                                    Per page
                                                </span>

                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{
                                                        width: "80px"
                                                    }}
                                                    value={paymentPageSize}
                                                    onChange={(e) => {

                                                        const newPageSize =
                                                            Number(e.target.value);

                                                        setPaymentPageSize(
                                                            newPageSize
                                                        );

                                                        loadSubscriptionPayments(
                                                            1,
                                                            newPageSize
                                                        );

                                                    }}
                                                >

                                                    <option value={10}>
                                                        10
                                                    </option>

                                                    <option value={20}>
                                                        20
                                                    </option>

                                                    <option value={50}>
                                                        50
                                                    </option>

                                                    <option value={100}>
                                                        100
                                                    </option>

                                                </select>


                                                {/* PREVIOUS */}

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    disabled={
                                                        paymentsLoading ||
                                                        paymentPage <= 1
                                                    }
                                                    onClick={() =>
                                                        loadSubscriptionPayments(
                                                            paymentPage - 1,
                                                            paymentPageSize
                                                        )
                                                    }
                                                >
                                                    Previous
                                                </button>


                                                {/* PAGE */}

                                                <span className="small px-2">

                                                    Page{" "}

                                                    <strong>
                                                        {paymentPage}
                                                    </strong>

                                                    {" "}of{" "}

                                                    <strong>
                                                        {paymentTotalPages}
                                                    </strong>

                                                </span>


                                                {/* NEXT */}

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary"
                                                    disabled={
                                                        paymentsLoading ||
                                                        paymentPage >=
                                                        paymentTotalPages
                                                    }
                                                    onClick={() =>
                                                        loadSubscriptionPayments(
                                                            paymentPage + 1,
                                                            paymentPageSize
                                                        )
                                                    }
                                                >
                                                    Next
                                                </button>

                                            </div>

                                        </div>

                                    )}
                        </div>

                    )}

                </div>

            </div>


            {/* =====================================================
                COMPANY INFORMATION
            ===================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white border-bottom">

                    <h5 className="mb-0">
                        Company Information
                    </h5>

                </div>


                <div className="card-body">

                    <div className="row g-4">

                        {/* COMPANY NAME */}

                        <div className="col-md-6">

                            <div className="text-muted small">
                                Company Name
                            </div>

                            <div className="fw-semibold">
                                {company.name || "-"}
                            </div>

                        </div>


                        {/* OWNER */}

                        <div className="col-md-6">

                            <div className="text-muted small">
                                Owner
                            </div>

                            <div className="fw-semibold">
                                {company.ownerName || "-"}
                            </div>

                            <div className="text-muted small">
                                {company.ownerEmail || "-"}
                            </div>

                        </div>


                        {/* CREATED */}

                        <div className="col-md-6">

                            <div className="text-muted small">
                                Created
                            </div>

                            <div className="fw-semibold">
                                {formatDate(
                                    company.createdAt
                                )}
                            </div>

                        </div>


                        {/* STATUS */}

                        <div className="col-md-6">

                            <div className="text-muted small">
                                Status
                            </div>

                            <div className="fw-semibold">

                                {company.isActive
                                    ? "Active"
                                    : "Inactive"}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                COMPANY ADMINISTRATION
            ===================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white border-bottom">

                    <h5 className="mb-1">
                        Company Administration
                    </h5>

                    <small className="text-muted">
                        Manage company status and review company information.
                    </small>

                </div>


                <div className="card-body">

                    <div className="row g-3">

                        {/* =================================================
                            COMPANY USERS
                        ================================================= */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 text-start p-3 h-100"
                                onClick={() =>
                                    navigate(
                                        `/superadmin/companies/${companyId}/users`
                                    )
                                }
                            >

                                <FiUsers className="me-2" />

                                <strong>
                                    Company Users
                                </strong>

                                <div className="small text-muted mt-1">
                                    View users, roles, and account status.
                                </div>

                            </button>

                        </div>


                        {/* =================================================
                            SUBSCRIPTION HISTORY
                        ================================================= */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 text-start p-3 h-100"
                                onClick={() =>
                                    navigate(
                                        `/superadmin/companies/${companyId}/subscriptions`
                                    )
                                }
                            >

                                <FiCreditCard className="me-2" />

                                <strong>
                                    Subscription History
                                </strong>

                                <div className="small text-muted mt-1">
                                    View plans, payments, renewals, and subscription changes.
                                </div>

                            </button>

                        </div>


                        {/* =================================================
                            ACTIVITY REPORTS
                        ================================================= */}

                        <div className="col-md-4">

                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100 text-start p-3 h-100"
                                onClick={() =>
                                    navigate(
                                        `/superadmin/companies/${companyId}/activity`
                                    )
                                }
                            >

                                <FiActivity className="me-2" />

                                <strong>
                                    Activity Reports
                                </strong>

                                <div className="small text-muted mt-1">
                                    Review important activity and usage within the company.
                                </div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                COMPANY STATUS MANAGEMENT
            ===================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-bottom">

                    <h5 className="mb-1">
                        Company Status
                    </h5>

                    <small className="text-muted">
                        Control whether this company is active on the platform.
                    </small>

                </div>


                <div className="card-body">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                        <div>

                            <div className="fw-semibold">

                                {company.isActive
                                    ? "Company is currently active"
                                    : "Company is currently inactive"}

                            </div>

                            <div className="text-muted small mt-1">

                                {company.isActive
                                    ? "The company is currently enabled on the platform."
                                    : "The company has been disabled on the platform."}

                            </div>

                        </div>


                        <button
                            type="button"
                            className={`btn ${company.isActive
                                    ? "btn-outline-danger"
                                    : "btn-outline-success"
                                }`}
                            disabled={changingStatus}
                            onClick={
                                handleStatusChange
                            }
                        >

                            {changingStatus ? (

                                <>

                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                    {company.isActive
                                        ? "Deactivating..."
                                        : "Reactivating..."}

                                </>

                            ) : company.isActive ? (

                                <>

                                    <FiXCircle className="me-2" />

                                    Deactivate Company

                                </>

                            ) : (

                                <>

                                    <FiCheckCircle className="me-2" />

                                    Reactivate Company

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}