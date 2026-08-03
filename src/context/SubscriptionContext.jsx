import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import http from "../api/http";
import { useAuth } from "./useAuth";

export const SubscriptionContext =
    createContext(null);


export function SubscriptionProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [subscription, setSubscription] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD CURRENT SUBSCRIPTION
    // =====================================================

    const refreshSubscription =
        useCallback(async () => {

            if (!isAuthenticated) {
                setSubscription(null);
                setError("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await http.get(
                        "/subscription/current"
                    );

                setSubscription(
                    response.data
                );
            }
            catch (err) {
                console.error(
                    "Unable to load subscription:",
                    err
                );

                setSubscription(null);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load subscription information."
                );
            }
            finally {
                setLoading(false);
            }

        }, [isAuthenticated]);


    // =====================================================
    // LOAD WHEN AUTHENTICATION CHANGES
    // =====================================================

    useEffect(() => {
        refreshSubscription();
    }, [refreshSubscription]);


    // =====================================================
    // PLAN VALUES
    //
    // These use the backend-provided PlanName.
    // We are NOT recreating SubscriptionPlan in React.
    // =====================================================

    const planName =
        subscription?.planName || null;

    const normalizedPlanName =
        planName?.trim().toLowerCase() || "";

    const isFree =
        normalizedPlanName === "free";

    const isEnterprise =
        normalizedPlanName === "enterprise";

    const isPaid =
        Boolean(
            subscription?.isActive &&
            planName &&
            !isFree
        );

    const isTrial =
        Boolean(
            subscription?.isTrial
        );


    // =====================================================
    // FEATURE ACCESS
    //
    // The backend remains the source of truth.
    // React only reads the feature availability returned
    // with the current subscription.
    // =====================================================

    const hasFeature =
        useCallback(
            (featureKey) => {

                if (
                    !featureKey ||
                    !subscription
                ) {
                    return false;
                }

                const features =
                    Array.isArray(
                        subscription.features
                    )
                        ? subscription.features
                        : [];

                const normalizedFeatureKey =
                    String(featureKey)
                        .trim()
                        .toLowerCase();

                const feature =
                    features.find(item =>
                        String(
                            item?.key ?? ""
                        )
                            .trim()
                            .toLowerCase() ===
                        normalizedFeatureKey
                    );

                return (
                    feature?.available === true
                );

            },
            [subscription]
        );


    // =====================================================
    // PLAN ACTION LABEL
    // =====================================================

    const planActionLabel =
        !subscription
            ? "Manage Subscription"
            : isEnterprise
                ? "Manage Plan"
                : isFree
                    ? "Upgrade Plan"
                    : "Change Plan";


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value =
        useMemo(
            () => ({
                subscription,

                loading,

                error,

                planName,

                isFree,

                isPaid,

                isEnterprise,

                isTrial,

                planActionLabel,

                hasFeature,

                refreshSubscription
            }),
            [
                subscription,
                loading,
                error,
                planName,
                isFree,
                isPaid,
                isEnterprise,
                isTrial,
                planActionLabel,
                hasFeature,
                refreshSubscription
            ]
        );


    return (
        <SubscriptionContext.Provider
            value={value}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}