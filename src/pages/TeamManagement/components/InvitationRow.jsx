import {
    FiRefreshCw,
    FiTrash2
} from "react-icons/fi";

export default function InvitationRow({

    invitation,

    onResend,

    onCancel

}) {

    const expired =
        new Date(invitation.expiresAt) < new Date();

    return (

        <tr>

            <td>

                {invitation.email}

            </td>

            <td>

                <span className="team-role">

                    {invitation.roleName}

                </span>

            </td>

            <td>

                {invitation.permissions.length} Permission{invitation.permissions.length !== 1 ? "s" : ""}

            </td>

            <td>

                <span className={expired ? "expired" : ""}>

                    {new Date(invitation.expiresAt)
                        .toLocaleDateString()}

                </span>

            </td>

            <td className="pending-actions">

                 <button
                    title="Resend Invitation"
                    onClick={() => onResend(invitation.id)}
                >
                    <FiRefreshCw />
                </button>

                <button
                title="Cancel Invitation"
                    onClick={() =>
                        onCancel(invitation.id)
                    }
                >

                    <FiTrash2 />

                </button>

            </td>

        </tr>

    );

}


           