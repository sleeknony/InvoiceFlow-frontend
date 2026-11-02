
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PermissionRoute from "./components/PermissionRoute.jsx";
import SuperAdminRoute from "./components/SuperAdminRoute.jsx";
import SuperAdminOnlyRoute from "./components/SuperAdminOnlyRoute.jsx";

import { useAuth } from "./context/useAuth";

import SuperAdminLayout from "./adminlayouts/SuperAdminLayout.jsx";
import SuperAdminActivity from "./pages/SuperAdmin/SuperAdminActivity";
import SuperAdminSupport from "./pages/SuperAdmin/SuperAdminSupport.jsx";
import SuperAdminSupportTicket from "./pages/SuperAdmin/SuperAdminSupportTicket.jsx";
import SuperAdminSupportAgents from "./pages/SuperAdmin/SuperAdminSupportAgents.jsx";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AcceptInvitation from "./pages/Auth/AcceptInvitation";
import SupportAgentSetup from "./pages/Auth/SupportAgentSetup.jsx";
import InvitationRegister from "./pages/Auth/InvitationRegister";
import Unauthorized from "./pages/Unauthorized.jsx";
import Pricing from "./pages/Pricing/Pricing";
import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/Privacy";
import CancellationRefund from "./pages/Legal/CancellationRefund";

// ============================================================
// SUPER ADMIN PAGES
// ============================================================

import SuperAdminCompanies from "./pages/SuperAdmin/SuperAdminCompanies.jsx";
import SuperAdminCompanyUsers from "./pages/SuperAdmin/SuperAdminCompanyUsers.jsx";
import SuperAdminCompanyDetails from "./pages/SuperAdmin/SuperAdminCompanyDetails";
import SuperAdminSubscriptionHistory from "./pages/SuperAdmin/SuperAdminSubscriptionHistory";
import SuperAdminCommunications from "./pages/SuperAdmin/SuperAdminCommunications.jsx";

// ============================================================
// COMPANY APPLICATION PAGES
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

import ReportsPage from "./pages/Reports/ReportsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import HelpSupport from "./pages/HelpSupport/HelpSupport.jsx";
import CustomerSupportTicketConversation from "./pages/HelpSupport/CustomerSupportTicketConversation";
import CustomerSupportTickets from "./components/Support/CustomerSupportTickets";

import NotFound from "./pages/NotFound.jsx";

// ============================================================
// BULK INVITE PAGE
// ============================================================

function BulkInvitePage() {
    const navigate = useNavigate();

    return (
        <BulkInvite
            onBack={() => navigate("/team")}
        />
    );
}

// ============================================================
// ROLE-AWARE LANDING PAGE FOR /superadmin
// ============================================================

function SuperAdminHomeRedirect() {
    const auth = useAuth();

    const roles = Array.isArray(auth?.user?.roles)
        ? auth.user.roles
        : [];

    const hasRole = (expectedRole) =>
        roles.some(
            role =>
                String(role).toLowerCase() ===
                expectedRole.toLowerCase()
        );

    if (hasRole("SupportAgent") && !hasRole("SuperAdmin")) {
        return <Navigate to="/superadmin/support" replace />;
    }

    return <Navigate to="/superadmin/companies" replace />;
}

// ============================================================
// PREVENT PLATFORM ACCOUNTS FROM ENTERING COMPANY APPLICATION
// ============================================================

function CompanyApplicationRoute({ children }) {
    const auth = useAuth();

    if (!auth?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(auth.user?.roles)
        ? auth.user.roles
        : [];

    const hasRole = (expectedRole) =>
        roles.some(
            role =>
                String(role).toLowerCase() ===
                expectedRole.toLowerCase()
        );

    if (hasRole("SuperAdmin")) {
        return <Navigate to="/superadmin/companies" replace />;
    }

    if (hasRole("SupportAgent")) {
        return <Navigate to="/superadmin/support" replace />;
    }

    return children;
}

// ============================================================
// APP
// ============================================================

export default function App() {
    return (
        <Routes>
            {/* ====================================================
                PUBLIC ROUTES
            ==================================================== */}

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/verify-email" element={<VerifyEmail />} />

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

            <Route
                path="/support-agent/setup"
                element={<SupportAgentSetup />}
            />

            {/* ====================================================
                PUBLIC LEGAL / COMMERCIAL PAGES
            ==================================================== */}

            <Route path="/terms" element={<Terms />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route
                path="/cancellation-refund"
                element={<CancellationRefund />}
            />

            {/* ====================================================
                PROTECTED COMPANY APPLICATION

                Super Admins and Support Agents are redirected
                away from this area by CompanyApplicationRoute.
            ==================================================== */}

            <Route
                element={
                    <ProtectedRoute>
                        <CompanyApplicationRoute>
                            <Layout />
                        </CompanyApplicationRoute>
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                {/* DASHBOARD */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* NOTIFICATIONS */}

                <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                />

                {/* CUSTOMERS */}

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

                {/* DOCUMENTS */}

                <Route
                    path="/documents"
                    element={
                        <PermissionRoute permission="ViewDocuments">
                            <Documents />
                        </PermissionRoute>
                    }
                />

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
                    path="/documents/:id"
                    element={
                        <PermissionRoute permission="ViewDocuments">
                            <DocumentViewer />
                        </PermissionRoute>
                    }
                />

                {/* SETTINGS */}

                <Route
                    path="/settings"
                    element={
                        <PermissionRoute permission="ViewCompanySettings">
                            <Settings />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/settings/roles"
                    element={<RoleManagement />}
                />

                {/* SUBSCRIPTION */}

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
                        <PermissionRoute permission="ManageCompanySubscriptions">
                            <SubscriptionBilling />
                        </PermissionRoute>
                    }
                />

                {/* TEAM */}

                <Route
                    path="/team"
                    element={
                        <PermissionRoute permission="ViewUsers">
                            <TeamManagement />
                        </PermissionRoute>
                    }
                />

                <Route
                    path="/team/bulk-invite"
                    element={<BulkInvitePage />}
                />

                {/* COMPANY ONBOARDING */}

                <Route
                    path="/setup-company"
                    element={<SetupCompany />}
                />

                {/* REPORTS */}

                <Route
                    path="/reports"
                    element={
                        <PermissionRoute permission="ViewReports">
                            <ReportsPage />
                        </PermissionRoute>
                    }
                />

                {/* HELP & SUPPORT */}

                <Route
                    path="/help"
                    element={<HelpSupport />}
                />

                <Route
                    path="/help/tickets/:ticketId"
                    element={
                       
                                <CustomerSupportTicketConversation />
                        
                    }
                />

                <Route
                    path="/help/tickets"
                    element={<CustomerSupportTickets />}
                />

            </Route>

            {/*<ProtectedRoute>*/}
            {/*    <Layout>*/}
            {/*    </Layout>*/}
            {/*</ProtectedRoute>*/}
            {/* ====================================================
                SHARED SUPER ADMIN / SUPPORT LAYOUT

                The outer guard admits SuperAdmin and SupportAgent.
                Individual routes below enforce page-level access.
            ==================================================== */}

            <Route
                path="/superadmin"
                element={
                    <SuperAdminRoute>
                        <SuperAdminLayout />
                    </SuperAdminRoute>
                }
            >
                <Route
                    index
                    element={<SuperAdminHomeRedirect />}
                />

                {/* SUPER ADMIN ONLY: COMPANY MANAGEMENT */}

                <Route
                    path="companies"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminCompanies />
                        </SuperAdminOnlyRoute>
                    }
                />

                <Route
                    path="companies/:companyId"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminCompanyDetails />
                        </SuperAdminOnlyRoute>
                    }
                />

                <Route
                    path="companies/:companyId/users"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminCompanyUsers />
                        </SuperAdminOnlyRoute>
                    }
                />

                <Route
                    path="companies/:companyId/subscriptions"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminSubscriptionHistory />
                        </SuperAdminOnlyRoute>
                    }
                />

                {/* SUPER ADMIN ONLY: PLATFORM OPERATIONS */}

                <Route
                    path="activity"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminActivity />
                        </SuperAdminOnlyRoute>
                    }
                />

                <Route
                    path="communications"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminCommunications />
                        </SuperAdminOnlyRoute>
                    }
                />

                <Route
                    path="support-agents"
                    element={
                        <SuperAdminOnlyRoute>
                            <SuperAdminSupportAgents />
                        </SuperAdminOnlyRoute>
                    }
                />

                {/* SHARED: SUPPORT TICKETS */}

                <Route
                    path="support"
                    element={<SuperAdminSupport />}
                />

                <Route
                    path="support/tickets/:ticketId"
                    element={<SuperAdminSupportTicket />}
                />
            </Route>

            {/* ====================================================
                NOT FOUND
            ==================================================== */}

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
