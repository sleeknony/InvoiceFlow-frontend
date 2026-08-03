import {
    FiEdit,
    FiShield,
    FiUserCheck,
    FiUserX,
    FiTrash2
} from "react-icons/fi";

import "./TeamActionMenu.css";

export default function TeamActionMenu({

    member,

    onEdit,

    onPermissions,

    onToggleStatus,

    onRemove

}) {

    return (

        <div className="team-action-menu">

            <button
                onClick={() => {

                    console.log("Edit clicked");
                    onEdit(member)
                }}
            >
                <FiEdit />

                Edit Member
            </button>

            <button
                onClick={() => onPermissions(member)}
            >
                <FiShield />

                Permissions
            </button>

            <button
                onClick={() =>
                    onToggleStatus(member)
                }
            >
                {member.isActive
                    ? <FiUserX />
                    : <FiUserCheck />}

                {member.isActive
                    ? "Deactivate"
                    : "Activate"}

            </button>

            <button
                className="danger"
                onClick={() => onRemove(member)}
            >
                <FiTrash2 />

                Remove Member
            </button>

        </div>

    );

}