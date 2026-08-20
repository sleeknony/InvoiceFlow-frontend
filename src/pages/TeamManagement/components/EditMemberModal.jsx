import { useEffect, useState } from "react";
import companyTeamService from "../../../services/companyTeamService";
import toast from "react-hot-toast";
import "./InviteMemberModal.css";

export default function EditMemberModal({
    open,
    member,
    roles = [],
    onClose,
    onSuccess
}) {

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    // =========================================================
    // INITIALIZE
    // =========================================================

    useEffect(() => {

        if (!open || !member)
            return;

        setEmail(
            member.email ?? ""
        );

        setRole(
            member.roleId ?? ""
        );

        setError("");

    }, [open, member]);


    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open)
        return null;


    // =========================================================
    // SUBMIT
    // =========================================================

    async function handleSubmit() {

        if (!role) {

            setError("Please select a role.");

            toast.error("Please select a role.");

            return;
        }

        try {

            setSaving(true);

            setError("");

            await companyTeamService.updateMember(
                member.id,
                {
                    roleId: Number(role)
                }
            );

            toast.success(
                "Team member updated successfully."
            );

            await onSuccess?.();

            onClose();

        }
        catch (err) {

            console.error(
                "Error updating team member:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to update team member.";

            setError(message);

            toast.error(message);

        }
        finally {

            setSaving(false);

        }
    }


    // =========================================================
    // SELECTED ROLE
    // =========================================================

    const selectedRole =
        roles.find(
            x => x.id === Number(role)
        );


    return (

        <div className="invite-overlay">

            <div className="invite-modal">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="invite-header">

                    <div>

                        <h2>
                            Edit Team Member
                        </h2>

                        <p>
                            Change the role assigned to this
                            team member.
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


                    {/* EMAIL */}

                    <div className="invite-field">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            readOnly
                            disabled
                        />

                    </div>


                    {/* ROLE */}

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
                                Select a role
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
                        ROLE PERMISSIONS PREVIEW
                    ================================================= */}

                    {/* =================================================
    ROLE PERMISSIONS PREVIEW
================================================= */}

                    {selectedRole && (

                        <div className="member-role-permissions">

                            <div className="member-role-permissions-header">

                                <div className="member-role-permissions-title">

                                    <div className="member-role-permissions-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <label>
                                            Role Permissions
                                        </label>

                                        <p>
                                            Permissions inherited from the selected role.
                                        </p>

                                    </div>

                                </div>


                                <span className="member-role-permission-count">

                                    {selectedRole.permissions?.length ?? 0}

                                    {" "}

                                    {(selectedRole.permissions?.length ?? 0) === 1
                                        ? "permission"
                                        : "permissions"}

                                </span>

                            </div>


                            {selectedRole.permissions?.length > 0 ? (

                                <div className="member-role-permission-list">

                                    {selectedRole.permissions.map(
                                        permission => (

                                            <div
                                                key={permission.id}
                                                className="member-role-permission"
                                            >

                                                <div className="member-role-permission-check">
                                                    ✓
                                                </div>

                                                <div className="member-role-permission-content">

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

                                <div className="member-role-no-permissions">

                                    <div className="member-role-no-permissions-icon">
                                        !
                                    </div>

                                    <div>

                                        <strong>
                                            No permissions assigned
                                        </strong>

                                        <span>
                                            This role currently does not have any
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
                            ? "Updating..."
                            : "Update Member"}

                    </button>

                </div>

            </div>

        </div>

    );
}