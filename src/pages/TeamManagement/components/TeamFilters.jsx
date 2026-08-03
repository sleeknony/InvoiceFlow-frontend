import { FiRefreshCw, FiSearch } from "react-icons/fi";

import "./TeamFilters.css";

export default function TeamFilters({

    search,
    onSearchChange,

    role,
    onRoleChange,

    status,
    onStatusChange,

    onRefresh

}) {

    return (

        <div className="team-filters">

            <div className="team-search">

                <FiSearch className="team-search-icon" />

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                />

            </div>

            <select
                value={role}
                onChange={(e) =>
                    onRoleChange(e.target.value)
                }
            >

                <option value="">
                    All Roles
                </option>

                <option value="Owner">
                    Owner
                </option>

                <option value="Admin">
                    Admin
                </option>

                <option value="Manager">
                    Manager
                </option>

                <option value="Accountant">
                    Accountant
                </option>

                <option value="Staff">
                    Staff
                </option>

            </select>

            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(e.target.value)
                }
            >

                <option value="">
                    All Status
                </option>

                <option value="Active">
                    Active
                </option>

                <option value="Inactive">
                    Inactive
                </option>

            </select>

            <button
                className="team-refresh-button"
                onClick={onRefresh}
            >

                <FiRefreshCw />

                Refresh

            </button>

        </div>

    );

}