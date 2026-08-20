import "./PermissionChecklist.css";

export default function PermissionChecklist({
    permissions = [],
    selectedPermissions = [],
    onChange,
    disabled = false
}) {

    function togglePermission(permissionId) {

        if (disabled)
            return;

        if (selectedPermissions.includes(permissionId)) {

            onChange(
                selectedPermissions.filter(
                    x => x !== permissionId
                )
            );

            return;
        }

        onChange([
            ...selectedPermissions,
            permissionId
        ]);
    }

    const grouped = permissions.reduce(
        (groups, permission) => {

            const category =
                permission.category || "Other";

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(permission);

            return groups;

        },
        {}
    );

    if (permissions.length === 0) {

        return (
            <div className="permission-checklist-empty">
                No permissions available.
            </div>
        );
    }

    return (

        <div className="permission-checklist">

            {Object.entries(grouped).map(
                ([category, items]) => {

                    const selectedCount =
                        items.filter(permission =>
                            selectedPermissions.includes(
                                permission.id
                            )
                        ).length;

                    return (

                        <div
                            key={category}
                            className="permission-group"
                        >

                            {/* CATEGORY HEADER */}

                            <div className="permission-group-header">

                                <div className="permission-group-title">

                                    <h4>
                                        {category}
                                    </h4>

                                    <span>
                                        {items.length}{" "}
                                        {items.length === 1
                                            ? "permission"
                                            : "permissions"}
                                    </span>

                                </div>

                                {selectedCount > 0 && (

                                    <span className="permission-group-selected">

                                        {selectedCount} selected

                                    </span>

                                )}

                            </div>


                            {/* PERMISSIONS */}

                            <div className="permission-items">

                                {items.map(permission => {

                                    const selected =
                                        selectedPermissions.includes(
                                            permission.id
                                        );

                                    return (

                                        <label
                                            key={permission.id}
                                            className={
                                                `permission-item ${selected
                                                    ? "selected"
                                                    : ""
                                                } ${disabled
                                                    ? "disabled"
                                                    : ""
                                                }`
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                disabled={disabled}
                                                checked={selected}
                                                onChange={() =>
                                                    togglePermission(
                                                        permission.id
                                                    )
                                                }
                                            />

                                            <span className="permission-checkbox">

                                                {selected && (
                                                    <span>
                                                        ✓
                                                    </span>
                                                )}

                                            </span>

                                            <span className="permission-content">

                                                <span className="permission-name">

                                                    {permission.displayName ??
                                                        permission.name}

                                                </span>

                                                {permission.description && (

                                                    <span className="permission-description">

                                                        {
                                                            permission.description
                                                        }

                                                    </span>

                                                )}

                                            </span>

                                        </label>

                                    );

                                })}

                            </div>

                        </div>

                    );

                }
            )}

        </div>
    );
}