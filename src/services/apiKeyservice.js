import http from "../api/http";

// ============================================================
// GET API KEYS
// ============================================================

export async function getApiKeys() {

    const response =
        await http.get(
            "/api-keys"
        );

    return response.data;
}


// ============================================================
// CREATE API KEY
// ============================================================

export async function createApiKey(name) {

    const response =
        await http.post(
            "/api-keys",
            {
                name
            }
        );

    return response.data;
}


// ============================================================
// REVOKE API KEY
// ============================================================

export async function revokeApiKey(id) {

    await http.delete(
        `/api-keys/${id}`
    );
}


// ============================================================
// REGENERATE API KEY
// ============================================================

export async function regenerateApiKey(id) {

    const response =
        await http.post(
            `/api-keys/${id}/regenerate`
        );

    return response.data;
}