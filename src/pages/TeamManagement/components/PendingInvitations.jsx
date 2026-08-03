import InvitationRow from "./InvitationRow";

import "./PendingInvitations.css";
import { FiMail } from "react-icons/fi";

export default function PendingInvitations({
    invitations,
    onResend,
    onCancel
}) {

    return (

        <div className="pending-card">

            <div className="pending-header">

                <h3>
                    Pending Invitations
                </h3>

                <span>
                    {invitations.length}
                </span>

            </div>

            {invitations.length === 0 ? (

                <div className="pending-empty">

                    <FiMail className="pending-empty-icon" />

                    <h4>No pending invitations</h4>

                    <p>
                        Click to invite a team member.
                    </p>

                </div>

            ) : (

                <table className="pending-table">

                    <thead>

                        <tr>

                            <th>Email</th>

                            <th>Role</th>

                            <th>Permissions</th>

                            <th>Expires</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {invitations.map(invitation => (

                            <InvitationRow
                                key={invitation.id}
                                invitation={invitation}
                                onResend={onResend}
                                onCancel={onCancel}
                            />

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

}