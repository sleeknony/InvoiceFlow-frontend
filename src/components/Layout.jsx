//import Sidebar from "./Sidebar";
//import Topbar from "./Topbar";
//import Footer from "./Footer";
//import { Outlet } from "react-router-dom";
//import { SubscriptionProvider } from "../context/SubscriptionContext";

//export default function Layout() {
//    return (
//        <div className="container-fluid app-layout">
//            <div className="row min-vh-100">

//                {/* =====================================================
//                    SIDEBAR
//                ===================================================== */}

//                <div className="col-12 col-md-2 bg-dark text-white p-3 app-sidebar">
//                    <Sidebar />
//                </div>


//                {/* =====================================================
//                    MAIN APPLICATION AREA
//                ===================================================== */}

//                <div className="col-12 col-md-10 p-0 d-flex flex-column app-main">

//                    <Topbar />


//                    {/* =================================================
//                        PAGE CONTENT
//                    ================================================= */}

//                    <main className="bg-light flex-grow-1 app-content p-4">
//                        <Outlet />
//                    </main>


//                    {/* =================================================
//                        GLOBAL FOOTER
//                    ================================================= */}

//                    <Footer />

//                </div>

//            </div>
//        </div>
//    );
//}


import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { SubscriptionProvider } from "../context/SubscriptionContext";

export default function Layout() {
    return (
        <SubscriptionProvider>

            <div className="container-fluid app-layout">

                <div className="row min-vh-100">

                    {/* =====================================================
                        SIDEBAR
                    ===================================================== */}

                    <div className="col-12 col-md-2 bg-dark text-white p-3 app-sidebar">

                        <Sidebar />

                    </div>


                    {/* =====================================================
                        MAIN APPLICATION AREA
                    ===================================================== */}

                    <div className="col-12 col-md-10 p-0 d-flex flex-column app-main">

                        <Topbar />


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

        </SubscriptionProvider>
    );
}
