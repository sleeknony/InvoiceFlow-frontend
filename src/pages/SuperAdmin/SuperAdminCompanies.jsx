import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getSuperAdminCompanies,
} from "../../services/superAdminService";

export default function SuperAdminCompanies() {

    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const result =
                await getSuperAdminCompanies({
                    search,
                    page,
                    pageSize,
                });

            setCompanies(result?.items || []);
            setTotalCount(result?.totalCount || 0);
            setTotalPages(result?.totalPages || 0);

        } catch (err) {

            console.error(
                "Failed to load SuperAdmin companies:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load companies."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadCompanies();
    }, [page]);


    const handleSearchSubmit = (e) => {

        e.preventDefault();

        setPage(1);
        loadCompanies();
    };

    const handleCompanyClick = (companyId) => {
        navigate(
            `/superadmin/companies/${companyId}`
        );
    };

    //const handleCompanyClick = (companyId) => {

    //    navigate(
    //        `/superadmin/companies/${companyId}/users`
    //    );
    //};


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


    const renderPagination = () => {

        if (totalPages <= 1) {
            return null;
        }

        const pages = [];

        for (let i = 1; i <= totalPages; i++) {

            if (
                i === 1 ||
                i === totalPages ||
                Math.abs(i - page) <= 2
            ) {
                pages.push(i);
            }
        }

        const uniquePages = [...new Set(pages)];

        const items = [];

        let previousPage = null;

        uniquePages.forEach((pageNumber) => {

            if (
                previousPage !== null &&
                pageNumber - previousPage > 1
            ) {
                items.push(
                    <li
                        key={`ellipsis-${pageNumber}`}
                        className="page-item disabled"
                    >
                        <span className="page-link">
                            ...
                        </span>
                    </li>
                );
            }

            items.push(
                <li
                    key={pageNumber}
                    className={`page-item ${pageNumber === page
                            ? "active"
                            : ""
                        }`}
                >
                    <button
                        type="button"
                        className="page-link"
                        onClick={() =>
                            setPage(pageNumber)
                        }
                    >
                        {pageNumber}
                    </button>
                </li>
            );

            previousPage = pageNumber;
        });

        return (
            <nav
                aria-label="Company pagination"
                className="mt-4"
            >
                <ul className="pagination justify-content-end mb-0">

                    <li
                        className={`page-item ${page <= 1
                                ? "disabled"
                                : ""
                            }`}
                    >
                        <button
                            type="button"
                            className="page-link"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) =>
                                    Math.max(
                                        1,
                                        current - 1
                                    )
                                )
                            }
                        >
                            Previous
                        </button>
                    </li>

                    {items}

                    <li
                        className={`page-item ${page >= totalPages
                                ? "disabled"
                                : ""
                            }`}
                    >
                        <button
                            type="button"
                            className="page-link"
                            disabled={
                                page >= totalPages
                            }
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(
                                        totalPages,
                                        current + 1
                                    )
                                )
                            }
                        >
                            Next
                        </button>
                    </li>

                </ul>
            </nav>
        );
    };


    return (
        <div className="container-fluid">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">
                        SuperAdmin
                    </h2>

                    <p className="text-muted mb-0">
                        Manage companies and their users.
                    </p>

                </div>

                <div className="text-end">

                    <div
                        className="fw-semibold"
                        style={{
                            fontSize: "1.25rem",
                        }}
                    >
                        {totalCount}
                    </div>

                    <div
                        className="text-muted"
                        style={{
                            fontSize: "0.8rem",
                        }}
                    >
                        Companies
                    </div>

                </div>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (
                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                >

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={loadCompanies}
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <form
                        onSubmit={handleSearchSubmit}
                        className="row g-3 align-items-end"
                    >

                        <div className="col-md-8 col-lg-6">

                            <label
                                className="form-label fw-semibold"
                            >
                                Search companies
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Company name or email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-auto">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Search
                            </button>

                        </div>

                        <div className="col-auto">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {

                                    setSearch("");
                                    setPage(1);

                                    setTimeout(
                                        () =>
                                            loadCompanies(),
                                        0
                                    );
                                }}
                            >
                                Clear
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* =====================================================
                COMPANY TABLE
            ===================================================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">

                    <div>

                        <h5 className="mb-1">
                            Companies
                        </h5>

                        <small className="text-muted">
                            Select a company to manage its users.
                        </small>

                    </div>

                    {!loading && (
                        <span className="text-muted small">
                            Page {page}
                            {totalPages > 0 &&
                                ` of ${totalPages}`}
                        </span>
                    )}

                </div>


                <div className="card-body p-0">

                    {loading ? (

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
                                Loading companies...
                            </div>

                        </div>

                    ) : companies.length === 0 ? (

                        <div className="text-center py-5">

                            <div className="text-muted mb-2">
                                No companies found.
                            </div>

                            {search && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {

                                        setSearch("");
                                        setPage(1);

                                        setTimeout(
                                            () =>
                                                loadCompanies(),
                                            0
                                        );
                                    }}
                                >
                                    Clear search
                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th className="px-4">
                                            Company
                                        </th>

                                        <th>
                                            Owner
                                        </th>

                                        <th>
                                            Users
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Subscription
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th className="text-end px-4">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {companies.map(
                                        (company) => (

                                            <tr
                                                key={
                                                    company.id
                                                }
                                            >

                                                <td className="px-4">

                                                    <div className="fw-semibold">
                                                        {
                                                            company.name
                                                        }
                                                    </div>

                                                    <div className="text-muted small">
                                                        Created{" "}
                                                        {
                                                            formatDate(
                                                                company.createdAt
                                                            )
                                                        }
                                                    </div>

                                                </td>


                                                <td>

                                                    <div>
                                                        {
                                                            company.ownerName ||
                                                            "-"
                                                        }
                                                    </div>

                                                    {company.ownerEmail && (
                                                        <div className="text-muted small">
                                                            {
                                                                company.ownerEmail
                                                            }
                                                        </div>
                                                    )}

                                                </td>


                                                <td>

                                                    <span className="fw-semibold">
                                                        {
                                                            company.userCount ??
                                                            0
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="badge bg-light text-dark border">
                                                        {
                                                            company.planName ||
                                                            "Free"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="text-muted small">
                                                        {
                                                            formatDate(
                                                                company.subscriptionEndDate
                                                            )
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {company.isActive ? (

                                                        <span className="badge bg-success-subtle text-success">
                                                            Active
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-danger-subtle text-danger">
                                                            Inactive
                                                        </span>

                                                    )}

                                                </td>


                                                <td className="text-end px-4">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            handleCompanyClick(
                                                                company.id
                                                            )
                                                        }
                                                    >
                                                        View Company
                                                    </button>

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


            {renderPagination()}

        </div>
    );
}