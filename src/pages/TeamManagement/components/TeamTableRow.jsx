import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

import TeamActionMenu from "./TeamActionMenu";

export default function TeamTableRow({

    member,

    onEdit,

    onPermissions,

    onToggleStatus,

    onRemove

}) {

    const initials =
        `${member.firstName?.charAt(0) ?? ""}${member.lastName?.charAt(0) ?? ""}`;

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

                <div className="team-user">

                    <div className="team-avatar">

                        {initials.toUpperCase()}

                    </div>

                    <div>

                        <div className="team-name">

                            {member.firstName} {member.lastName}

                        </div>

                        <div className="team-email">

                            {member.email}

                        </div>

                    </div>

                </div>

            </td>

            <td>

                <span className={`team-role ${member.roleName.toLowerCase()}`}>

                    {member.roleName}

                </span>

            </td>

            <td>

                <span className="team-permission-count">

                    {member.permissions?.length ?? 0} Permission{(member.permissions?.length ?? 0) !== 1 ? "s" : ""}

                </span>

            </td>

            <td>

                <span
                    className={
                        member.isActive
                            ? "team-status active"
                            : "team-status inactive"
                    }
                >
                    {member.isActive ? "Active" : "Inactive"}
                </span>

            </td>

            <td>

                {new Date(member.createdAt).toLocaleDateString()}

            </td>

            <td
                className="team-actions"
                ref={menuRef}
            >

                <button
                    className="team-action-button"
                    title="Actions"
                    onClick={() =>
                        setShowMenu(!showMenu)
                    }
                >

                    <FiMoreVertical />

                </button>

                {showMenu && (

                    <TeamActionMenu

                        member={member}

                        onEdit={onEdit}

                        onPermissions={onPermissions}

                        onToggleStatus={onToggleStatus}

                        onRemove={onRemove}

                    />

                )}

            </td>

        </tr>

    );

}