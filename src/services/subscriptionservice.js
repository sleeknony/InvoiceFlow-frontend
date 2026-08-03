import http from "../api/http";

export async function getSubscriptionPlans() {
    const response = await http.get(
        "/subscription/plans"
    );

    return response.data;
}