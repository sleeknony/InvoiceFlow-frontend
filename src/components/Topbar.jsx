import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Topbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

   /* console.log("TOPBAR USER:", user);*/

    // safe values
    const email = user?.email || "No email";
    const displayName =
        user?.name ||
        user?.firstName ||
        user?.email ||
        "User";

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-2 shadow-sm">

            {/* LEFT */}
            <div className="d-flex align-items-center">
                <span className="navbar-brand fw-bold fs-4 text-primary mb-0">
                    InvoiceFlow
                </span>
            </div>

            {/* RIGHT */}
            <div className="ms-auto d-flex align-items-center">

                {!isAuthenticated ? (
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn btn-outline-primary btn-sm">
                            Login
                        </Link>

                        <Link to="/register" className="btn btn-primary btn-sm">
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="dropdown">

                        {/* USER BUTTON */}
                        <button
                            className="btn border-0 d-flex align-items-center gap-2"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            {/* AVATAR */}
                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}
                            >
                                {displayName?.charAt(0)?.toUpperCase()}
                            </div>

                            {/* USER INFO */}
                            <div className="text-start">
                                <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                    {email}
                                </div>

                                {/*<small className="text-muted">*/}
                                {/*    Account*/}
                                {/*</small>*/}
                            </div>
                        </button>

                        {/* DROPDOWN */}
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">

                            {/* USER HEADER */}
                            <li className="px-3 py-2">
                                <div className="fw-semibold">
                                    {displayName}
                                </div>
                                <small className="text-muted">
                                    {email}
                                </small>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <Link className="dropdown-item" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>

                                <li>
                                    <Link className="dropdown-item" to="/documents">
                                        My Invoices
                                    </Link>
                                </li>
                            {/*<li>*/}
                            {/*    <Link className="dropdown-item" to="/profile">*/}
                            {/*        Profile*/}
                            {/*    </Link>*/}
                            {/*</li>*/}

                            <li>
                                <Link className="dropdown-item" to="/settings">
                                    Settings
                                    </Link>
                            </li>

                            

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>

                        </ul>

                    </div>
                )}

            </div>
        </nav>
    );
}