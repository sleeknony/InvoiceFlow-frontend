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
// GET API SCOPES
// ============================================================

export async function getApiScopes() {

    const response =
        await http.get(
            "/v1/api-scopes"
        );

    return response.data;
}


// ============================================================
// CREATE API KEY
// ============================================================

export async function createApiKey(name,scopes) {

    const response =
        await http.post(
            "/api-keys",
            {
                name,
                scopes
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