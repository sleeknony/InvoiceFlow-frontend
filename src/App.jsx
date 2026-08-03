import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers/Customers";
import Documents from "./pages/Documents.jsx";
import DocumentEditor from "./pages/DocumentEditor.jsx";
import NotFound from "./pages/NotFound.jsx";
import Settings from "./pages/Settings/Settings";
import DocumentViewer from "./pages/DocumentViewer";
import Pricing from "./pages/Pricing/Pricing";
import PaymentResult from "./pages/Subscription/PaymentResult";
import SubscriptionBilling from "./pages/Subscription/SubscriptionBilling";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import TeamManagement from "./pages/TeamManagement/TeamManagement";
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
                <Route path="/customers/:id" element={<CustomerDetails />}
                />

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

                <Route
                    path="/pricing"
                    element={<Pricing />}
                />

                <Route
                    path="/subscription/payment-result"
                    element={<PaymentResult />}
                />

                <Route
                    path="/subscription/billing"
                    element={<SubscriptionBilling />}
                />

                <Route
                    path="/team"
                    element={<TeamManagement />}
                />

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}