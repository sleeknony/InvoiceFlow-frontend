import {
    FiEdit,
    FiUserCheck,
    FiUserX,
    FiTrash2
} from "react-icons/fi";

import "./TeamActionMenu.css";

export default function TeamActionMenu({
    member,
    onEdit,
    onToggleStatus,
    onRemove
}) {
    const isOwner =
        member.roleName === "Owner";

    return (
        <div className="team-action-menu">

            {/* =====================================================
                EDIT MEMBER
            ===================================================== */}

            <button
                type="button"
                disabled={isOwner}
                onClick={() => onEdit(member)}
            >
                <FiEdit />
                Edit Member
            </button>


            {/* =====================================================
                ACTIVATE / DEACTIVATE
            ===================================================== */}

            <button
                type="button"
                disabled={isOwner}
                onClick={() => onToggleStatus(member)}
            >
                {member.isActive ? (
                    <FiUserX />
                ) : (
                    <FiUserCheck />
                )}

                {member.isActive
                    ? "Deactivate"
                    : "Activate"
                }
            </button>


            {/* =====================================================
                REMOVE MEMBER
            ===================================================== */}

            <button
                type="button"
                className="danger"
                disabled={isOwner}
                onClick={() => onRemove(member)}
            >
                <FiTrash2 />
                Remove Member
            </button>

        </div>
    );
}