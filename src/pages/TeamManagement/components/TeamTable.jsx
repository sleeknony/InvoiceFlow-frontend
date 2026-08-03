import TeamTableRow from "./TeamTableRow";

import "./TeamTable.css";

export default function TeamTable({

    members,

    onEdit,

    onPermissions,

    onToggleStatus,

    onRemove

}) {


    if (!members.length) {

        return (

            <div className="team-table-empty">

                <h3>No team members found</h3>

                <p>
                    Try adjusting your search or filters.
                </p>

            </div>

        );

    }

    return (

        <div className="team-table-wrapper">

            <table className="team-table">

                <thead>

                    <tr>

                        <th>User</th>

                        <th>Role</th>

                        <th>Permissions</th>

                        <th>Status</th>

                        <th>Joined</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {members.map(member => (

                        <TeamTableRow

                            key={member.id}

                            member={member}

                            onEdit={onEdit}

                            onPermissions={onPermissions}

                            onToggleStatus={onToggleStatus}

                            onRemove={onRemove}

                        />

                    ))}

                </tbody>

            </table>

        </div>

    );

}