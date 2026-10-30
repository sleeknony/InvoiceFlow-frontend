
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
    FiRefreshCw,
    FiSearch,
    FiUserPlus,
    FiUsers,
    FiMail,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";

import {
    createSupportAgent,
    getSupportAgents,
    resendSupportAgentInvitation,
    updateSupportAgentStatus
} from "../../services/superAdminSupportService";

import "./SuperAdminSupportAgents.css";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: ""
};

function getErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        return Object.values(data.errors)
            .flat()
            .join("\n");
    }

    return error?.message || "An unexpected error occurred.";
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export default function SuperAdminSupportAgents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [creating, setCreating] = useState(false);
    const [busyUserId, setBusyUserId] = useState(null);
    const [pageError, setPageError] = useState("");

    const loadAgents = useCallback(async (showRefresh = false) => {
        if (showRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setPageError("");

        try {
            const result = await getSupportAgents({
                includeInactive: true
            });

            const items = Array.isArray(result)
                ? result
                : result?.items ?? result?.agents ?? [];

            setAgents(items);
        } catch (error) {
            setPageError(getErrorMessage(error));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadAgents();
    }, [loadAgents]);

    const filteredAgents = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return agents;
        }

        return agents.filter((agent) => {
            const fullName =
                `${agent.firstName ?? ""} ${agent.lastName ?? ""}`
                    .trim()
                    .toLowerCase();

            return (
                fullName.includes(term) ||
                (agent.email ?? "").toLowerCase().includes(term)
            );
        });
    }, [agents, search]);

    const activeCount = agents.filter((agent) => agent.isActive).length;
    const inactiveCount = agents.length - activeCount;
    const pendingCount = agents.filter(
        (agent) => !agent.emailConfirmed
    ).length;

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleCreateAgent = async (event) => {
        event.preventDefault();

        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const email = form.email.trim();

        if (!firstName || !lastName || !email) {
            await Swal.fire({
                icon: "warning",
                title: "Missing information",
                text: "Enter the agent's first name, last name, and email address."
            });

            return;
        }

        const confirmation = await Swal.fire({
            title: "Create support agent?",
            text: `An invitation will be sent to ${email}.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Create and invite",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setCreating(true);

        try {
            await createSupportAgent({
                firstName,
                lastName,
                email
            });

            setForm(emptyForm);
            setShowCreateForm(false);

            await loadAgents(true);

            await Swal.fire({
                icon: "success",
                title: "Support agent created",
                text: "The account was created and the invitation request was processed."
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Could not create support agent",
                text: getErrorMessage(error)
            });
        } finally {
            setCreating(false);
        }
    };

    const handleResendInvitation = async (agent) => {
        const confirmation = await Swal.fire({
            title: "Resend invitation?",
            text: `A new setup invitation will be sent to ${agent.email}.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Resend invitation",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setBusyUserId(agent.userId);

        try {
            await resendSupportAgentInvitation(agent.userId);

            await Swal.fire({
                icon: "success",
                title: "Invitation resent",
                text: `The setup invitation was resent to ${agent.email}.`
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Could not resend invitation",
                text: getErrorMessage(error)
            });
        } finally {
            setBusyUserId(null);
        }
    };

    const handleStatusChange = async (agent) => {
        const nextIsActive = !agent.isActive;
        const action = nextIsActive ? "activate" : "deactivate";

        const confirmation = await Swal.fire({
            title: `${action.charAt(0).toUpperCase()}${action.slice(1)} agent?`,
            text: nextIsActive
                ? `${agent.firstName} ${agent.lastName} will be marked active.`
                : `${agent.firstName} ${agent.lastName} will be deactivated.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${action}`,
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setBusyUserId(agent.userId);

        try {
            await updateSupportAgentStatus(agent.userId, nextIsActive);

            setAgents((current) =>
                current.map((item) =>
                    item.userId === agent.userId
                        ? { ...item, isActive: nextIsActive }
                        : item
                )
            );

            await Swal.fire({
                icon: "success",
                title: "Status updated",
                text: `The support agent has been ${nextIsActive ? "activated" : "deactivated"}.`
            });
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Could not update status",
                text: getErrorMessage(error)
            });
        } finally {
            setBusyUserId(null);
        }
    };

    return (
        <div className="sa-agents-page">
            <div className="sa-agents-header">
                <div>
                    <div className="sa-agents-eyebrow">
                        PLATFORM MANAGEMENT
                    </div>

                    <h1>Support Agents</h1>

                    <p>
                        Create support accounts and manage agent access
                        to the InvoiceNgine support workflow.
                    </p>
                </div>

                <div className="sa-agents-header-actions">
                    <button
                        type="button"
                        className="sa-agents-btn sa-agents-btn-secondary"
                        onClick={() => loadAgents(true)}
                        disabled={loading || refreshing}
                    >
                        <FiRefreshCw
                            className={refreshing ? "sa-agents-spinning" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        className="sa-agents-btn sa-agents-btn-primary"
                        onClick={() => setShowCreateForm((current) => !current)}
                    >
                        <FiUserPlus />
                        {showCreateForm ? "Cancel" : "Create agent"}
                    </button>
                </div>
            </div>

            <div className="sa-agents-stats">
                <div className="sa-agents-stat-card">
                    <span className="sa-agents-stat-icon">
                        <FiUsers />
                    </span>
                    <div>
                        <span className="sa-agents-stat-label">
                            Total agents
                        </span>
                        <strong>{agents.length}</strong>
                    </div>
                </div>

                <div className="sa-agents-stat-card">
                    <span className="sa-agents-stat-icon sa-agents-stat-active">
                        <FiCheckCircle />
                    </span>
                    <div>
                        <span className="sa-agents-stat-label">
                            Active
                        </span>
                        <strong>{activeCount}</strong>
                    </div>
                </div>

                <div className="sa-agents-stat-card">
                    <span className="sa-agents-stat-icon sa-agents-stat-inactive">
                        <FiXCircle />
                    </span>
                    <div>
                        <span className="sa-agents-stat-label">
                            Inactive
                        </span>
                        <strong>{inactiveCount}</strong>
                    </div>
                </div>

                <div className="sa-agents-stat-card">
                    <span className="sa-agents-stat-icon sa-agents-stat-pending">
                        <FiMail />
                    </span>
                    <div>
                        <span className="sa-agents-stat-label">
                            Setup pending
                        </span>
                        <strong>{pendingCount}</strong>
                    </div>
                </div>
            </div>

            {showCreateForm && (
                <section className="sa-agents-panel sa-agents-create-panel">
                    <div className="sa-agents-panel-heading">
                        <div>
                            <h2>Create a support agent</h2>
                            <p>
                                The agent will receive an email to set a
                                password and complete account setup.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateAgent}>
                        <div className="sa-agents-form-grid">
                            <div className="sa-agents-field">
                                <label htmlFor="agent-first-name">
                                    First name
                                </label>
                                <input
                                    id="agent-first-name"
                                    name="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={handleFormChange}
                                    maxLength={100}
                                    autoComplete="given-name"
                                    required
                                />
                            </div>

                            <div className="sa-agents-field">
                                <label htmlFor="agent-last-name">
                                    Last name
                                </label>
                                <input
                                    id="agent-last-name"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleFormChange}
                                    maxLength={100}
                                    autoComplete="family-name"
                                    required
                                />
                            </div>

                            <div className="sa-agents-field sa-agents-email-field">
                                <label htmlFor="agent-email">
                                    Email address
                                </label>
                                <input
                                    id="agent-email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    maxLength={256}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sa-agents-form-actions">
                            <button
                                type="button"
                                className="sa-agents-btn sa-agents-btn-secondary"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setForm(emptyForm);
                                }}
                                disabled={creating}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="sa-agents-btn sa-agents-btn-primary"
                                disabled={creating}
                            >
                                <FiUserPlus />
                                {creating ? "Creating..." : "Create and send invitation"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="sa-agents-panel">
                <div className="sa-agents-list-heading">
                    <div>
                        <h2>Agent directory</h2>
                        <p>
                            {filteredAgents.length} of {agents.length} agents
                        </p>
                    </div>

                    <div className="sa-agents-search">
                        <FiSearch />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name or email..."
                            aria-label="Search support agents"
                        />
                    </div>
                </div>

                {pageError && (
                    <div className="sa-agents-error" role="alert">
                        <strong>Unable to load support agents.</strong>
                        <span>{pageError}</span>
                        <button
                            type="button"
                            onClick={() => loadAgents(true)}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="sa-agents-empty">
                        Loading support agents...
                    </div>
                ) : !pageError && filteredAgents.length === 0 ? (
                    <div className="sa-agents-empty">
                        <FiUsers />
                        <strong>
                            {search.trim()
                                ? "No matching agents"
                                : "No support agents yet"}
                        </strong>
                        <span>
                            {search.trim()
                                ? "Try another name or email address."
                                : "Create your first support agent to get started."}
                        </span>
                    </div>
                ) : (
                    !pageError && (
                        <div className="sa-agents-table-wrap">
                            <table className="sa-agents-table">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>Account status</th>
                                        <th>Setup</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAgents.map((agent) => {
                                        const name =
                                            `${agent.firstName ?? ""} ${agent.lastName ?? ""}`
                                                .trim() || "Unnamed agent";

                                        const isBusy =
                                            busyUserId === agent.userId;

                                        return (
                                            <tr key={agent.userId}>
                                                <td>
                                                    <div className="sa-agents-identity">
                                                        <div className="sa-agents-avatar">
                                                            {(
                                                                agent.firstName?.[0] ??
                                                                agent.email?.[0] ??
                                                                "A"
                                                            ).toUpperCase()}
                                                        </div>

                                                        <div className="sa-agents-identity-text">
                                                            <strong>{name}</strong>
                                                            <span>{agent.email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`sa-agents-status ${agent.isActive ? "is-active" : "is-inactive"}`}
                                                    >
                                                        {agent.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`sa-agents-setup ${agent.emailConfirmed ? "is-complete" : "is-pending"}`}
                                                    >
                                                        {agent.emailConfirmed
                                                            ? "Completed"
                                                            : "Pending"}
                                                    </span>
                                                    <small className="sa-agents-setup-date">
                                                        {agent.emailConfirmed
                                                            ? "Email confirmed"
                                                            : "Invitation not completed"}
                                                    </small>
                                                </td>

                                                <td>
                                                    <span className="sa-agents-role">
                                                        Support Agent
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="sa-agents-row-actions">
                                                        {!agent.emailConfirmed && (
                                                            <button
                                                                type="button"
                                                                className="sa-agents-action-btn"
                                                                onClick={() =>
                                                                    handleResendInvitation(agent)
                                                                }
                                                                disabled={isBusy}
                                                            >
                                                                <FiMail />
                                                                Resend invite
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            className={`sa-agents-action-btn ${agent.isActive ? "sa-agents-action-danger" : "sa-agents-action-success"}`}
                                                            onClick={() =>
                                                                handleStatusChange(agent)
                                                            }
                                                            disabled={isBusy}
                                                        >
                                                            {agent.isActive
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </section>

            <div className="sa-agents-footnote">
                <strong>Access control:</strong> Support Agent is a separate
                Identity role from Super Admin. Make sure API authorization
                and deactivated-account sign-in restrictions are enforced
                server-side; hiding or disabling frontend controls alone is
                not a security boundary.
            </div>
        </div>
    );
}
