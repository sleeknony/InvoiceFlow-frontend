import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
    getSubscriptionPlans
} from "../../services/subscriptionService";

import http from "../../api/http";
import { useSubscription } from "../../context/useSubscription";

import Footer from "../../components/Footer";
import { FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import "./Pricing.css";


// ============================================================
// PLAN ORDER
// ============================================================

const PLAN_ORDER = {
    free: 1,
    professional: 2,
    business: 3,
    enterprise: 4
};


// ============================================================
// COMPONENT
// ============================================================

export default function Pricing() {

    const navigate = useNavigate();


    // =========================================================
    // SUBSCRIPTION CONTEXT
    // =========================================================

    const {
        subscription,
        refreshSubscription
    } = useSubscription();


    // =========================================================
    // STATE
    // =========================================================

    const [plans, setPlans] =
        useState([]);

    const [billingCycle, setBillingCycle] =
        useState("monthly");

    const [loading, setLoading] =
        useState(true);

    const [actionLoadingPlan, setActionLoadingPlan] =
        useState(null);


    // =========================================================
    // LOAD PLANS
    // =========================================================

    useEffect(() => {

        loadPlans();

    }, []);


    // =========================================================
    // ALIGN DISPLAY BILLING CYCLE WITH CURRENT SUBSCRIPTION
    // =========================================================

    useEffect(() => {

        const currentCycle =
            subscription?.billingCycleName
                ?.toLowerCase();


        if (
            currentCycle === "monthly" ||
            currentCycle === "annual"
        ) {
            setBillingCycle(currentCycle);
        }

    }, [subscription?.billingCycleName]);


    async function loadPlans() {

        try {

            setLoading(true);


            const data =
                await getSubscriptionPlans();


            setPlans(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Unable to load subscription plans:",
                error
            );


            toast.error(
                "Unable to load subscription plans."
            );

        }
        finally {

            setLoading(false);

        }
    }


    // =========================================================
    // PRICE
    // =========================================================

    function getPrice(plan) {

        return billingCycle === "monthly"
            ? plan.monthlyPrice
            : plan.annualPrice;
    }


    function formatPrice(
        amount,
        currency
    ) {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style:
                    "currency",

                currency:
                    currency || "NGN",

                minimumFractionDigits:
                    0,

                maximumFractionDigits:
                    0
            }
        ).format(
            amount ?? 0
        );
    }


    // =========================================================
    // DATE
    // =========================================================

    function formatDate(value) {

        if (!value) {
            return "the end of your current billing period";
        }


        const date =
            new Date(value);


        if (Number.isNaN(
            date.getTime()
        )) {
            return "the end of your current billing period";
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


    // =========================================================
    // DESCRIPTION
    // =========================================================

    function getPlanDescription(
        planName
    ) {

        switch (
        planName?.toLowerCase()
        ) {

            case "free":

                return "Essential tools for getting started with invoiceNgine.";

            case "professional":

                return "More flexibility for professionals and growing businesses.";

            case "business":

                return "Advanced capabilities for businesses and teams.";

            case "enterprise":

                return "Full invoiceNgine capabilities for larger organizations.";

            default:

                return "";
        }
    }


    // =========================================================
    // LIMIT FORMATTER
    // =========================================================

    function formatLimit(
        value,
        unlimited,
        singular,
        plural
    ) {

        if (unlimited) {

            return `Unlimited ${plural}`;
        }


        const safeValue =
            Number(
                value ?? 0
            );


        return `${safeValue.toLocaleString()} ${safeValue === 1
            ? singular
            : plural
            }`;
    }


    // =========================================================
    // CORE PLAN LIMITS
    // =========================================================

    function getPlanLimits(plan) {

        return [

            {
                key:
                    "users",

                label:
                    plan.unlimitedUsers
                        ? "Unlimited users"
                        : `${plan.userLimit ?? 0} ${plan.userLimit === 1
                            ? "user"
                            : "users"
                        }`
            },

            {
                key:
                    "documents",

                label:
                    formatLimit(
                        plan.documentLimit,
                        plan.unlimitedDocuments,
                        "document",
                        "documents"
                    )
            },

            {
                key:
                    "pages",

                label:
                    plan.unlimitedDocumentPages
                        ? "Unlimited pages per document"
                        : `${plan.documentPageLimit ?? 0} ${plan.documentPageLimit === 1
                            ? "page"
                            : "pages"
                        } per document`
            },

            {
                key:
                    "templates",

                label:
                    plan.unlimitedTemplates
                        ? "All built-in templates"
                        : `${plan.templateLimit ?? 0} built-in ${plan.templateLimit === 1
                            ? "template"
                            : "templates"
                        }`
            },

            {
                key:
                    "pdf-downloads",

                label:
                    formatLimit(
                        plan.pdfDownloadLimit,
                        plan.unlimitedPdfDownloads,
                        "PDF download",
                        "PDF downloads"
                    )
            },

            {
                key:
                    "emails",

                label:
                    formatLimit(
                        plan.emailLimit,
                        plan.unlimitedEmails,
                        "document email",
                        "document emails"
                    )
            },

            {
                key:
                    "document-conversions",

                label:
                    formatLimit(
                        plan.documentConversionLimit,
                        plan.unlimitedDocumentConversionLimit,
                        "document conversion",
                        "document conversions"
                    )
            }

        ];
    }


    // =========================================================
    // FEATURES
    // =========================================================

    const limitRepresentedFeatures = [

        "CreateDocuments",
        "PdfDownload",
        "EmailDocuments",
        "DocumentConversion"

    ];


    const hiddenFeatures = [

        "ApiAccess",
        "CustomTemplates",
        "MultipleCompanies"

    ];


    function getAdditionalFeatures(plan) {

        if (!Array.isArray(
            plan.features
        )) {

            return [];
        }


        return plan.features

            .filter(feature => {

                if (
                    limitRepresentedFeatures.includes(
                        feature.key
                    )
                ) {
                    return false;
                }


                if (
                    hiddenFeatures.includes(
                        feature.key
                    )
                ) {
                    return false;
                }


                return true;

            })

            .map(feature => ({

                key:
                    feature.key,

                label:
                    feature.label,

                available:
                    Boolean(
                        feature.available
                    )

            }));
    }


    // =========================================================
    // PLAN ACTION
    // =========================================================

    function getPlanAction(plan) {

        if (plan.isCurrentPlan) {
            return "current";
        }


        const currentPlan =
            plans.find(
                x =>
                    x.isCurrentPlan
            );


        if (!currentPlan) {
            return "upgrade";
        }


        const currentOrder =
            PLAN_ORDER[
            currentPlan.name
                ?.toLowerCase()
            ] ?? 0;


        const targetOrder =
            PLAN_ORDER[
            plan.name
                ?.toLowerCase()
            ] ?? 0;


        return targetOrder >
            currentOrder
            ? "upgrade"
            : "downgrade";
    }


    // =========================================================
    // SCHEDULED TARGET
    // =========================================================

    function isScheduledPlan(plan) {

        if (
            !subscription?.scheduledPlan
        ) {
            return false;
        }


        return Number(
            subscription.scheduledPlan
        ) === Number(
            plan.plan
        );
    }


    // =========================================================
    // UPGRADE
    // =========================================================

    async function handleUpgrade(plan) {

        try {

            setActionLoadingPlan(
                plan.plan
            );


            const response =
                await http.post(
                    "/subscription/checkout",
                    {
                        plan:
                            plan.plan,

                        billingCycle:
                            billingCycle ===
                                "monthly"
                                ? 1
                                : 2
                    }
                );


            const data =
                response.data;


            if (!data?.checkoutUrl) {

                throw new Error(
                    "Checkout URL was not returned by the server."
                );
            }


            window.location.href =
                data.checkoutUrl;

        }
        catch (error) {

            console.error(
                "Subscription checkout failed:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Unable to start subscription checkout."
            );


            setActionLoadingPlan(
                null
            );
        }
    }


    // =========================================================
    // DOWNGRADE
    // =========================================================

    async function handleDowngrade(plan) {

        const targetName =
            plan.name ||
            "selected plan";


        const effectiveDate =
            formatDate(
                subscription?.endDate
            );


        const isFreeTarget =
            targetName
                .toLowerCase() ===
            "free";


        const currentBillingCycle =
            subscription
                ?.billingCycleName;


        const result =
            await Swal.fire({

                title:
                    `Downgrade to ${targetName}?`,

                html:
                    isFreeTarget
                        ? `
                            <div style="text-align:left;">
                                <p>
                                    Your current plan will remain active until
                                    <strong>${effectiveDate}</strong>.
                                </p>
                                <p>
                                    After that date, your subscription will change
                                    to the Free plan and no renewal payment will be charged.
                                </p>
                            </div>
                          `
                        : `
                            <div style="text-align:left;">
                                <p>
                                    Your current plan will remain active until
                                    <strong>${effectiveDate}</strong>.
                                </p>
                                <p>
                                    On that date, invoiceNgine will charge the
                                    ${targetName} price using your saved payment authorization.
                                </p>
                                ${currentBillingCycle
                            ? `
                                    <p>
                                        Your current
                                        <strong>${currentBillingCycle}</strong>
                                        billing cycle will continue.
                                    </p>
                                  `
                            : ""
                        }
                            </div>
                          `,

                icon:
                    "warning",

                showCancelButton:
                    true,

                confirmButtonText:
                    `Schedule ${targetName} downgrade`,

                cancelButtonText:
                    "Keep current plan",

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

            setActionLoadingPlan(
                plan.plan
            );


            // IMPORTANT:
            //
            // Backend endpoint currently expects:
            //
            // [FromBody] SubscriptionPlan plan
            //
            // Therefore the request body is the enum
            // value itself, not { plan: value }.

            await http.post("/subscription/downgrade", {
                plan: plan.plan
            });


            await Promise.all([
                refreshSubscription(),
                loadPlans()
            ]);


            toast.success(
                `Downgrade to ${targetName} scheduled successfully.`
            );


            await Swal.fire({

                title:
                    "Downgrade Scheduled",

                html:
                    `
                        <p>
                            Your current subscription remains active until
                            <strong>${effectiveDate}</strong>.
                        </p>
                        <p>
                            It will then change to
                            <strong>${targetName}</strong>.
                        </p>
                    `,

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
                "Unable to schedule subscription downgrade:",
                error
            );


            await Swal.fire({

                title:
                    "Downgrade Failed",

                text:
                    error?.response?.data?.message ||
                    error?.response?.data?.title ||
                    "Unable to schedule the subscription downgrade.",

                icon:
                    "error",

                confirmButtonText:
                    "OK",

                confirmButtonColor:
                    "#dc3545"
            });

        }
        finally {

            setActionLoadingPlan(
                null
            );
        }
    }


    // =========================================================
    // HANDLE PLAN
    // =========================================================

    async function handlePlan(plan) {

        if (
            plan.isCurrentPlan ||
            isScheduledPlan(plan)
        ) {
            return;
        }


        const action =
            getPlanAction(plan);


        if (action === "downgrade") {

            await handleDowngrade(
                plan
            );

            return;
        }


        await handleUpgrade(
            plan
        );
    }


    // =========================================================
    // ORDER PLANS
    // =========================================================

    const orderedPlans =
        useMemo(() => {

            return [...plans].sort(
                (a, b) =>
                    (
                        PLAN_ORDER[
                        a.name
                            ?.toLowerCase()
                        ] ?? 99
                    )
                    -
                    (
                        PLAN_ORDER[
                        b.name
                            ?.toLowerCase()
                        ] ?? 99
                    )
            );

        }, [plans]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="pricing-loading">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />


                <div className="mt-3">
                    Loading plans...
                </div>

            </div>
        );
    }


    // =========================================================
    // NO PLANS
    // =========================================================

    if (
        orderedPlans.length === 0
    ) {

        return (

            <div className="pricing-loading">

                <div className="mb-3">
                    No subscription plans are available.
                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadPlans}
                >
                    Try Again
                </button>

            </div>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="pricing-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="pricing-header">

                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="pricing-back"*/}
                {/*    onClick={() =>*/}
                {/*        navigate(-1)*/}
                {/*    }*/}
                {/*    disabled={*/}
                {/*        actionLoadingPlan !==*/}
                {/*        null*/}
                {/*    }*/}
                {/*>*/}

                {/*    <i className="bi bi-arrow-left" />*/}

                {/*    Back*/}

                {/*</button>*/}
                <button
                    type="button"
                    className="pricing-back"
                    onClick={() => navigate(-1)}
                    disabled={actionLoadingPlan !== null}
                >
                    <FiArrowLeft className="pricing-back-icon" />
                    <span>Back</span>
                </button>

                <div className="pricing-heading">

                    <span className="pricing-eyebrow">
                        invoiceNgine Plans
                    </span>


                    <h1>
                        Choose the plan that works for you
                    </h1>


                    <p>
                        Start free and upgrade as your
                        business grows.
                    </p>

                </div>


                {/* =============================================
                    BILLING TOGGLE
                ============================================= */}

                <div className="billing-toggle">

                    <button
                        type="button"
                        className={
                            billingCycle ===
                                "monthly"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setBillingCycle(
                                "monthly"
                            )
                        }
                        disabled={
                            actionLoadingPlan !==
                            null
                        }
                    >
                        Monthly
                    </button>


                    <button
                        type="button"
                        className={
                            billingCycle ===
                                "annual"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setBillingCycle(
                                "annual"
                            )
                        }
                        disabled={
                            actionLoadingPlan !==
                            null
                        }
                    >
                        Annual
                    </button>

                </div>

            </div>


            {/* =================================================
                SCHEDULED CHANGE NOTICE
            ================================================= */}

            {subscription?.scheduledPlan && (

                <div
                    className="alert alert-info"
                    role="alert"
                >

                    <strong>
                        Plan change scheduled.
                    </strong>

                    {" "}

                    Your current plan remains active until{" "}

                    <strong>
                        {formatDate(
                            subscription
                                .scheduledPlanDate ||
                            subscription
                                .endDate
                        )}
                    </strong>,

                    {" "}when it will change to{" "}

                    <strong>
                        {subscription
                            .scheduledPlanName ||
                            "the selected plan"}
                    </strong>.

                </div>

            )}


            {/* =================================================
                PLAN CARDS
            ================================================= */}

            <div className="pricing-grid">

                {orderedPlans.map(
                    plan => {

                        const planName =
                            plan.name
                                ?.toLowerCase();


                        const isProfessional =
                            planName ===
                            "professional";


                        const isFree =
                            planName ===
                            "free";


                        const price =
                            getPrice(plan);


                        const limits =
                            getPlanLimits(plan);


                        const features =
                            getAdditionalFeatures(
                                plan
                            );


                        const action =
                            getPlanAction(plan);


                        const scheduled =
                            isScheduledPlan(plan);


                        const actionLoading =
                            actionLoadingPlan ===
                            plan.plan;


                        return (

                            <div
                                key={
                                    plan.plan
                                }
                                className={[
                                    "pricing-card",

                                    isProfessional
                                        ? "pricing-card-featured"
                                        : "",

                                    plan.isCurrentPlan
                                        ? "pricing-card-current"
                                        : ""
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >


                                {/* =============================
                                    BADGES
                                ============================= */}

                                {isProfessional && (

                                    <div className="popular-badge">
                                        Popular
                                    </div>

                                )}


                                {plan.isCurrentPlan && (

                                    <div className="current-badge">
                                        Current Plan
                                    </div>

                                )}


                                {scheduled && (

                                    <div className="current-badge">
                                        Scheduled
                                    </div>

                                )}


                                {/* =============================
                                    PLAN NAME
                                ============================= */}

                                <div className="pricing-card-top">

                                    <h3>
                                        {plan.name}
                                    </h3>


                                    <p>
                                        {getPlanDescription(
                                            plan.name
                                        )}
                                    </p>

                                </div>


                                {/* =============================
                                    PRICE
                                ============================= */}

                                <div className="pricing-price">

                                    {isFree ? (

                                        <>

                                            <span className="price-main">
                                                Free
                                            </span>

                                            <span className="price-period">
                                                forever
                                            </span>

                                        </>

                                    ) : (

                                        <>

                                            <span className="price-main">

                                                {formatPrice(
                                                    price,
                                                    plan.currency
                                                )}

                                            </span>


                                            <span className="price-period">

                                                /

                                                {billingCycle ===
                                                    "monthly"
                                                    ? "month"
                                                    : "year"}

                                            </span>

                                        </>

                                    )}

                                </div>


                                <div className="pricing-divider" />


                                {/* =============================
                                    LIMITS
                                ============================= */}

                                <div className="pricing-section-title">
                                    Included
                                </div>


                                <div className="pricing-features">

                                    {limits.map(
                                        item => (

                                            <div
                                                className="pricing-feature"
                                                key={item.key}
                                            >

                                                <span className="feature-check">
                                                    <FiCheck />
                                                </span>

                                                <span>
                                                    {item.label}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* =============================
                                    FEATURES
                                ============================= */}

                                {features.length > 0 && (

                                    <>

                                        <div className="pricing-divider pricing-divider-small" />


                                        <div className="pricing-section-title">
                                            Features
                                        </div>


                                        <div className="pricing-features">

                                            {features.map(feature => (

                                                <div
                                                    className={`pricing-feature ${feature.available
                                                            ? "pricing-feature-available"
                                                            : "pricing-feature-unavailable"
                                                        }`}
                                                    key={feature.key}
                                                >

                                                    <span
                                                        className={`feature-status ${feature.available
                                                                ? "feature-status-available"
                                                                : "feature-status-unavailable"
                                                            }`}
                                                    >
                                                        {feature.available ? <FiCheck /> : <FiX />}
                                                    </span>

                                                    <span>
                                                        {feature.label}
                                                    </span>

                                                </div>

                                            ))}

                                        </div>

                                    </>

                                )}


                                {/* =============================
                                    ACTION
                                ============================= */}

                                <div className="pricing-card-action">

                                    {plan.isCurrentPlan ? (

                                        <button
                                            type="button"
                                            className="btn btn-secondary w-100"
                                            disabled
                                        >
                                            Current Plan
                                        </button>

                                    ) : scheduled ? (

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary w-100"
                                            disabled
                                        >
                                            Downgrade Scheduled
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            className={
                                                action ===
                                                    "downgrade"
                                                    ? "btn btn-outline-primary w-100"
                                                    : "btn btn-primary w-100"
                                            }
                                            onClick={() =>
                                                handlePlan(
                                                    plan
                                                )
                                            }
                                            disabled={
                                                actionLoadingPlan !==
                                                null
                                            }
                                        >

                                            {actionLoading
                                                ? action ===
                                                    "downgrade"
                                                    ? "Scheduling..."
                                                    : "Opening Checkout..."
                                                : action ===
                                                    "downgrade"
                                                    ? `Downgrade to ${plan.name}`
                                                    : `Upgrade to ${plan.name}`}

                                        </button>

                                    )}

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            

        </div>
    );
}