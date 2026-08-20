import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import companyRoleService from "../../../services/companyRoleService";

import "./RoleModal.css";

export default function RoleModal({
    open,
    role,
    permissions = [],
    loadingPermissions = false,
    onClose,
    onSuccess
}) {
    const isEdit = Boolean(role);

    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [saving, setSaving] = useState(false);

    // =========================================================
    // INITIALIZE FORM
    // =========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        if (role) {
            setName(role.name ?? "");
            setDisplayName(role.displayName ?? "");
            setDescription(role.description ?? "");

            const rolePermissionIds =
                (role.permissions ?? [])
                    .map(permission => Number(permission.id))
                    .filter(id => Number.isInteger(id));

            setSelectedPermissionIds(rolePermissionIds);
        } else {
            setName("");
            setDisplayName("");
            setDescription("");
            setSelectedPermissionIds([]);
        }
    }, [open, role]);

    // =========================================================
    // GROUP PERMISSIONS
    // =========================================================

    const groupedPermissions = useMemo(() => {
        const groups = {};

        permissions.forEach(permission => {
            const category =
                permission.category?.trim() || "Other";

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(permission);
        });

        return groups;
    }, [permissions]);

    // =========================================================
    // TOGGLE PERMISSION
    // =========================================================

    function togglePermission(permissionId) {
        const id = Number(permissionId);

        setSelectedPermissionIds(current => {
            if (current.includes(id)) {
                return current.filter(
                    currentId => currentId !== id
                );
            }

            return [
                ...current,
                id
            ];
        });
    }

    // =========================================================
    // TOGGLE CATEGORY
    // =========================================================

    function toggleCategory(categoryPermissions) {
        const categoryIds =
            categoryPermissions
                .map(permission => Number(permission.id))
                .filter(id => Number.isInteger(id));

        const allSelected =
            categoryIds.length > 0 &&
            categoryIds.every(id =>
                selectedPermissionIds.includes(id)
            );

        if (allSelected) {
            setSelectedPermissionIds(current =>
                current.filter(
                    id => !categoryIds.includes(id)
                )
            );

            return;
        }

        setSelectedPermissionIds(current =>
            Array.from(
                new Set([
                    ...current,
                    ...categoryIds
                ])
            )
        );
    }

    // =========================================================
    // SUBMIT
    // =========================================================

    async function handleSubmit(event) {
        event.preventDefault();

        if (saving) {
            return;
        }

        if (!name.trim()) {
            toast.error("Role name is required.");
            return;
        }

        if (!displayName.trim()) {
            toast.error("Display name is required.");
            return;
        }

        const payload = {
            name: name.trim(),
            displayName: displayName.trim(),
            description: description.trim() || null,
            permissionIds: selectedPermissionIds
        };

        try {
            setSaving(true);

            if (isEdit) {
                await companyRoleService.updateRole(
                    role.id,
                    payload
                );

                toast.success(
                    "Role updated successfully."
                );
            } else {
                await companyRoleService.createRole(
                    payload
                );

                toast.success(
                    "Role created successfully."
                );
            }

            await onSuccess();

        } catch (err) {
            console.error(
                "Error saving role:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to save role.";

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to save role."
            );

        } finally {
            setSaving(false);
        }
    }

    // =========================================================
    // DON'T RENDER
    // =========================================================

    if (!open) {
        return null;
    }

    const isSystemRole =
        role?.isSystemRole === true;

    const permissionCount =
        selectedPermissionIds.length;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="role-modal-overlay"
            onMouseDown={event => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <div className="role-modal">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="role-modal-header">

                    <div>
                        <h2>
                            {isEdit
                                ? "Edit Role"
                                : "Create Role"}
                        </h2>

                        <p>
                            {isEdit
                                ? "Update the role and its permissions."
                                : "Create a role and assign its permissions."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="role-modal-close"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="role-modal-form"
                >

                    {/* =================================================
                        ROLE INFORMATION
                    ================================================= */}

                    <div className="role-form-row">

                        <div className="role-form-group">

                            <label htmlFor="role-name">
                                Role Name
                            </label>

                            <input
                                id="role-name"
                                type="text"
                                value={name}
                                onChange={event =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Accountant"
                                disabled={
                                    saving ||
                                    isSystemRole
                                }
                                maxLength={100}
                            />

                            <small>
                                Internal name used by the system.
                            </small>

                        </div>

                        <div className="role-form-group">

                            <label htmlFor="role-display-name">
                                Display Name
                            </label>

                            <input
                                id="role-display-name"
                                type="text"
                                value={displayName}
                                onChange={event =>
                                    setDisplayName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Accountant"
                                disabled={
                                    saving ||
                                    isSystemRole
                                }
                                maxLength={150}
                            />

                        </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div className="role-form-group">

                        <label htmlFor="role-description">
                            Description
                        </label>

                        <textarea
                            id="role-description"
                            value={description}
                            onChange={event =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe what this role is responsible for..."
                            rows={3}
                            disabled={
                                saving ||
                                isSystemRole
                            }
                            maxLength={500}
                        />

                    </div>

                    {/* =================================================
                        SYSTEM ROLE WARNING
                    ================================================= */}

                    {isSystemRole && (
                        <div className="role-system-warning">
                            This is a system role. Its name,
                            description and permissions cannot
                            be modified.
                        </div>
                    )}

                    {/* =================================================
                        PERMISSIONS
                    ================================================= */}

                    <div className="role-permissions-section">

                        <div className="role-permissions-header">

                            <div>
                                <h3>
                                    Permissions
                                </h3>

                                <p>
                                    Users assigned to this role
                                    automatically receive these
                                    permissions.
                                </p>
                            </div>

                            <span className="permission-selected-count">
                                {permissionCount} selected
                            </span>

                        </div>

                        {/* LOADING */}

                        {loadingPermissions ? (

                            <div className="permissions-loading">
                                Loading permissions...
                            </div>

                        ) : permissions.length === 0 ? (

                            <div className="permissions-empty">
                                No permissions available.
                            </div>

                        ) : (

                            <div className="permissions-container">

                                {Object.entries(
                                    groupedPermissions
                                ).map(
                                    ([
                                        category,
                                        categoryPermissions
                                    ]) => {

                                        const categoryIds =
                                            categoryPermissions
                                                .map(permission =>
                                                    Number(
                                                        permission.id
                                                    )
                                                )
                                                .filter(id =>
                                                    Number.isInteger(id)
                                                );

                                        const allSelected =
                                            categoryIds.length > 0 &&
                                            categoryIds.every(id =>
                                                selectedPermissionIds.includes(
                                                    id
                                                )
                                            );

                                        return (
                                            <div
                                                key={category}
                                                className="permission-category"
                                            >

                                                {/* CATEGORY HEADER */}

                                                <div className="permission-category-header">

                                                    <div>
                                                        <h4>
                                                            {category}
                                                        </h4>

                                                        <span>
                                                            {
                                                                categoryPermissions.length
                                                            }{" "}
                                                            permissions
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="permission-category-toggle"
                                                        onClick={() =>
                                                            toggleCategory(
                                                                categoryPermissions
                                                            )
                                                        }
                                                        disabled={
                                                            saving ||
                                                            isSystemRole
                                                        }
                                                    >
                                                        {allSelected
                                                            ? "Clear all"
                                                            : "Select all"}
                                                    </button>

                                                </div>

                                                {/* PERMISSION LIST */}

                                                <div className="permission-list">

                                                    {categoryPermissions.map(
                                                        permission => {

                                                            const permissionId =
                                                                Number(
                                                                    permission.id
                                                                );

                                                            const selected =
                                                                selectedPermissionIds.includes(
                                                                    permissionId
                                                                );

                                                            return (
                                                                <label
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className={
                                                                        selected
                                                                            ? "permission-item selected"
                                                                            : "permission-item"
                                                                    }
                                                                >

                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            selected
                                                                        }
                                                                        onChange={() =>
                                                                            togglePermission(
                                                                                permissionId
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            saving ||
                                                                            isSystemRole
                                                                        }
                                                                    />

                                                                    <span className="permission-check">
                                                                        {selected && (
                                                                            <FiCheck />
                                                                        )}
                                                                    </span>

                                                                    <span className="permission-details">

                                                                        <strong>
                                                                            {
                                                                                permission.displayName
                                                                            }
                                                                        </strong>

                                                                        {permission.description && (
                                                                            <small>
                                                                                {
                                                                                    permission.description
                                                                                }
                                                                            </small>
                                                                        )}

                                                                    </span>

                                                                </label>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="role-modal-footer">

                        <button
                            type="button"
                            className="role-cancel-button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="role-save-button"
                            disabled={
                                saving ||
                                loadingPermissions ||
                                isSystemRole
                            }
                        >
                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Save Changes"
                                    : "Create Role"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}