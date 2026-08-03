import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="container-fluid app-layout">
            <div className="row min-vh-100">

                <div className="col-12 col-md-2 bg-dark text-white p-3 app-sidebar">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10 p-0 d-flex flex-column app-main">

                    <Topbar />

                    <div className="p-4 bg-light flex-grow-1 app-content">
                        <Outlet />
                    </div>

                </div>

            </div>
        </div>
    );
}