import RoleTableRow from "./RoleTableRow";

export default function RoleTable({
    roles,
    onEdit,
    onDeactivate,
    onReactivate
}) {

    if (!roles.length) {
        return (
            <div className="role-management-empty">

                <h3>No roles found</h3>

                <p>
                    Try adjusting your search or filters.
                </p>

            </div>
        );
    }

    return (
        <div className="role-management-table-wrapper">

            <table className="role-management-table">

                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Type</th>
                        <th>Permissions</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    {roles.map(role => (
                        <RoleTableRow
                            key={role.id}
                            role={role}
                            onEdit={onEdit}
                            onDeactivate={onDeactivate}
                            onReactivate={onReactivate}
                        />
                    ))}

                </tbody>

            </table>

        </div>
    );
}