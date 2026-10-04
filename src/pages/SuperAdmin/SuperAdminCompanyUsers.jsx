import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import {
    getSuperAdminCompany,
    getSuperAdminCompanyRoles,
    getSuperAdminCompanyUser,
    changeSuperAdminUserRole,
    activateSuperAdminCompanyUser,
    deactivateSuperAdminCompanyUser,
} from "../../services/superAdminService";


export default function SuperAdminCompanyUsers() {

    const navigate = useNavigate();

    const { companyId } = useParams();


    const [company, setCompany] = useState(null);
    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [selectedUser, setSelectedUser] =
        useState(null);

    const [selectedUserDetails, setSelectedUserDetails] =
        useState(null);

    const [loadingUserDetails, setLoadingUserDetails] =
        useState(false);


    const [showRoleModal, setShowRoleModal] =
        useState(false);

    const [selectedRoleId, setSelectedRoleId] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [changingRole, setChangingRole] =
        useState(false);

    const [roleError, setRoleError] =
        useState("");

    const [roleSuccess, setRoleSuccess] =
        useState("");


    const [changingStatus, setChangingStatus] =
        useState(false);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                companyResult,
                rolesResult,
            ] = await Promise.all([
                getSuperAdminCompany(companyId),
                getSuperAdminCompanyRoles(companyId),
            ]);

            setCompany(companyResult);
            setRoles(rolesResult || []);

        } catch (err) {

            console.error(
                "Failed to load SuperAdmin company:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load company."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (companyId) {
            loadData();
        }

    }, [companyId]);


    const loadUserDetails = async (user) => {

        try {

            setSelectedUser(user);
            setLoadingUserDetails(true);
            setSelectedUserDetails(null);
            setRoleSuccess("");
            setRoleError("");

            const details =
                await getSuperAdminCompanyUser(
                    companyId,
                    user.id
                );

            setSelectedUserDetails(details);

        } catch (err) {

            console.error(
                "Failed to load user details:",
                err
            );

            setRoleError(
                err?.response?.data?.message ||
                "Unable to load user details."
            );

        } finally {

            setLoadingUserDetails(false);
        }
    };


    const openRoleModal = () => {

        if (!selectedUserDetails) {
            return;
        }

        setSelectedRoleId(
            selectedUserDetails.companyRoleId
                ?.toString() || ""
        );

        setReason("");
        setRoleError("");
        setRoleSuccess("");

        setShowRoleModal(true);
    };


    const closeRoleModal = () => {

        if (changingRole) {
            return;
        }

        setShowRoleModal(false);
        setRoleError("");
    };


    const handleRoleChange = async (e) => {

        e.preventDefault();

        if (!selectedUserDetails) {
            return;
        }

        if (!selectedRoleId) {

            setRoleError(
                "Please select a role."
            );

            return;
        }

        if (!reason.trim()) {

            setRoleError(
                "A reason is required."
            );

            return;
        }


        const selectedRole =
            roles.find(
                (role) =>
                    Number(role.id) ===
                    Number(selectedRoleId)
            );


        if (!selectedRole) {

            setRoleError(
                "The selected role could not be found."
            );

            return;
        }


        if (
            Number(selectedRoleId) ===
            Number(selectedUserDetails.companyRoleId)
        ) {

            setRoleError(
                "The selected role is already assigned to this user."
            );

            return;
        }


        const confirmed = window.confirm(
            `Change ${selectedUserDetails.name}'s role from "${selectedUserDetails.role}" to "${selectedRole.displayName}"?\n\nReason: ${reason.trim()}`
        );

        if (!confirmed) {
            return;
        }


        try {

            setChangingRole(true);
            setRoleError("");
            setRoleSuccess("");

            const result =
                await changeSuperAdminUserRole(
                    companyId,
                    selectedUserDetails.id,
                    Number(selectedRoleId),
                    reason.trim()
                );


            setRoleSuccess(
                `Role changed successfully from "${result.oldRoleName}" to "${result.newRoleName}".`
            );

            setShowRoleModal(false);


            // Refresh company data so the table
            // immediately reflects the new role.
            await loadData();


            // Refresh selected user details.
            const refreshedUser =
                await getSuperAdminCompanyUser(
                    companyId,
                    selectedUserDetails.id
                );

            setSelectedUserDetails(
                refreshedUser
            );

            setSelectedUser(
                refreshedUser
            );

        } catch (err) {

            console.error(
                "Failed to change user role:",
                err
            );

            setRoleError(
                err?.response?.data?.message ||
                "Unable to change the user's role."
            );

        } finally {

            setChangingRole(false);
        }
    };


    const handleStatusChange = async () => {

        if (!selectedUserDetails) {
            return;
        }

        const isActive =
            selectedUserDetails.isActive;

        const action =
            isActive
                ? "deactivate"
                : "activate";


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${selectedUserDetails.name}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setChangingStatus(true);
            setRoleError("");
            setRoleSuccess("");

            if (isActive) {

                await deactivateSuperAdminCompanyUser(
                    companyId,
                    selectedUserDetails.id
                );

            } else {

                await activateSuperAdminCompanyUser(
                    companyId,
                    selectedUserDetails.id
                );
            }


            setRoleSuccess(
                `User ${action}d successfully.`
            );


            await loadData();


            const refreshedUser =
                await getSuperAdminCompanyUser(
                    companyId,
                    selectedUserDetails.id
                );

            setSelectedUserDetails(
                refreshedUser
            );

            setSelectedUser(
                refreshedUser
            );

        } catch (err) {

            console.error(
                "Failed to change user status:",
                err
            );

            setRoleError(
                err?.response?.data?.message ||
                `Unable to ${action} the user.`
            );

        } finally {

            setChangingStatus(false);
        }
    };


    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString();
    };


    if (loading) {

        return (
            <div className="container-fluid">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="text-muted">
                        Loading company...
                    </div>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="container-fluid">

                <div className="alert alert-danger">

                    {error}

                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                >
                    <FiArrowLeft className="me-2" />
                    Back
                </button>

            </div>
        );
    }


    if (!company) {
        return null;
    }


    return (
        <div className="container-fluid">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                    <button
                        type="button"
                        className="btn btn-link p-0 mb-2 text-decoration-none d-inline-flex align-items-center"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft className="me-2" />
                        Back
                    </button>

                    <h2 className="mb-1">
                        {company.name}
                    </h2>

                    <p className="text-muted mb-0">
                        Manage company users and roles.
                    </p>

                </div>


                <div className="text-end">

                    <span
                        className={`badge ${company.isActive
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            }`}
                    >
                        {company.isActive
                            ? "Active"
                            : "Inactive"}
                    </span>

                    <div className="text-muted small mt-2">
                        {company.userCount} users
                    </div>

                </div>

            </div>


            {/* =====================================================
                SUCCESS / ERROR
            ===================================================== */}

            {roleSuccess && (
                <div
                    className="alert alert-success"
                >
                    {roleSuccess}
                </div>
            )}

            {roleError && !showRoleModal && (
                <div
                    className="alert alert-danger"
                >
                    {roleError}
                </div>
            )}


            {/* =====================================================
                COMPANY SUMMARY
            ===================================================== */}

            <div className="row g-3 mb-4">

                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-1">
                                Owner
                            </div>

                            <div className="fw-semibold">
                                {company.ownerName ||
                                    "-"}
                            </div>

                            <div className="text-muted small">
                                {company.ownerEmail ||
                                    ""}
                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-1">
                                Plan
                            </div>

                            <div className="fw-semibold">
                                {company.planName ||
                                    "Free"}
                            </div>

                            <div className="text-muted small">
                                Ends{" "}
                                {formatDate(
                                    company.subscriptionEndDate
                                )}
                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="text-muted small mb-1">
                                Company Created
                            </div>

                            <div className="fw-semibold">
                                {formatDate(
                                    company.createdAt
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                USERS
            ===================================================== */}

            <div className="row g-4">

                <div className="col-lg-8">

                    <div className="card border-0 shadow-sm">

                        <div className="card-header bg-white border-bottom">

                            <h5 className="mb-1">
                                Company Users
                            </h5>

                            <small className="text-muted">
                                Select a user to manage their account.
                            </small>

                        </div>


                        <div className="card-body p-0">

                            {company.users?.length === 0 ? (

                                <div className="text-center py-5 text-muted">
                                    This company has no users.
                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th className="px-4">
                                                    User
                                                </th>

                                                <th>
                                                    Role
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Created
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {company.users?.map(
                                                (user) => (

                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                        onClick={() =>
                                                            loadUserDetails(
                                                                user
                                                            )
                                                        }
                                                        style={{
                                                            cursor:
                                                                "pointer",
                                                        }}
                                                        className={
                                                            selectedUser?.id ===
                                                                user.id
                                                                ? "table-active"
                                                                : ""
                                                        }
                                                    >

                                                        <td className="px-4">

                                                            <div className="fw-semibold">
                                                                {
                                                                    user.name
                                                                }
                                                            </div>

                                                            <div className="text-muted small">
                                                                {
                                                                    user.email
                                                                }
                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="badge bg-light text-dark border">
                                                                {
                                                                    user.role
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {user.isActive ? (

                                                                <span className="badge bg-success-subtle text-success">
                                                                    Active
                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-secondary-subtle text-secondary">
                                                                    Inactive
                                                                </span>

                                                            )}

                                                        </td>


                                                        <td className="text-muted small">

                                                            {
                                                                formatDate(
                                                                    user.createdAt
                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    USER DETAILS
                ================================================= */}

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-header bg-white border-bottom">

                            <h5 className="mb-0">
                                User Details
                            </h5>

                        </div>


                        <div className="card-body">

                            {!selectedUser ? (

                                <div className="text-center text-muted py-4">

                                    <div className="mb-2">
                                        Select a user
                                    </div>

                                    <small>
                                        User details and role management will appear here.
                                    </small>

                                </div>

                            ) : loadingUserDetails ? (

                                <div className="text-center py-4">

                                    <div
                                        className="spinner-border spinner-border-sm text-primary mb-2"
                                        role="status"
                                    />

                                    <div className="text-muted small">
                                        Loading user...
                                    </div>

                                </div>

                            ) : selectedUserDetails ? (

                                <>

                                    <div className="mb-4">

                                        <div className="fw-semibold fs-5">
                                            {
                                                selectedUserDetails.name
                                            }
                                        </div>

                                        <div className="text-muted">
                                            {
                                                selectedUserDetails.email
                                            }
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <div className="text-muted small">
                                            Current Role
                                        </div>

                                        <div className="fw-semibold">
                                            {
                                                selectedUserDetails.role
                                            }
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <div className="text-muted small">
                                            Account Status
                                        </div>

                                        <div>

                                            {selectedUserDetails.isActive ? (

                                                <span className="badge bg-success-subtle text-success">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="badge bg-secondary-subtle text-secondary">
                                                    Inactive
                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    <div className="mb-4">

                                        <div className="text-muted small">
                                            Created
                                        </div>

                                        <div>
                                            {
                                                formatDate(
                                                    selectedUserDetails.createdAt
                                                )
                                            }
                                        </div>

                                    </div>


                                    <div className="d-grid gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={
                                                openRoleModal
                                            }
                                        >
                                            Change Role
                                        </button>


                                        <button
                                            type="button"
                                            className={`btn ${selectedUserDetails.isActive
                                                    ? "btn-outline-danger"
                                                    : "btn-outline-success"
                                                }`}
                                            disabled={
                                                changingStatus
                                            }
                                            onClick={
                                                handleStatusChange
                                            }
                                        >
                                            {changingStatus
                                                ? "Processing..."
                                                : selectedUserDetails.isActive
                                                    ? "Deactivate User"
                                                    : "Activate User"}
                                        </button>

                                    </div>

                                </>

                            ) : (

                                <div className="text-muted">
                                    Unable to load user details.
                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                CHANGE ROLE MODAL
            ===================================================== */}

            {showRoleModal && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)",
                    }}
                >

                    <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                    >

                        <div className="modal-content">

                            <form
                                onSubmit={
                                    handleRoleChange
                                }
                            >

                                <div className="modal-header">

                                    <h5 className="modal-title">
                                        Change User Role
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        disabled={
                                            changingRole
                                        }
                                        onClick={
                                            closeRoleModal
                                        }
                                    />

                                </div>


                                <div className="modal-body">

                                    <div className="mb-3">

                                        <div className="text-muted small">
                                            User
                                        </div>

                                        <div className="fw-semibold">
                                            {
                                                selectedUserDetails.name
                                            }
                                        </div>

                                        <div className="text-muted small">
                                            {
                                                selectedUserDetails.email
                                            }
                                        </div>

                                    </div>


                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Current Role
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={
                                                selectedUserDetails.role
                                            }
                                            disabled
                                        />

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="superAdminRole"
                                            className="form-label fw-semibold"
                                        >
                                            New Role
                                        </label>

                                        <select
                                            id="superAdminRole"
                                            className="form-select"
                                            value={
                                                selectedRoleId
                                            }
                                            onChange={(e) =>
                                                setSelectedRoleId(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                changingRole
                                            }
                                        >

                                            <option value="">
                                                Select a role...
                                            </option>

                                            {roles.map(
                                                (role) => (

                                                    <option
                                                        key={
                                                            role.id
                                                        }
                                                        value={
                                                            role.id
                                                        }
                                                    >
                                                        {
                                                            role.displayName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="mb-3">

                                        <label
                                            htmlFor="superAdminRoleReason"
                                            className="form-label fw-semibold"
                                        >
                                            Reason
                                        </label>

                                        <textarea
                                            id="superAdminRoleReason"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter the reason for this role change..."
                                            value={
                                                reason
                                            }
                                            onChange={(e) =>
                                                setReason(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                changingRole
                                            }
                                        />

                                        <div className="form-text">
                                            A reason is required and will be recorded in the SuperAdmin audit log.
                                        </div>

                                    </div>


                                    {roleError && (

                                        <div className="alert alert-danger mb-0">

                                            {roleError}

                                        </div>

                                    )}

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        disabled={
                                            changingRole
                                        }
                                        onClick={
                                            closeRoleModal
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            changingRole ||
                                            !selectedRoleId ||
                                            !reason.trim()
                                        }
                                    >
                                        {changingRole
                                            ? "Changing Role..."
                                            : "Confirm Role Change"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}