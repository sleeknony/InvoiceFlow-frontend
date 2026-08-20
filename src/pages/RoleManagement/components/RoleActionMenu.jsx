import {
    FiEdit,
    FiPower,
    FiRotateCcw
} from "react-icons/fi";

import "./RoleActionMenu.css";

export default function RoleActionMenu({
    role,
    onEdit,
    onDeactivate,
    onReactivate
}) {
    const isSystemRole = role.isSystemRole;

    return (
        <div className="role-action-menu">

            <button
                type="button"
                disabled={isSystemRole}
                onClick={() => onEdit(role)}
            >
                <FiEdit />
                Edit Role
            </button>

            {role.isActive ? (

                <button
                    type="button"
                    disabled={isSystemRole}
                    onClick={() => onDeactivate(role)}
                >
                    <FiPower />
                    Deactivate Role
                </button>

            ) : (

                <button
                    type="button"
                    disabled={isSystemRole}
                    onClick={() => onReactivate(role)}
                >
                    <FiRotateCcw />
                    Reactivate Role
                </button>

            )}

        </div>
    );
}