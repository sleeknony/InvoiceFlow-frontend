import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PermissionRoute from "./components/PermissionRoute.jsx";
import SuperAdminRoute from "./components/SuperAdminRoute.jsx";
import SuperAdminLayout from "./layouts/SuperAdminLayout.jsx";
import SuperAdminActivity from "./pages/SuperAdmin/SuperAdminActivity";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AcceptInvitation from "./pages/Auth/AcceptInvitation";
import InvitationRegister from "./pages/Auth/InvitationRegister";
import Unauthorized from "./pages/Unauthorized.jsx";
import Pricing from "./pages/Pricing/Pricing";
import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/Privacy";
import CancellationRefund from "./pages/Legal/CancellationRefund";

// ============================================================
// SUPERADMIN PAGES
// ============================================================
import SuperAdminCompanies from "./pages/SuperAdmin/SuperAdminCompanies.jsx";
import SuperAdminCompanyUsers from "./pages/SuperAdmin/SuperAdminCompanyUsers.jsx";
import SuperAdminCompanyDetails from "./pages/SuperAdmin/SuperAdminCompanyDetails";
import SuperAdminSubscriptionHistory from "./pages/SuperAdmin/SuperAdminSubscriptionHistory";



// ============================================================
// APPLICATION PAGES
// ============================================================

import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Customers from "./pages/Customers/Customers";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import BulkCustomerImport from "./pages/Customers/BulkCustomerImport";

import Documents from "./pages/Documents/Documents.jsx";
import DocumentViewer from "./pages/Documents/DocumentViewer";
import DocumentEditor from "./pages/DocumentEditor.jsx";

import Settings from "./pages/Settings/Settings";
import SubscriptionBilling from "./pages/Subscription/SubscriptionBilling";
import PaymentResult from "./pages/Subscription/PaymentResult";

import TeamManagement from "./pages/TeamManagement/TeamManagement";
import BulkInvite from "./pages/TeamManagement/BulkInvite/BulkInvite";

import SetupCompany from "./pages/Company/SetupCompany";
import RoleManagement from "./pages/RoleManagement/RoleManagement";

import NotFound from "./pages/NotFound.jsx";



function BulkInvitePage() {

    const navigate = useNavigate();

    return (
        <BulkInvite
            onBack={() =>
                navigate("/team")
            }
        />
    );
}


export default function App() {

    return (

        <Routes>

            {/* ====================================================
                PUBLIC ROUTES
            ==================================================== */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/verify-email"
                element={<VerifyEmail />}
            />

            <Route
                path="/accept-invitation/:token"
                element={<AcceptInvitation />}
            />

            <Route
                path="/invitation-register/:token"
                element={<InvitationRegister />}
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            {/* ====================================================
                PUBLIC LEGAL / COMMERCIAL PAGES
            ==================================================== */}

            {/*<Route*/}
            {/*    path="/pricing"*/}
            {/*    element={<Pricing />}*/}
            {/*/>*/}

            <Route
                path="/terms"
                element={<Terms />}
            />

            <Route
                path="/privacy"
                element={<Privacy/>}
            />

            <Route
                path="/cancellation-refund"
                element={<CancellationRefund />}
                />

            {/* ====================================================
                PROTECTED APPLICATION
            ==================================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* =================================================
                    CUSTOMERS
                ================================================= */}

                <Route
                    path="/customers"
                    element={<Customers />}
                />

                <Route
                    path="/customers/bulk-import"
                    element={<BulkCustomerImport />}
                />

                <Route
                    path="/customers/:id"
                    element={<CustomerDetails />}
                />


                {/* =================================================
                    DOCUMENTS
                ================================================= */}

                <Route
                    path="/documents"
                    element={
                        <PermissionRoute
                            permission="ViewDocuments"
                        >
                            <Documents />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/documents/create"
                    element={
                        <PermissionRoute
                            permission="CreateDocuments"
                        >
                            <DocumentEditor
                                mode="create"
                            />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/documents/edit/:id"
                    element={
                        <PermissionRoute
                            permission="EditDocuments"
                        >
                            <DocumentEditor
                                mode="edit"
                            />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/documents/:id"
                    element={
                        <PermissionRoute
                            permission="ViewDocuments"
                        >
                            <DocumentViewer />
                        </PermissionRoute>
                    }
                />


                {/* =================================================
                    SETTINGS
                ================================================= */}

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

                <Route
                    path="/settings/roles"
                    element={<RoleManagement />}
                />


                {/* =================================================
                    SUBSCRIPTION
                ================================================= */}

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
                    element={
                        <PermissionRoute
                            permission="ManageCompanySubscriptions"
                        >
                            <SubscriptionBilling />
                        </PermissionRoute>
                    }
                />


                {/* =================================================
                    TEAM
                ================================================= */}

                <Route
                    path="/team"
                    element={
                        <PermissionRoute
                            permission="ViewUsers"
                        >
                            <TeamManagement />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/team/bulk-invite"
                    element={<BulkInvitePage />}
                />


                {/* =================================================
                    COMPANY
                ================================================= */}

                <Route
                    path="/setup-company"
                    element={<SetupCompany />}
                />

            </Route>


               {/* =================================================
                     SUPER ADMIN
                   ================================================= */}
       
            <Route
                path="/superadmin"
                element={
                    <SuperAdminRoute>
                        <SuperAdminLayout />
                    </SuperAdminRoute>
                }
            >
                <Route
                    path="companies"
                    element={<SuperAdminCompanies />}
                />

                <Route
                    path="companies/:companyId"
                    element={<SuperAdminCompanyDetails />}
                />

                <Route
                    path="companies/:companyId/users"
                    element={<SuperAdminCompanyUsers />}
                />

                <Route
                    path="companies/:companyId/subscriptions"
                    element={<SuperAdminSubscriptionHistory />}
                />

                <Route
                    path="activity"
                    element={<SuperAdminActivity />}
                />
            </Route>


            {/* ====================================================
                NOT FOUND
            ==================================================== */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>
    );
}

