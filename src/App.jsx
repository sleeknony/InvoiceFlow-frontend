import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Customers from "./pages/Customers/Customers";
import Documents from "./pages/Documents/Documents.jsx";
import DocumentEditor from "./pages/DocumentEditor.jsx";
import NotFound from "./pages/NotFound.jsx";
import Settings from "./pages/Settings/Settings";
import DocumentViewer from "./pages/Documents/DocumentViewer";
import Pricing from "./pages/Pricing/Pricing";
import PaymentResult from "./pages/Subscription/PaymentResult";
import SubscriptionBilling from "./pages/Subscription/SubscriptionBilling";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import TeamManagement from "./pages/TeamManagement/TeamManagement";
import SetupCompany from "./pages/Company/SetupCompany";
import BulkInvite from "./pages/TeamManagement/BulkInvite/BulkInvite";
import BulkCustomerImport  from "./pages/Customers/BulkCustomerImport";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AcceptInvitation from "./pages/Auth/AcceptInvitation";
import InvitationRegister  from "./pages/Auth/InvitationRegister";
import Unauthorized from "./pages/Unauthorized.jsx";
import PermissionRoute from "./components/PermissionRoute.jsx";
import RoleManagement from "./pages/RoleManagement/RoleManagement";

export default function App() {
    return (
        <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
            <Route path="/invitation-register/:token" element={<InvitationRegister />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* PROTECTED APP */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route
                    path="/customers/bulk-import"
                    element={<BulkCustomerImport />}
                />

                <Route path="/customers/:id" element={<CustomerDetails />} />

                <Route
                    path="/documents/create"
                    element={
                        <PermissionRoute permission="CreateDocuments">
                        <DocumentEditor mode="create" />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/documents/edit/:id"
                    element={
                        <PermissionRoute permission="EditDocuments">
                        <DocumentEditor mode="edit" />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <PermissionRoute
                            permission="ViewCompanySettings"
                        >
                            <Settings />
                        </PermissionRoute>
                    }
                />

                <Route path="/documents" element={
                <PermissionRoute permission="ViewDocuments">
                        <Documents />

                    </PermissionRoute>}
                    
                    />

                <Route
                    path="/documents/:id"
                    element={ <PermissionRoute permission="ViewDocuments">
                        <DocumentViewer /> </PermissionRoute>
                    }
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
                    element={ <PermissionRoute permission="ManageCompanySubscriptions">
                    <SubscriptionBilling />
                    </PermissionRoute>}
                />

                <Route
                    path="/team"
       
                    element={<PermissionRoute permission= "ViewUsers">
                        <TeamManagement />
                       </PermissionRoute>
                    }
                />

                <Route
                    path="/setup-company"
                    element={<SetupCompany />}
                />

                <Route
                    path="/settings/roles"
                    element={<RoleManagement />}
                />

                <Route
                    path="/team/bulk-invite"
                    element={
                        <BulkInvite
                            onBack={() =>
                                navigate("/team")
                            }
                        />
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

