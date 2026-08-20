import { Navigate } from "react-router-dom";

export default function PermissionRoute({
    permission,
    children
}) {

    const permissions = (() => {
        try {
            return JSON.parse(
                localStorage.getItem("permissions") || "[]"
            );
        }
        catch {
            return [];
        }
    })();

    const permissionNames =
        permissions.map(p => p.name);

    const allowed =
        permissionNames.includes(permission);

    if (!allowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}