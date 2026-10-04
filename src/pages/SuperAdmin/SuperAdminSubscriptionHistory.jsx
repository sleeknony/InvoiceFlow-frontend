import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
    getSuperAdminCompany,
    getSuperAdminCompanySubscriptionHistory,
} from "../../services/superAdminService";

const getPlanName = (value) => {
    if (!value) return "-";
    return String(value);
};

const getBillingCycleName = (value) => {
    if (!value) return "-";
    return String(value);
};

const getActionClass = (action) => {
    switch (String(action).toLowerCase()) {
        case "customerpurchase":
            return "bg-success-subtle text-success";

        case "paymentreconciled":
            return "bg-info-subtle text-info";

        case "superadminchange":
            return "bg-primary-subtle text-primary";

        case "renewal":
            return "bg-success-subtle text-success";

        case "cancellation":
            return "bg-warning-subtle text-warning";

        case "expiration":
            return "bg-danger-subtle text-danger";

        default:
            return "bg-secondary-subtle text-secondary";
    }
};

const formatAction = (action) => {
    if (!action) return "-";

    const value = String(action);

    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (character) =>
            character.toUpperCase()
        );
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString();
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString();
};

const formatAmount = (amount, currency) => {
    if (amount === null || amount === undefined) {
        return "-";
    }

    return `${currency || "NGN"} ${Number(amount).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;
};

const SuperAdminSubscriptionHistory = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);

    const [history, setHistory] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] =
        useState(false);

    const loadCompany = async () => {
        try {
            const result =
                await getSuperAdminCompany(companyId);

            setCompany(result);
        } catch (error) {
            console.error(
                "Failed to load company:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to Load Company",
                text:
                    error?.response?.data?.message ||
                    "The company could not be loaded.",
            });
        }
    };

    const loadHistory = async (
        requestedPage = page,
        requestedPageSize = pageSize
    ) => {
        try {
            setHistoryLoading(true);

            const result =
                await getSuperAdminCompanySubscriptionHistory(
                    companyId,
                    requestedPage,
                    requestedPageSize
                );

            const items =
                result.items ??
                result.Items ??
                [];

            const currentPage =
                result.page ??
                result.Page ??
                requestedPage;

            const currentPageSize =
                result.pageSize ??
                result.PageSize ??
                requestedPageSize;

            const currentTotalCount =
                result.totalCount ??
                result.TotalCount ??
                0;

            const currentTotalPages =
                result.totalPages ??
                result.TotalPages ??
                0;

            setHistory(items);
            setPage(currentPage);
            setPageSize(currentPageSize);
            setTotalCount(currentTotalCount);
            setTotalPages(currentTotalPages);
        } catch (error) {
            console.error(
                "Failed to load subscription history:",
                error
            );

            setHistory([]);
            setTotalCount(0);
            setTotalPages(0);

            Swal.fire({
                icon: "error",
                title: "Unable to Load History",
                text:
                    error?.response?.data?.message ||
                    "Subscription history could not be loaded.",
            });
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            await Promise.all([
                loadCompany(),
                loadHistory(1, pageSize),
            ]);

            setLoading(false);
        };

        load();
    }, [companyId]);

    const handlePageChange = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page
        ) {
            return;
        }

        loadHistory(newPage, pageSize);
    };

    const handlePageSizeChange = (event) => {
        const newPageSize =
            Number(event.target.value);

        setPageSize(newPageSize);

        loadHistory(1, newPageSize);
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
                        Loading subscription history...
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
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mb-3"
                        onClick={() =>
                            navigate(
                                `/superadmin/companies/${companyId}`
                            )
                        }
                    >
                        ← Back 
                    </button>

                    <h3 className="mb-1">
                        Subscription History
                    </h3>

                    {company && (
                        <div className="text-muted">
                            {company.name ||
                                company.companyName ||
                                `Company #${companyId}`}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                        loadHistory(page, pageSize)
                    }
                    disabled={historyLoading}
                >
                    {historyLoading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* SUMMARY */}
            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="text-muted small mb-1">
                                Current Plan
                            </div>

                            <div className="fs-5 fw-semibold">
                                {company?.planName ||
                                    company?.subscriptionPlan ||
                                    "-"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="text-muted small mb-1">
                                History Records
                            </div>

                            <div className="fs-5 fw-semibold">
                                {totalCount}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="text-muted small mb-1">
                                Current Subscription End
                            </div>

                            <div className="fs-5 fw-semibold">
                                {formatDate(
                                    company?.subscriptionEndDate
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* HISTORY TABLE */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">

                    <div>
                        <h5 className="mb-0">
                            Subscription Activity
                        </h5>

                        <small className="text-muted">
                            Complete subscription change history
                        </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">

                        <span className="text-muted small">
                            Rows:
                        </span>

                        <select
                            className="form-select form-select-sm"
                            style={{ width: "90px" }}
                            value={pageSize}
                            onChange={
                                handlePageSizeChange
                            }
                            disabled={historyLoading}
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

                    {historyLoading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No subscription history found.
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
                                            Action
                                        </th>

                                        <th>
                                            Previous Plan
                                        </th>

                                        <th>
                                            New Plan
                                        </th>

                                        <th>
                                            Billing
                                        </th>

                                        <th>
                                            Period
                                        </th>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            Performed By
                                        </th>

                                        <th>
                                            Reason
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {history.map(
                                        (item) => {
                                            const historyId =
                                                item.id ??
                                                item.Id;

                                            const previousPlan =
                                                item.previousPlan ??
                                                item.PreviousPlan;

                                            const plan =
                                                item.plan ??
                                                item.Plan;

                                            const billingCycle =
                                                item.billingCycle ??
                                                item.BillingCycle;

                                            const startDate =
                                                item.startDate ??
                                                item.StartDate;

                                            const endDate =
                                                item.endDate ??
                                                item.EndDate;

                                            const amount =
                                                item.paymentAmount ??
                                                item.PaymentAmount;

                                            const currency =
                                                item.paymentCurrency ??
                                                item.PaymentCurrency;

                                            const action =
                                                item.action ??
                                                item.Action;

                                            const performedBy =
                                                item.performedByUserName ??
                                                item.PerformedByUserName;

                                            const reason =
                                                item.reason ??
                                                item.Reason;

                                            const transactionReference =
                                                item.transactionReference ??
                                                item.TransactionReference;

                                            const createdAt =
                                                item.createdAt ??
                                                item.CreatedAt;

                                            return (
                                                <tr
                                                    key={
                                                        historyId
                                                    }
                                                >

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {formatDateTime(
                                                                createdAt
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${getActionClass(
                                                                action
                                                            )}`}
                                                        >
                                                            {formatAction(
                                                                action
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {getPlanName(
                                                            previousPlan
                                                        )}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {getPlanName(
                                                                plan
                                                            )}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {getBillingCycleName(
                                                            billingCycle
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div>
                                                            {formatDate(
                                                                startDate
                                                            )}
                                                        </div>

                                                        <small className="text-muted">
                                                            to{" "}
                                                            {formatDate(
                                                                endDate
                                                            )}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {amount !==
                                                            null &&
                                                            amount !==
                                                            undefined ? (
                                                            <>
                                                                <div>
                                                                    {formatAmount(
                                                                        amount,
                                                                        currency
                                                                    )}
                                                                </div>

                                                                {transactionReference && (
                                                                    <small className="text-muted">
                                                                        {
                                                                            transactionReference
                                                                        }
                                                                    </small>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">
                                                                No payment
                                                            </span>
                                                        )}
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

                        <div className="d-flex justify-content-between align-items-center">

                            <div className="text-muted small">
                                Showing page{" "}
                                <strong>
                                    {page}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {totalPages}
                                </strong>{" "}
                                ({totalCount} records)
                            </div>

                            <div className="d-flex gap-1">

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                        handlePageChange(
                                            page - 1
                                        )
                                    }
                                    disabled={
                                        page <= 1 ||
                                        historyLoading
                                    }
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    {
                                        length: totalPages,
                                    },
                                    (_, index) =>
                                        index + 1
                                )
                                    .filter(
                                        (pageNumber) =>
                                            pageNumber ===
                                            1 ||
                                            pageNumber ===
                                            totalPages ||
                                            Math.abs(
                                                pageNumber -
                                                page
                                            ) <= 2
                                    )
                                    .map(
                                        (pageNumber) => (
                                            <button
                                                key={
                                                    pageNumber
                                                }
                                                type="button"
                                                className={`btn btn-sm ${pageNumber ===
                                                        page
                                                        ? "btn-primary"
                                                        : "btn-outline-secondary"
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        pageNumber
                                                    )
                                                }
                                                disabled={
                                                    historyLoading
                                                }
                                            >
                                                {
                                                    pageNumber
                                                }
                                            </button>
                                        )
                                    )}

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                        handlePageChange(
                                            page + 1
                                        )
                                    }
                                    disabled={
                                        page >=
                                        totalPages ||
                                        historyLoading
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

export default SuperAdminSubscriptionHistory;