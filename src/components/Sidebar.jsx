//import { NavLink } from "react-router-dom";

//const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

//export default function Sidebar() {
//    return (
//        <aside className="sidebar">
//            <div className="brand">
//                <div className="brand-badge">IF</div>
//                <div>
//                    <div className="brand-title">InvoiceFlow</div>
//                    <div className="brand-sub">Frontend</div>
//                </div>
//            </div>

//            <nav className="nav">
//                <NavLink className={linkClass} to="/dashboard">Dashboard</NavLink>
//                <NavLink className={linkClass} to="/customers">Customers</NavLink>
//                <NavLink className={linkClass} to="/documents">Documents</NavLink>
//                <NavLink className={linkClass} to="/documents/new">Create Document</NavLink>
//            </nav>

//            <div className="sidebar-footer">
//                <div className="tiny"> </div>
//            </div>
//        </aside>
//    );
//}


import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div>

            <h4 className="mb-4 fw-bold">InvoiceFlow</h4>

            <nav className="nav flex-column gap-2">

                <NavLink className="nav-link text-white" to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink className="nav-link text-white" to="/customers">
                    Customers
                </NavLink>

                <NavLink className="nav-link text-white" to="/documents/create">
                    Documents
                </NavLink>

            </nav>

        </div>
    );
}