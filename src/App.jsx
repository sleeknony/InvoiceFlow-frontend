import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Documents from "./pages/Documents.jsx";
import DocumentEditor from "./pages/DocumentEditor.jsx";
import NotFound from "./pages/NotFound.jsx";
import Settings from "./pages/Settings/Settings";
import DocumentViewer from "./pages/DocumentViewer";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED APP */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />

                <Route
                    path="/documents/create"
                    element={<DocumentEditor mode="create" />}
                />

                <Route
                    path="/documents/edit/:id"
                    element={<DocumentEditor mode="edit" />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/documents" element={<Documents />} />
                <Route
                    path="/documents/:id"
                    element={<DocumentViewer />}
                />

                {/*<Route*/}
                {/*    path="/documents/new"*/}
                {/*    element={<DocumentEditor mode="create" />}*/}
                {/*/>*/}

                {/*<Route*/}
                {/*    path="/documents/:id"*/}
                {/*    element={<DocumentEditor mode="edit" />}*/}
                {/*/>*/}

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}