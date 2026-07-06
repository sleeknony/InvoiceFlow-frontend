import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            const mappedUser = {
                id: decoded.userId,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role,
            };

            setUser(mappedUser);
            localStorage.setItem("user", JSON.stringify(mappedUser));
        } catch (err) {
            console.error("Invalid token", err);
            logout();
        }
    }, [token]);

    const login = (jwtToken, userData = null) => {
       /* console.log("USER DATA RECEIVED:", userData);*/
        localStorage.setItem("token", jwtToken);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        }
        setToken(jwtToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    //console.log("AUTH CONTEXT VALUE:", {
    //    token,
    //    user,
    //    login,
    //    logout,
    //    isAuthenticated: !!token,
    //});
    return (
        <AuthContext.Provider
            value={{ token, user, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}