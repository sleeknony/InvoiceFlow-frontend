import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            /*
             * Preserve the user data already stored during login.
             *
             * The login API returns Identity roles separately:
             *
             * roles: ["SuperAdmin"]
             *
             * We must not replace that with a company-level
             * "role" property from the JWT.
             */

            const savedUser =
                localStorage.getItem("user");

            const existingUser =
                savedUser
                    ? JSON.parse(savedUser)
                    : {};

            const tokenRoles =
                decoded.role
                    ? Array.isArray(decoded.role)
                        ? decoded.role
                        : [decoded.role]
                    : [];

            const mappedUser = {
                ...existingUser,

                id:
                    decoded.userId ||
                    existingUser.id,

                email:
                    decoded.email ||
                    existingUser.email,

                name:
                    decoded.name ||
                    existingUser.name,

                /*
                 * Identity roles.
                 *
                 * Keep roles from login response if available.
                 * Otherwise fall back to JWT roles.
                 */
                roles:
                    Array.isArray(existingUser.roles)
                        ? existingUser.roles
                        : tokenRoles
            };

            setUser(mappedUser);

            localStorage.setItem(
                "user",
                JSON.stringify(mappedUser)
            );

        }
        catch (err) {
            console.error(
                "Invalid token",
                err
            );

            logout();
        }
    }, [token]);

    const login = (
        jwtToken,
        userData = null
    ) => {

        localStorage.setItem(
            "token",
            jwtToken
        );

        if (userData) {

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            setUser(userData);
        }

        setToken(jwtToken);
    };

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "permissions"
        );

        localStorage.removeItem(
            "companyRole"
        );

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

