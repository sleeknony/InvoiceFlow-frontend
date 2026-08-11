import { Navigate } from "react-router-dom";

export default function PermissionRoute({
    permission,
    children
}) {

    const permissions =
        JSON.parse(
            localStorage.getItem("permissions") || "[]"
        );

    const allowed =
        permissions.includes(permission);

    if (!allowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}