import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheck, FiCopy, FiKey, FiPlus,FiRefreshCw, FiShield,  FiTrash2,  FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { createApiKey, getApiKeys, getApiScopes, regenerateApiKey, revokeApiKey } from "../../../services/apiKeyService";

import "./Tab.css";

export default function ApiAccessTab() {

    const [apiKeys, setApiKeys] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [creating, setCreating] =
        useState(false);

    const [showCreate, setShowCreate] =
        useState(false);

    const [keyName, setKeyName] =
        useState("");

    const [newSecret, setNewSecret] =
        useState(null);

    const [processingId, setProcessingId] =
        useState(null);

    const [apiScopes, setApiScopes] =
        useState([]);

    const [selectedScopes, setSelectedScopes] =
        useState([]);


    // =========================================================
    // LOAD API KEYS
    // =========================================================

    useEffect(() => {

        loadApiKeys();
        loadApiScopes();

    }, []);

    async function loadApiScopes() {

        try {

            const data =
                await getApiScopes();

            setApiScopes(
                data ?? []
            );

        }
        catch (err) {

            console.error(
                "Unable to load API scopes:",
                err
            );

            toast.error(
                "Unable to load API permissions."
            );

        }
    }

    async function loadApiKeys() {

        try {

            setLoading(true);

            const data =
                await getApiKeys();

            setApiKeys(
                data ?? []
            );

        }
        catch (err) {

            console.error(
                "Unable to load API keys:",
                err
            );

            toast.error(
                "Unable to load API keys."
            );

        }
        finally {

            setLoading(false);

        }
    }

    function toggleScope(scopeName) {

        setSelectedScopes(prev => {

            if (prev.includes(scopeName)) {

                return prev.filter(
                    scope =>
                        scope !== scopeName
                );

            }

            return [
                ...prev,
                scopeName
            ];

        });

    }

    // =========================================================
    // CREATE API KEY
    // =========================================================

    async function handleCreate() {

        const name =
            keyName.trim();

        if (!name) {

            toast.error(
                "Please enter a name for the API key."
            );

            return;
        }

        try {

            setCreating(true);

            const result =
                await createApiKey(
                    name,
                    selectedScopes
                );

            setNewSecret(
                result
            );

            setKeyName("");

            setSelectedScopes([]);

            setShowCreate(false);

            setApiKeys(prev => [
                result.apiKey,
                ...prev
            ]);

            toast.success(
                "API key created successfully."
            );

        }
        catch (err) {

            console.error(
                "API key creation error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Unable to create API key.";

            toast.error(
                message
            );

        }
        finally {

            setCreating(false);

        }
    }


    // =========================================================
    // REVOKE
    // =========================================================

    async function handleRevoke(
        apiKey
    ) {

        const confirmed =
            window.confirm(
                `Are you sure you want to revoke "${apiKey.name}"? This key will immediately stop working.`
            );

        if (!confirmed)
            return;

        try {

            setProcessingId(
                apiKey.id
            );

            await revokeApiKey(
                apiKey.id
            );

            setApiKeys(prev =>
                prev.map(key =>
                    key.id === apiKey.id
                        ? {
                            ...key,
                            isActive: false,
                            revokedAt:
                                new Date().toISOString()
                        }
                        : key
                )
            );

            toast.success(
                "API key revoked."
            );

        }
        catch (err) {

            console.error(
                "API key revoke error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Unable to revoke API key.";

            toast.error(
                message
            );

        }
        finally {

            setProcessingId(
                null
            );

        }
    }


    // =========================================================
    // REGENERATE
    // =========================================================

    async function handleRegenerate(
        apiKey
    ) {

        const confirmed =
            window.confirm(
                `Regenerating "${apiKey.name}" will immediately invalidate the current secret. Continue?`
            );

        if (!confirmed)
            return;

        try {

            setProcessingId(
                apiKey.id
            );

            const result =
                await regenerateApiKey(
                    apiKey.id
                );

            setApiKeys(prev =>
                prev.map(key =>
                    key.id === apiKey.id
                        ? result.apiKey
                        : key
                )
            );

            setNewSecret(
                result
            );

            toast.success(
                "API key regenerated."
            );

        }
        catch (err) {

            console.error(
                "API key regeneration error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                "Unable to regenerate API key.";

            toast.error(
                message
            );

        }
        finally {

            setProcessingId(
                null
            );

        }
    }


    // =========================================================
    // COPY SECRET
    // =========================================================

    async function handleCopySecret() {

        if (!newSecret?.secretKey)
            return;

        try {

            await navigator.clipboard.writeText(
                newSecret.secretKey
            );

            toast.success(
                "API key copied to clipboard."
            );

        }
        catch (err) {

            console.error(err);

            toast.error(
                "Unable to copy API key."
            );

        }
    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    function formatDate(
        value
    ) {

        if (!value)
            return "Never";

        return new Date(
            value
        ).toLocaleString();

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>

            <div className="tab-header">

                <h3 className="tab-title">
                    API Access
                </h3>

                <p className="tab-subtitle">
                    Manage API keys used by external applications
                    to securely access your invoiceNgine workspace.
                </p>

            </div>


            {/* =================================================
                SECURITY NOTICE
            ================================================= */}

            <div className="alert alert-info d-flex gap-3 align-items-start">

                <FiShield
                    size={22}
                    className="mt-1"
                />

                <div>

                    <strong>
                        Secure API access
                    </strong>

                    <div className="mt-1">

                        API keys provide programmatic access
                        to your invoiceNgine company data.
                        Keep your keys private and never
                        expose them in client-side applications.

                    </div>

                </div>

            </div>


            {/* =================================================
                CREATE SECTION
            ================================================= */}

            <div className="settings-section mt-4">

                <div className="section-header d-flex justify-content-between align-items-center">

                    <div>

                        <h5>
                            API Keys
                        </h5>

                        <small>
                            Create and manage keys for your
                            integrations.
                        </small>

                    </div>


                    {!showCreate && (

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                setShowCreate(true)
                            }
                        >

                            <FiPlus
                                className="me-2"
                            />

                            Create API Key

                        </button>

                    )}

                </div>


                {/* =================================================
                    CREATE FORM
                ================================================= */}

                {showCreate && (

                    <div className="border rounded p-3 mt-3">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <strong>
                                Create API Key
                            </strong>

                            <button
                                type="button"
                                className="btn btn-sm btn-light"
                                onClick={() => {

                                    setShowCreate(false);

                                    setKeyName("");

                                    setSelectedScopes([]);

                                }}
                                disabled={creating}
                            >

                                <FiX />

                            </button>

                        </div>


                        <label className="form-label">

                            Key Name

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Production Integration"
                            value={keyName}
                            maxLength={150}
                            onChange={(e) =>
                                setKeyName(
                                    e.target.value
                                )
                            }
                            disabled={creating}
                        />


                        <small className="text-muted d-block mt-2">

                            Use a name that identifies
                            what this key will be used for.

                        </small>

                        <div className="mt-4">

                            <label className="form-label fw-semibold">
                                API Permissions
                            </label>

                            <small className="text-muted d-block mb-3">
                                Select what this API key is allowed to access.
                            </small>

                            {apiScopes.length === 0 ? (

                                <div className="text-muted">
                                    No API permissions available.
                                </div>

                            ) : (

                                <div className="border rounded">

                                        {apiScopes.map((scope, index) => (
                                            <div
                                                key={scope.id ?? `scope-${index}`}
                                                className="p-3 border-bottom"
                                            >

                                            <div className="form-check">

                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`scope-${scope.id}`}
                                                    checked={
                                                        selectedScopes.includes(
                                                            scope.name
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleScope(
                                                            scope.name
                                                        )
                                                    }
                                                    disabled={creating}
                                                />

                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`scope-${scope.id}`}
                                                >

                                                    <strong>
                                                        {scope.displayName}
                                                    </strong>

                                                    <div className="small text-muted">
                                                        {scope.description}
                                                    </div>

                                                    <div className="small font-monospace text-muted mt-1">
                                                        {scope.name}
                                                    </div>

                                                </label>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                        <div className="d-flex gap-2 mt-3">

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={
                                    handleCreate
                                }
                                disabled={
                                    creating ||
                                    !keyName.trim()
                                }
                            >

                                <FiKey
                                    className="me-2"
                                />

                                {creating
                                    ? "Creating..."
                                    : "Create API Key"}

                            </button>


                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {

                                    setShowCreate(false);

                                    setKeyName("");

                                    setSelectedScopes([]);

                                }}
                                disabled={creating}
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                NEW SECRET
            ================================================= */}

            {newSecret && (

                <div className="alert alert-warning mt-4">

                    <div className="d-flex gap-3">

                        <FiAlertTriangle
                            size={24}
                            className="mt-1"
                        />

                        <div className="flex-grow-1">

                            <h6 className="fw-bold">
                                Save your API key now
                            </h6>

                            <p className="mb-3">

                                This is the only time the complete
                                secret will be shown. invoiceNgine
                                does not store the original secret.

                            </p>


                            <div className="input-group">

                                <input
                                    type="text"
                                    className="form-control font-monospace"
                                    value={
                                        newSecret.secretKey
                                    }
                                    readOnly
                                />


                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={
                                        handleCopySecret
                                    }
                                >

                                    <FiCopy
                                        className="me-1"
                                    />

                                    Copy

                                </button>

                            </div>


                            <div className="mt-3">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                        setNewSecret(null)
                                    }
                                >

                                    <FiCheck
                                        className="me-1"
                                    />

                                    I've saved the key

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                API KEY LIST
            ================================================= */}

            <div className="settings-section mt-4">

                {loading ? (

                    <div className="text-center p-4">

                        Loading API keys...

                    </div>

                ) : apiKeys.length === 0 ? (

                    <div className="text-center p-5">

                        <FiKey
                            size={36}
                            className="text-muted mb-3"
                        />

                        <h5>
                            No API keys
                        </h5>

                        <p className="text-muted mb-0">

                            Create an API key to connect
                            external applications to invoiceNgine.

                        </p>

                    </div>

                ) : (

                    <div className="d-flex flex-column gap-3">

                                {apiKeys.map((apiKey, index) => (
                                    <div
                                        key={apiKey.id ?? `api-key-${index}`}
                                        className="border rounded p-3"
                                    >

                                <div className="d-flex justify-content-between align-items-start gap-3">

                                    <div className="d-flex gap-3">

                                        <div className="text-primary mt-1">

                                            <FiKey
                                                size={22}
                                            />

                                        </div>


                                        <div>

                                            <h6 className="mb-1">

                                                {apiKey.name}

                                            </h6>


                                            <div className="font-monospace text-muted">

                                                {apiKey.keyPrefix}
                                                {"********"}

                                            </div>


                                            {apiKey.scopes?.length > 0 && (

                                                <div className="mt-2">

                                                    <small className="text-muted d-block mb-1">
                                                        Permissions
                                                    </small>

                                                    <div className="d-flex flex-wrap gap-1">

                                                                {[...new Set(apiKey.scopes ?? [])].map(scope => (
                                                                    <span
                                                                        key={scope}
                                                                        className="badge bg-light text-dark border"
                                                                    >
                                                                        {scope}
                                                                    </span>
                                                                ))}

                                                    </div>

                                                </div>

                                            )}


                                            <small className="text-muted d-block mt-2">

                                                Created:
                                                {" "}
                                                {formatDate(
                                                    apiKey.createdAt
                                                )}

                                                {" * "}

                                                Last used:
                                                {" "}
                                                {formatDate(
                                                    apiKey.lastUsedAt
                                                )}

                                            </small>

                                        </div>

                                    </div>


                                    <span
                                        className={
                                            apiKey.isActive
                                                ? "badge bg-success"
                                                : "badge bg-secondary"
                                        }
                                    >

                                        {apiKey.isActive
                                            ? "Active"
                                            : "Revoked"}

                                    </span>

                                </div>


                                {apiKey.isActive && (

                                    <div className="d-flex justify-content-end gap-2 mt-3">

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleRegenerate(
                                                    apiKey
                                                )
                                            }
                                            disabled={
                                                processingId ===
                                                apiKey.id
                                            }
                                        >

                                            <FiRefreshCw
                                                className="me-1"
                                            />

                                            {processingId ===
                                                apiKey.id
                                                ? "Processing..."
                                                : "Regenerate"}

                                        </button>


                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleRevoke(
                                                    apiKey
                                                )
                                            }
                                            disabled={
                                                processingId ===
                                                apiKey.id
                                            }
                                        >

                                            <FiTrash2
                                                className="me-1"
                                            />

                                            Revoke

                                        </button>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </>
    );
}