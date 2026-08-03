import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getSubscriptionPlans
} from "../../services/subscriptionService";

import "./Pricing.css";

export default function Pricing() {

    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [billingCycle, setBillingCycle] =
        useState("monthly");

    const [loading, setLoading] =
        useState(true);

    // ============================================================
    // LOAD PLANS
    // ============================================================

    useEffect(() => {
        loadPlans();
    }, []);

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

    // ============================================================
    // PRICE
    // ============================================================

    function getPrice(plan) {

        return billingCycle === "monthly"
            ? plan.monthlyPrice
            : plan.annualPrice;
    }

    function formatPrice(amount, currency) {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: currency || "NGN",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).format(amount ?? 0);
    }

    // ============================================================
    // DESCRIPTION
    // ============================================================

    function getPlanDescription(planName) {

        switch (planName?.toLowerCase()) {

            case "free":
                return "Essential tools for getting started with InvoiceFlow.";

            case "professional":
                return "More flexibility for professionals and growing businesses.";

            case "business":
                return "Advanced capabilities for businesses and teams.";

            case "enterprise":
                return "Full InvoiceFlow capabilities for larger organizations.";

            default:
                return "";
        }
    }

    // ============================================================
    // LIMIT FORMATTER
    // ============================================================

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
            Number(value ?? 0);

        return `${safeValue.toLocaleString()} ${safeValue === 1
                ? singular
                : plural
            }`;
    }

    // ============================================================
    // CORE PLAN LIMITS
    // ============================================================

    function getPlanLimits(plan) {

        return [

            {
                key: "documents",

                label:
                    formatLimit(
                        plan.documentLimit,
                        plan.unlimitedDocuments,
                        "document",
                        "documents"
                    )
            },

            {
                key: "pages",

                label:
                    plan.unlimitedDocumentPages
                        ? "Unlimited pages per document"
                        : `${plan.documentPageLimit ?? 0} ${plan.documentPageLimit === 1
                            ? "page"
                            : "pages"
                        } per document`
            },

            {
                key: "templates",

                label:
                    plan.unlimitedTemplates
                        ? "All built-in templates"
                        : `${plan.templateLimit ?? 0} built-in ${plan.templateLimit === 1
                            ? "template"
                            : "templates"
                        }`
            },

            {
                key: "pdf-downloads",

                label:
                    formatLimit(
                        plan.pdfDownloadLimit,
                        plan.unlimitedPdfDownloads,
                        "PDF download",
                        "PDF downloads"
                    )
            },

            {
                key: "emails",

                label:
                    formatLimit(
                        plan.emailLimit,
                        plan.unlimitedEmails,
                        "document email",
                        "document emails"
                    )
            },

            {
                key: "document-conversions",

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

    // ============================================================
    // FEATURES
    // ============================================================

    /*
     * Some features are already represented more clearly
     * by the limits above.
     *
     * Example:
     *
     * Feature.PdfDownload
     *      -> whether PDF downloading is allowed
     *
     * PdfDownloadLimit
     *      -> how many downloads are available
     *
     * We show the quantitative limit rather than repeating:
     * "PDF Downloads".
     */

    const limitRepresentedFeatures = [
        "CreateDocuments",
        "PdfDownload",
        "EmailDocuments",
        "DocumentConversion"
    ];

    function getAdditionalFeatures(plan) {

        if (!Array.isArray(plan.features)) {
            return [];
        }

        return plan.features
            .filter(feature =>
                !limitRepresentedFeatures.includes(
                    feature.key
                )
            )
            .map(feature => ({
                key: feature.key,

                label: feature.label,

                available:
                    Boolean(feature.available)
            }));
    }

    // ============================================================
    // PLAN ACTION
    // ============================================================

    function handlePlan(plan) {

        if (plan.isCurrentPlan) {
            return;
        }

        const planName =
            plan.name?.toLowerCase();

        if (planName === "free") {

            /*
             * Downgrade flow will be implemented
             * separately.
             */

            toast(
                "Plan downgrade will be available from subscription management."
            );

            return;
        }

        if (planName === "enterprise") {

            /*
             * We can later replace this with
             * an Enterprise contact/sales flow.
             */

            toast(
                "Enterprise subscription flow will be connected next."
            );

            return;
        }

        /*
         * BATCH 3
         *
         * Flutterwave checkout starts here.
         *
         * We will send:
         *
         * plan.plan
         * billingCycle
         *
         * The backend will determine the actual
         * amount. React must never be trusted
         * to determine the amount charged.
         */

        toast(
            `${plan.name} ${billingCycle} checkout will be connected in Batch 3.`
        );
    }

    // ============================================================
    // PLAN ORDER
    // ============================================================

    const orderedPlans =
        useMemo(() => {

            const order = {
                free: 1,
                professional: 2,
                business: 3,
                enterprise: 4
            };

            return [...plans].sort(
                (a, b) =>
                    (
                        order[
                        a.name?.toLowerCase()
                        ] ?? 99
                    ) -
                    (
                        order[
                        b.name?.toLowerCase()
                        ] ?? 99
                    )
            );

        }, [plans]);

    // ============================================================
    // LOADING
    // ============================================================

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

    // ============================================================
    // NO PLANS
    // ============================================================

    if (orderedPlans.length === 0) {

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

    // ============================================================
    // UI
    // ============================================================

    return (

        <div className="pricing-page">

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="pricing-header">

                <button
                    type="button"
                    className="pricing-back"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left" />

                    Back
                </button>

                <div className="pricing-heading">

                    <span className="pricing-eyebrow">
                        InvoiceFlow Plans
                    </span>

                    <h1>
                        Choose the plan that works for you
                    </h1>

                    <p>
                        Start free and upgrade as your
                        business grows.
                    </p>

                </div>

                {/* ================================================
                    BILLING TOGGLE
                ================================================ */}

                <div className="billing-toggle">

                    <button
                        type="button"
                        className={
                            billingCycle === "monthly"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setBillingCycle("monthly")
                        }
                    >
                        Monthly
                    </button>

                    <button
                        type="button"
                        className={
                            billingCycle === "annual"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setBillingCycle("annual")
                        }
                    >
                        Annual
                    </button>

                </div>

            </div>

            {/* ====================================================
                PLAN CARDS
            ==================================================== */}

            <div className="pricing-grid">

                {orderedPlans.map(plan => {

                    const planName =
                        plan.name?.toLowerCase();

                    const isProfessional =
                        planName === "professional";

                    const isEnterprise =
                        planName === "enterprise";

                    const isFree =
                        planName === "free";

                    const price =
                        getPrice(plan);

                    const limits =
                        getPlanLimits(plan);

                    const features =
                        getAdditionalFeatures(plan);

                    return (

                        <div
                            key={plan.plan}
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

                            {/* ====================================
                                BADGES
                            ==================================== */}

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

                            {/* ====================================
                                PLAN NAME
                            ==================================== */}

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

                            {/* ====================================
                                PRICE
                            ==================================== */}

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

                            {/* ====================================
                                PLAN LIMITS
                            ==================================== */}

                            <div className="pricing-section-title">
                                Included
                            </div>

                            <div className="pricing-features">

                                {limits.map(item => (

                                    <div
                                        className="pricing-feature"
                                        key={item.key}
                                    >

                                        <span className="feature-check">
                                            <i className="bi bi-check-lg" />
                                        </span>

                                        <span>
                                            {item.label}
                                        </span>

                                    </div>

                                ))}

                            </div>

                            {/* ====================================
                                FEATURE ENTITLEMENTS
                            ==================================== */}

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
                                                    <i
                                                        className={
                                                            feature.available
                                                                ? "bi bi-check-lg"
                                                                : "bi bi-x-lg"
                                                        }
                                                    />
                                                </span>

                                                <span>
                                                    {feature.label}
                                                </span>

                                            </div>

                                        ))}

                                    </div>
                                </>

                            )}

                            {/* ====================================
                                ACTION
                            ==================================== */}

                            <div className="pricing-card-action">

                                {plan.isCurrentPlan ? (

                                    <button
                                        type="button"
                                        className="btn btn-secondary w-100"
                                        disabled
                                    >
                                        Current Plan
                                    </button>

                                ) : isFree ? (

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={() =>
                                            handlePlan(plan)
                                        }
                                    >
                                        Free Plan
                                    </button>

                                ) : isEnterprise ? (

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100"
                                        onClick={() =>
                                            handlePlan(plan)
                                        }
                                    >
                                        Contact Sales
                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={() =>
                                            handlePlan(plan)
                                        }
                                    >
                                        Upgrade to {plan.name}
                                    </button>

                                )}

                            </div>

                        </div>

                    );
                })}

            </div>

        </div>
    );
}