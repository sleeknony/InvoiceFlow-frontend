import { useEffect, useState } from "react";
import companyTeamService from "../../../services/companyTeamService";
import PermissionChecklist from "./PermissionChecklist";

import "./InviteMemberModal.css";

export default function EditMemberModal({

    open,

    member,

    roles,

    permissions,

    onClose,

    onSuccess

}) {

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!open || !member)
            return;

        setEmail(member.email);

        setRole(member.role);
        console.log("Member:", member);
        console.log("Permissions:", member.permissions);
        setSelectedPermissions(
            member.permissions ?? []

        );

        setError("");

    }, [open, member]);



    if (!open)
        return null;

    async function handleSubmit() {

        if (role === "") {

            setError("Please select a role.");

            return;

        }

        try {

            setSaving(true);

            setError("");

            await companyTeamService.updateMember(

                member.id,

                {

                    role: Number(role),

                    permissions: selectedPermissions

                }

            );

            onSuccess?.();

            onClose();

        }
        catch (err) {

            setError(

                err.response?.data?.message ||

                err.response?.data ||

                "Unable to update member."

            );

        }
        finally {

            setSaving(false);

        }

    }

    return (

        <div className="invite-overlay">

            <div className="invite-modal">

                {/* Header */}

                <div className="invite-header">

                    <h2>

                        Edit Team Member

                    </h2>

                    <button

                        className="invite-close"

                        onClick={onClose}

                        disabled={saving}

                    >

                        x

                    </button>

                </div>

                {/* Body */}

                <div className="invite-body">

                    {error && (

                        <div className="invite-error">

                            {error}

                        </div>

                    )}

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

                    <div className="invite-field">

                        <label>

                            Role

                        </label>

                        <select

                            value={role}

                            disabled={saving}

                            onChange={(e) => {

                                const value = Number(e.target.value);

                                setRole(value);

                                const selectedRole =
                                    roles.find(r => r.value === value);

                                setSelectedPermissions(

                                    selectedRole?.defaultPermissions ?? []

                                );

                            }}

                        >

                            {roles

                                .filter(x => x.name !== "Owner")

                                .map(role => (

                                    <option

                                        key={role.value}

                                        value={role.value}

                                    >

                                        {role.displayName}

                                    </option>

                                ))}

                        </select>

                    </div>

                    <div className="invite-field">

                        <label>

                            Permissions

                        </label>

                        <PermissionChecklist

                            permissions={permissions}

                            selectedPermissions={selectedPermissions}

                            onChange={setSelectedPermissions}

                            disabled={saving}

                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="invite-footer">

                    <button

                        className="btn-secondary"

                        disabled={saving}

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="btn-primary"

                        disabled={saving}

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