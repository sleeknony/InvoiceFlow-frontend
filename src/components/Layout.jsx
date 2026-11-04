//import { useState } from "react";
//import Sidebar from "./Sidebar";
//import Topbar from "./Topbar";
//import Footer from "./Footer";
//import { Outlet } from "react-router-dom";
//import { SubscriptionProvider } from "../context/SubscriptionContext";

//export default function Layout() {
//    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//    const toggleSidebar = () => {
//        setSidebarCollapsed(current => !current);
//    };

//    return (
//        <SubscriptionProvider>
//            <div className="app-layout">
//                <div className="app-shell">

//                    {/* SIDEBAR */}
//                    <div
//                        className={`app-sidebar-column ${sidebarCollapsed
//                                ? "app-sidebar-column-collapsed"
//                                : ""
//                            }`}
//                    >
//                        <Sidebar
//                            collapsed={sidebarCollapsed}
//                            onToggle={toggleSidebar}
//                        />
//                    </div>

//                    {/* APPLICATION AREA */}
//                    <div className="app-content-column">

//                        <Topbar />

//                        <main className="app-content bg-light flex-grow-1 p-4">
//                            <Outlet />
//                        </main>

//                        <Footer />

//                    </div>

//                </div>
//            </div>
//        </SubscriptionProvider>
//    );
//}


import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { SubscriptionProvider } from "../context/SubscriptionContext";

export default function Layout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(current => !current);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <SubscriptionProvider>
            <div className="app-layout">
                <div className="app-shell">

                    {mobileMenuOpen && (
                        <button
                            type="button"
                            className="mobile-sidebar-backdrop"
                            aria-label="Close navigation menu"
                            onClick={closeMobileMenu}
                        />
                    )}

                    <div
                        className={`app-sidebar-column ${sidebarCollapsed ? "app-sidebar-column-collapsed" : ""
                            } ${mobileMenuOpen ? "mobile-sidebar-open" : ""}`}
                    >
                        <Sidebar
                            collapsed={sidebarCollapsed}
                            onToggle={toggleSidebar}
                            onNavigate={closeMobileMenu}
                        />
                    </div>

                    <div className="app-content-column">
                        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

                        <main className="app-content bg-light flex-grow-1 p-4">
                            <Outlet />
                        </main>

                        <Footer />
                    </div>
                </div>
            </div>
        </SubscriptionProvider>
    );
}