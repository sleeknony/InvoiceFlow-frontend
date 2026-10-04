import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function SuperAdminRoute({ children }) {

    const auth = useAuth();

    if (!auth) {
        return (
            <div>
                Auth Context Missing
            </div>
        );
    }

    const {
        user,
        isAuthenticated
    } = auth;

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const roles = Array.isArray(user?.roles)
        ? user.roles
        : [];

    const isSuperAdmin =
        roles.some(
            role =>
                String(role).toLowerCase() ===
                "superadmin"
        );

    if (!isSuperAdmin) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return children;
}