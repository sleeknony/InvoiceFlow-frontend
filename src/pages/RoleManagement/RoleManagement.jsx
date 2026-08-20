import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";

import companyRoleService from "../../services/companyRoleService";
import companyTeamService from "../../services/companyTeamService";

import RoleTable from "./components/RoleTable";
import RoleModal from "./components/RoleModal";

import "./RoleManagement.css";

export default function RoleManagement() {

    const [roles, setRoles] = useState([]);

    const [permissions, setPermissions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadingPermissions, setLoadingPermissions] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadRoles();

        loadPermissions();

    }, []);


    // =========================================================
    // LOAD ROLES
    // =========================================================

    async function loadRoles() {

        try {

            setLoading(true);

            setError("");

            const data =
                await companyRoleService.getRoles();

            setRoles(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (err) {

            console.error(
                "Error loading roles:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load roles.";

            setError(message);

            toast.error(message);

        }
        finally {

            setLoading(false);

        }

    }


    // =========================================================
    // LOAD AVAILABLE PERMISSIONS
    // =========================================================

    async function loadPermissions() {

        try {

            setLoadingPermissions(true);

            const data =
                await companyTeamService
                    .getAvailablePermissions();

            setPermissions(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (err) {

            console.error(
                "Error loading permissions:",
                err
            );

            toast.error(
                "Unable to load permissions."
            );

        }
        finally {

            setLoadingPermissions(false);

        }

    }


    // =========================================================
    // CREATE ROLE
    // =========================================================

    function handleCreateRole() {

        setSelectedRole(null);

        setShowModal(true);

    }


    // =========================================================
    // EDIT ROLE
    // =========================================================

    async function handleEditRole(role) {

        try {

            /*
             * Fetch the complete role.
             *
             * The table may only contain summary information,
             * while GetRoleAsync() returns the role permissions.
             */

            const fullRole =
                await companyRoleService.getRole(
                    role.id
                );

            setSelectedRole(fullRole);

            setShowModal(true);

        }
        catch (err) {

            console.error(
                "Error loading role:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load role.";

            toast.error(message);

        }

    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    function handleCloseModal() {

        setShowModal(false);

        setSelectedRole(null);

    }


    // =========================================================
    // ROLE CREATED / UPDATED
    // =========================================================

    async function handleRoleSaved() {

        await loadRoles();

        setShowModal(false);

        setSelectedRole(null);

    }

    // =========================================================
    // REACTIVATE ROLE
    // =========================================================
    async function handleReactivateRole(role) {

        const result = await Swal.fire({
            title: "Reactivate role?",
            text: `The role "${role.displayName}" will become available for assignment again.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, reactivate",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            await companyRoleService.reactivateRole(
                role.id
            );

            toast.success(
                "Role reactivated successfully."
            );

            await loadRoles();

        }
        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to reactivate role."
            );

        }
    }

    // =========================================================
    // DEACTIVATE ROLE
    // =========================================================

    async function handleDeactivateRole(role) {

        if (role.isSystemRole) {

            toast.error(
                "System roles cannot be deactivated."
            );

            return;

        }

        const result =
            await Swal.fire({

                title: "Deactivate role?",

                text:
                    `The role "${role.displayName}" will be deactivated.`,

                icon: "warning",

                showCancelButton: true,

                confirmButtonText:
                    "Yes, deactivate",

                cancelButtonText:
                    "Cancel"

            });


        if (!result.isConfirmed)
            return;


        try {

            await companyRoleService
                .deactivateRole(role.id);

            toast.success(
                "Role deactivated successfully."
            );

            await loadRoles();

        }
        catch (err) {

            console.error(
                "Error deactivating role:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to deactivate role.";

            toast.error(message);

        }

    }


    // =========================================================
    // FILTER ROLES
    // =========================================================

    const filteredRoles =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term)
                return roles;


            return roles.filter(role => {

                return (

                    role.name
                        ?.toLowerCase()
                        .includes(term)

                    ||

                    role.displayName
                        ?.toLowerCase()
                        .includes(term)

                    ||

                    role.description
                        ?.toLowerCase()
                        .includes(term)

                );

            });

        }, [roles, search]);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="role-management-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="role-management-header">

                <div>

                    <h1>
                        Role Management
                    </h1>

                    <p>
                        Create roles and assign permissions
                        to control what team members can do.
                    </p>

                </div>


                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCreateRole}
                >

                    <FiPlus />

                    Create Role

                </button>

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="role-management-toolbar">

                <div className="role-management-search">

                    <FiSearch className="role-management-search-icon" />

                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="role-management-toolbar-actions">

                    <button
                        type="button"
                        className="role-management-refresh-button"
                        onClick={loadRoles}
                    >
                        <FiRefreshCw />
                        Refresh
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && !loading && (

                <div className="role-management-error">

                    {error}

                </div>

            )}


            {/* =================================================
                ROLE TABLE
            ================================================= */}

            {!error && (

                <RoleTable

                    roles={filteredRoles}

                    loading={loading}

                    onEdit={handleEditRole}

                    onDeactivate={handleDeactivateRole}
                    onReactivate={handleReactivateRole}

                />

            )}


            {/* =================================================
                ROLE MODAL
            ================================================= */}

            <RoleModal

                open={showModal}

                role={selectedRole}

                permissions={permissions}

                loadingPermissions={
                    loadingPermissions
                }

                onClose={
                    handleCloseModal
                }

                onSuccess={
                    handleRoleSaved
                }

            />

        </div>

    );

}