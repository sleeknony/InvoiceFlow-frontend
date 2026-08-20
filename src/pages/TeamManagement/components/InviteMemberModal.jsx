import { useEffect, useState } from "react";
import companyTeamService from "../../../services/companyTeamService";
import toast from "react-hot-toast";

import "./InviteMemberModal.css";

export default function InviteMemberModal({
    open,
    onClose,
    onSuccess,
    roles = []
}) {

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    // =========================================================
    // INITIALIZE
    // =========================================================

    useEffect(() => {

        if (!open)
            return;

        setEmail("");
        setRole("");
        setError("");

    }, [open]);


    // =========================================================
    // SELECTED ROLE
    // =========================================================

    const selectedRole =
        roles.find(
            x => x.id === Number(role)
        );


    // =========================================================
    // SUBMIT
    // =========================================================

    async function handleSubmit() {

        if (!email.trim()) {

            setError(
                "Email is required."
            );

            return;
        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        if (!role) {

            setError(
                "Please select a role."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");


            // IMPORTANT:
            // Invitation only sends Email and RoleId.
            await companyTeamService.inviteMember({

                email: email.trim(),

                roleId: Number(role)

            });


            toast.success(
                "Invitation sent successfully."
            );


            await onSuccess?.();

            onClose();

        }
        catch (err) {

            console.error(
                "Error sending invitation:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to send invitation.";

            setError(message);

            toast.error(message);

        }
        finally {

            setSaving(false);

        }

    }


    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open)
        return null;


    const rolePermissions =
        selectedRole?.permissions ?? [];


    return (

        <div className="invite-overlay">

            <div className="invite-modal">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="invite-header">

                    <div>

                        <h2>
                            Invite Team Member
                        </h2>

                        <p>
                            Invite a user and assign them a role.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="invite-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    BODY
                ================================================= */}

                <div className="invite-body">


                    {error && (

                        <div className="invite-error">
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div className="invite-field">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            disabled={saving}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* =================================================
                        ROLE
                    ================================================= */}

                    <div className="invite-field">

                        <label>
                            Role
                        </label>

                        <select
                            value={role}
                            disabled={saving}
                            onChange={(e) =>
                                setRole(
                                    Number(e.target.value)
                                )
                            }
                        >

                            <option value="">
                                Select Role
                            </option>


                            {roles
                                .filter(
                                    x =>
                                        x.name !== "Owner" &&
                                        x.isActive
                                )
                                .map(role => (

                                    <option
                                        key={role.id}
                                        value={role.id}
                                    >
                                        {role.displayName}
                                    </option>

                                ))}

                        </select>

                    </div>


                    {/* =================================================
                        ROLE PERMISSIONS
                    ================================================= */}

                    {selectedRole && (

                        <div className="invite-role-permissions">


                            {/* HEADER */}

                            <div className="invite-role-permissions-header">

                                <div className="invite-role-permissions-title">

                                    <div className="invite-role-permissions-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <label>
                                            Role Permissions
                                        </label>

                                        <p>
                                            These permissions will be inherited
                                            by this team member.
                                        </p>

                                    </div>

                                </div>


                                <span className="invite-role-permission-count">

                                    {rolePermissions.length}

                                    {" "}

                                    {rolePermissions.length === 1
                                        ? "permission"
                                        : "permissions"}

                                </span>

                            </div>


                            {/* =================================================
                                PERMISSION LIST
                            ================================================= */}

                            {rolePermissions.length > 0 ? (

                                <div className="invite-permission-list">

                                    {rolePermissions.map(
                                        permission => (

                                            <div
                                                key={permission.id}
                                                className="invite-permission-item"
                                            >

                                                <div className="invite-permission-check">
                                                    ✓
                                                </div>

                                                <div className="invite-permission-content">

                                                    <strong>
                                                        {
                                                            permission.displayName ??
                                                            permission.name
                                                        }
                                                    </strong>

                                                    {permission.description && (

                                                        <small>
                                                            {
                                                                permission.description
                                                            }
                                                        </small>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="invite-no-permissions">

                                    <div className="invite-no-permissions-icon">
                                        !
                                    </div>

                                    <div>

                                        <strong>
                                            No permissions assigned
                                        </strong>

                                        <span>
                                            This role currently has no
                                            permissions configured.
                                        </span>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="invite-footer">

                    <button
                        type="button"
                        className="btn-secondary"
                        disabled={saving}
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="btn-primary"
                        disabled={
                            saving ||
                            !role
                        }
                        onClick={handleSubmit}
                    >

                        {saving
                            ? "Sending..."
                            : "Send Invitation"}

                    </button>

                </div>

            </div>

        </div>

    );
}