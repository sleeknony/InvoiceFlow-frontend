import { useEffect, useState } from "react";
import companyTeamService from "../../../services/companyTeamService";
import PermissionChecklist from "./PermissionChecklist";
import toast from "react-hot-toast";

import "./InviteMemberModal.css";

export default function InviteMemberModal({

    open,

    onClose,

    onSuccess,

    roles = [],

    permissions = []

}) {

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("");

    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!open)
            return;

        setEmail("");

        setRole("");

        setSelectedPermissions([]);

        setError("");

    }, [open]);

    if (!open)
        return null;

    async function handleSubmit() {

        if (!email.trim()) {

            setError("Email is required.");

            return;

        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            setError("Please enter a valid email address.");

            return;

        }

        if (role === "") {

            setError("Please select a role.");

            return;

        }

        try {

            setSaving(true);

            setError("");

            const response =
                await companyTeamService.inviteMember({
                    email: email.trim(),
                    role: Number(role),
                    permissions: selectedPermissions
                });

            toast.success(
                response?.message ||
                "Invitation sent successfully."
            );

            onSuccess?.();

            onClose();

        }
        catch (err) {

            toast.error(
                err?.response?.data?.message ||
                "Unable to send invitation."
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

                        Invite Team Member

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

                            placeholder="john@example.com"

                            value={email}

                            disabled={saving}

                            onChange={(e) =>
                                setEmail(e.target.value)
                            }

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

                                console.log("Selected Role Value:", value);

                                const selectedRole =
                                    roles.find(r => r.value === value);

                                console.log("Selected Role:", selectedRole);

                                setRole(value);

                                setSelectedPermissions(
                                    selectedRole?.defaultPermissions ?? []
                                );

                            }}

                        >

                            <option value="">

                                Select Role

                            </option>

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
                            ? "Sending..."
                            : "Send Invitation"}

                    </button>

                </div>

            </div>

        </div>

    );

}