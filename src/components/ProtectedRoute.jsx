//import { Navigate } from "react-router-dom";

//export default function ProtectedRoute({ children }) {
//    const token = localStorage.getItem("token");

//    return token ? children : <Navigate to="/login" />;
//}

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
export default function ProtectedRoute({ children }) {
    /*const { isAuthenticated } = useAuth();*/


    const auth = useAuth();

    /*console.log("PROTECTED ROUTE AUTH:", auth);*/

    if (!auth) {
        return <div>Auth Context Missing</div>;
    }

    const { isAuthenticated } = auth;

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
}