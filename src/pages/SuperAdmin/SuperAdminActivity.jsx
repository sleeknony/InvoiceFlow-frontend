import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getSuperAdminActivity,
    getSuperAdminCompanies,
} from "../../services/superAdminService";

const formatAction = (action) => {
    if (!action) return "-";

    return String(action)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (character) =>
            character.toUpperCase()
        );
};

const getActionClass = (action) => {
    switch (String(action).toLowerCase()) {
        case "companyactivated":
        case "companyuseractivated":
            return "bg-success-subtle text-success";

        case "companydeactivated":
        case "companyuserdeactivated":
            return "bg-danger-subtle text-danger";

        case "companyuserrolechanged":
            return "bg-primary-subtle text-primary";

        case "companysubscriptionchanged":
            return "bg-primary-subtle text-primary";

        case "companysubscriptionpaymentreconciled":
            return "bg-info-subtle text-info";

        default:
            return "bg-secondary-subtle text-secondary";
    }
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString();
};

const SuperAdminActivity = () => {
    const navigate = useNavigate();

    const [activities, setActivities] = useState([]);

    const [companies, setCompanies] = useState([]);

    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [activityLoading, setActivityLoading] =
        useState(false);

    const loadCompanies = async () => {
        try {
            const result =
                await getSuperAdminCompanies({
                    page: 1,
                    pageSize: 100,
                });

            setCompanies(
                result.items ??
                result.Items ??
                []
            );
        } catch (error) {
            console.error(
                "Failed to load companies:",
                error
            );
        }
    };

    const loadActivity = async ({
        requestedPage = page,
        requestedPageSize = pageSize,
    } = {}) => {
        try {
            setActivityLoading(true);

            const result =
                await getSuperAdminActivity({
                    search,
                    action,
                    companyId,
                    fromDate,
                    toDate,
                    page: requestedPage,
                    pageSize: requestedPageSize,
                });

            setActivities(
                result.items ??
                result.Items ??
                []
            );

            setPage(
                result.page ??
                result.Page ??
                requestedPage
            );

            setPageSize(
                result.pageSize ??
                result.PageSize ??
                requestedPageSize
            );

            setTotalCount(
                result.totalCount ??
                result.TotalCount ??
                0
            );

            setTotalPages(
                result.totalPages ??
                result.TotalPages ??
                0
            );
        } catch (error) {
            console.error(
                "Failed to load SuperAdmin activity:",
                error
            );

            setActivities([]);
            setTotalCount(0);
            setTotalPages(0);

            Swal.fire({
                icon: "error",
                title: "Unable to Load Activity",
                text:
                    error?.response?.data?.message ||
                    "Activity reports could not be loaded.",
            });
        } finally {
            setActivityLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);

            await Promise.all([
                loadCompanies(),
                loadActivity({
                    requestedPage: 1,
                    requestedPageSize: pageSize,
                }),
            ]);

            setLoading(false);
        };

        initialize();
    }, []);

    const handleApplyFilters = () => {
        loadActivity({
            requestedPage: 1,
            requestedPageSize: pageSize,
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setAction("");
        setCompanyId("");
        setFromDate("");
        setToDate("");

        setTimeout(() => {
            loadActivity({
                requestedPage: 1,
                requestedPageSize: pageSize,
            });
        }, 0);
    };

    const handlePageChange = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page
        ) {
            return;
        }

        loadActivity({
            requestedPage: newPage,
            requestedPageSize: pageSize,
        });
    };

    const handlePageSizeChange = (event) => {
        const newPageSize =
            Number(event.target.value);

        setPageSize(newPageSize);

        loadActivity({
            requestedPage: 1,
            requestedPageSize: newPageSize,
        });
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center py-5">
                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="mt-3 text-muted">
                        Loading activity reports...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h3 className="mb-1">
                        Activity Reports
                    </h3>

                    <p className="text-muted mb-0">
                        Review SuperAdmin activity across
                        the platform.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        loadActivity({
                            requestedPage: page,
                            requestedPageSize: pageSize,
                        })
                    }
                    disabled={activityLoading}
                >
                    {activityLoading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>

            {/* FILTERS */}
            <div className="card border-0 shadow-sm mb-4">

                <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0">
                        Filters
                    </h5>
                </div>

                <div className="card-body">

                    <div className="row g-3">

                        {/* SEARCH */}
                        <div className="col-md-6 col-lg-3">

                            <label className="form-label">
                                Search
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Company or reason..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* ACTION */}
                        <div className="col-md-6 col-lg-2">

                            <label className="form-label">
                                Action
                            </label>

                            <select
                                className="form-select"
                                value={action}
                                onChange={(e) =>
                                    setAction(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All Actions
                                </option>

                                <option value="CompanyActivated">
                                    Company Activated
                                </option>

                                <option value="CompanyDeactivated">
                                    Company Deactivated
                                </option>

                                <option value="CompanyUserActivated">
                                    User Activated
                                </option>

                                <option value="CompanyUserDeactivated">
                                    User Deactivated
                                </option>

                                <option value="CompanyUserRoleChanged">
                                    User Role Changed
                                </option>

                                <option value="CompanySubscriptionChanged">
                                    Subscription Changed
                                </option>

                                <option value="CompanySubscriptionPaymentReconciled">
                                    Payment Reconciled
                                </option>
                            </select>

                        </div>

                        {/* COMPANY */}
                        <div className="col-md-6 col-lg-3">

                            <label className="form-label">
                                Company
                            </label>

                            <select
                                className="form-select"
                                value={companyId}
                                onChange={(e) =>
                                    setCompanyId(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All Companies
                                </option>

                                {companies.map(
                                    (company) => {
                                        const id =
                                            company.id ??
                                            company.Id;

                                        const name =
                                            company.name ??
                                            company.companyName ??
                                            `Company #${id}`;

                                        return (
                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {name}
                                            </option>
                                        );
                                    }
                                )}
                            </select>

                        </div>

                        {/* FROM */}
                        <div className="col-md-6 col-lg-2">

                            <label className="form-label">
                                From
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* TO */}
                        <div className="col-md-6 col-lg-2">

                            <label className="form-label">
                                To
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="d-flex gap-2 mt-3">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={
                                handleApplyFilters
                            }
                            disabled={activityLoading}
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={
                                handleClearFilters
                            }
                            disabled={activityLoading}
                        >
                            Clear
                        </button>

                    </div>

                </div>

            </div>

            {/* ACTIVITY TABLE */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">

                    <div>
                        <h5 className="mb-0">
                            SuperAdmin Activity
                        </h5>

                        <small className="text-muted">
                            {totalCount} activity record
                            {totalCount === 1
                                ? ""
                                : "s"}
                        </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span className="text-muted small">
                            Per page
                        </span>

                        <select
                            className="form-select form-select-sm"
                            style={{
                                width: "80px",
                            }}
                            value={pageSize}
                            onChange={
                                handlePageSizeChange
                            }
                            disabled={activityLoading}
                        >
                            <option value={10}>
                                10
                            </option>

                            <option value={20}>
                                20
                            </option>

                            <option value={50}>
                                50
                            </option>

                            <option value={100}>
                                100
                            </option>
                        </select>

                    </div>

                </div>

                <div className="card-body p-0">

                    {activityLoading ? (
                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No activity records found.
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>
                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Company
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                        <th>
                                            Target User
                                        </th>

                                        <th>
                                            Performed By
                                        </th>

                                        <th>
                                            Reason
                                        </th>

                                        <th>
                                            Changes
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {activities.map(
                                        (activity) => {

                                            const id =
                                                activity.id ??
                                                activity.Id;

                                            const activityAction =
                                                activity.action ??
                                                activity.Action;

                                            const companyName =
                                                activity.companyName ??
                                                activity.CompanyName;

                                            const targetUserName =
                                                activity.targetUserName ??
                                                activity.TargetUserName;

                                            const performedBy =
                                                activity.performedByUserName ??
                                                activity.PerformedByUserName;

                                            const reason =
                                                activity.reason ??
                                                activity.Reason;

                                            const oldValue =
                                                activity.oldValue ??
                                                activity.OldValue;

                                            const newValue =
                                                activity.newValue ??
                                                activity.NewValue;

                                            const performedAt =
                                                activity.performedAt ??
                                                activity.PerformedAt;

                                            return (
                                                <tr
                                                    key={id}
                                                >

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {formatDateTime(
                                                                performedAt
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {companyName ||
                                                                `Company #${activity.companyId ??
                                                                activity.CompanyId
                                                                }`}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${getActionClass(
                                                                activityAction
                                                            )}`}
                                                        >
                                                            {formatAction(
                                                                activityAction
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {targetUserName ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {performedBy ||
                                                            "System"}
                                                    </td>

                                                    <td
                                                        style={{
                                                            minWidth:
                                                                "220px",
                                                        }}
                                                    >
                                                        {reason ||
                                                            "-"}
                                                    </td>

                                                    <td
                                                        style={{
                                                            minWidth:
                                                                "280px",
                                                        }}
                                                    >
                                                        {oldValue ||
                                                            newValue ? (
                                                            <div>
                                                                {oldValue && (
                                                                    <div className="small">
                                                                        <span className="text-muted">
                                                                            From:
                                                                        </span>{" "}
                                                                        {
                                                                            oldValue
                                                                        }
                                                                    </div>
                                                                )}

                                                                {newValue && (
                                                                    <div className="small">
                                                                        <span className="text-muted">
                                                                            To:
                                                                        </span>{" "}
                                                                        {
                                                                            newValue
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* PAGINATION */}
                {totalPages > 0 && (
                    <div className="card-footer bg-white border-top">

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                            <div className="text-muted small">
                                Showing{" "}
                                <strong>
                                    {((page - 1) *
                                        pageSize) +
                                        1}
                                </strong>
                                {" - "}
                                <strong>
                                    {Math.min(
                                        page *
                                        pageSize,
                                        totalCount
                                    )}
                                </strong>
                                {" of "}
                                <strong>
                                    {totalCount}
                                </strong>
                                {" activities"}
                            </div>

                            <div className="d-flex align-items-center gap-2">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={
                                        activityLoading ||
                                        page <= 1
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            page - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span className="small px-2">
                                    Page{" "}
                                    <strong>
                                        {page}
                                    </strong>
                                    {" "}of{" "}
                                    <strong>
                                        {totalPages}
                                    </strong>
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={
                                        activityLoading ||
                                        page >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            page + 1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default SuperAdminActivity;