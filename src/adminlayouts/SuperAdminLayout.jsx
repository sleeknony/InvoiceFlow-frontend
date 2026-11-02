import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import SuperAdminTopbar from "../components/SuperAdminTopbar";
import Footer from "../components/Footer";

export default function SuperAdminLayout() {
    return (
        <div className="container-fluid app-layout">
            <div className="row min-vh-100">

                {/* =====================================================
                    SUPERADMIN SIDEBAR
                ===================================================== */}

                <div className="col-12 col-md-2 bg-dark text-white p-3 app-sidebar">
                    <SuperAdminSidebar />
                </div>

                {/* =====================================================
                    MAIN APPLICATION AREA
                ===================================================== */}

                <div className="col-12 col-md-10 p-0 d-flex flex-column app-main">

                    <SuperAdminTopbar />

                    {/* =================================================
                        PAGE CONTENT
                    ================================================= */}

                    <main className="bg-light flex-grow-1 app-content p-4">
                        <Outlet />
                    </main>

                    {/* =================================================
                        GLOBAL FOOTER
                    ================================================= */}

                    <Footer />

                </div>

            </div>
        </div>
    );
}