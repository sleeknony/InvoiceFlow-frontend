import http from "../api/http";

export async function getSubscriptionPlans() {
    const response = await http.get(
        "/subscription/plans"
    );

    return response.data;
}


// =====================================================
// CREATE SUBSCRIPTION CHECKOUT
// =====================================================

export async function createSubscriptionCheckout(
    plan,
    billingCycle
) {
    const response =
        await http.post(
            "/subscription/checkout",
            {
                plan,
                billingCycle
            }
        );

    return response.data;
}