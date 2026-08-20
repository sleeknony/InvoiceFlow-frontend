import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

import RoleActionMenu from "./RoleActionMenu";

export default function RoleTableRow({
    role,
    onEdit,
    onDeactivate,
    onReactivate
}) {
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    return (
        <tr>

            <td>
                <div className="role-management-role-name">

                    <strong>
                        {role.displayName}
                    </strong>

                    <span>
                        {role.name}
                    </span>

                </div>
            </td>

            <td>

                {role.isSystemRole ? (
                    <span className="role-management-system-role">
                        System Role
                    </span>
                ) : (
                    <span className="role-management-custom-role">
                        Custom Role
                    </span>
                )}

            </td>

            <td>

                <span className="role-management-permission-count">
                    {role.permissions?.length ?? 0}
                    {" "}
                    Permission
                    {(role.permissions?.length ?? 0) !== 1
                        ? "s"
                        : ""}
                </span>

            </td>

            <td>

                <span
                    className={
                        role.isActive
                            ? "role-management-status active"
                            : "role-management-status inactive"
                    }
                >
                    {role.isActive
                        ? "Active"
                        : "Inactive"}
                </span>

            </td>

            <td>
                {role.description || " "}
            </td>

            <td
                className="role-management-actions"
                ref={menuRef}
            >

                <button
                    type="button"
                    className="role-management-action-button"
                    title="Actions"
                    onClick={() =>
                        setShowMenu(value => !value)
                    }
                >
                    <FiMoreVertical />
                </button>

                {showMenu && (
                    <RoleActionMenu
                        role={role}

                        onEdit={(selectedRole) => {
                            setShowMenu(false);
                            onEdit(selectedRole);
                        }}

                        onDeactivate={(selectedRole) => {
                            setShowMenu(false);
                            onDeactivate(selectedRole);
                        }}

                        onReactivate={(selectedRole) => {
                            setShowMenu(false);
                            onReactivate(selectedRole);
                        }}
                    />
                )}

            </td>

        </tr>
    );
}