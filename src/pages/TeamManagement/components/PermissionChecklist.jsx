import "./PermissionChecklist.css";

export default function PermissionChecklist({

    permissions = [],

    selectedPermissions = [],

    onChange,

    disabled = false

}) {

    function togglePermission(value) {

        if (disabled)
            return;

        const exists =
            selectedPermissions.includes(value);

        if (exists) {

            onChange(
                selectedPermissions.filter(x => x !== value)
            );

            return;

        }

        onChange([
            ...selectedPermissions,
            value
        ]);

    }

    const grouped =
        permissions.reduce((groups, permission) => {

            if (!groups[permission.category]) {

                groups[permission.category] = [];

            }

            groups[permission.category].push(permission);

            return groups;

        }, {});

    return (

        <div className="permission-checklist">

            {Object.entries(grouped).map(

                ([category, items]) => (

                    <div
                        key={category}
                        className="permission-group"
                    >

                        <h4>

                            {category}

                        </h4>

                        <div className="permission-items">

                            {items.map(permission => (

                                <label
                                    key={permission.value}
                                    className="permission-item"
                                >

                                    <input
                                        type="checkbox"
                                        disabled={disabled}
                                        checked={
                                            selectedPermissions.includes(
                                                permission.value
                                            )
                                        }
                                        onChange={() =>
                                            togglePermission(
                                                permission.value
                                            )
                                        }
                                    />

                                    <span>

                                        {permission.displayName}

                                    </span>

                                </label>

                            ))}

                        </div>

                    </div>

                )

            )}

        </div>

    );

}