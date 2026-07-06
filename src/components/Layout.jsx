import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">

                {/* SIDEBAR */}
                <div className="col-12 col-md-2 bg-dark text-white p-3">
                    <Sidebar />
                </div>

                {/* MAIN AREA */}
                <div className="col-12 col-md-10 p-0 d-flex flex-column">

                    <Topbar />

                    <div className="p-4 bg-light flex-grow-1">
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    );
}