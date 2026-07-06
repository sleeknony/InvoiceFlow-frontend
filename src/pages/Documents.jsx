
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import DocumentTypeBadge from "../components/DocumentTypeBadge";
import { DOCUMENT_TYPES } from "../utils/constants";
import { getAllInvoices } from "../services/documentService";
import currencySymbol from "../utils/currency";
import DocumentStatusBadge from "../components/documentStatusBadge";

const PAGE_SIZE = 10;

export default function Documents() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            setLoading(true);

            const data = await getAllInvoices();

            setDocs(data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        let result = docs;

        if (filterType !== "All") {
            result = result.filter(
                x => x.type === filterType
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();

            result = result.filter(x =>
                x.documentNumber?.toLowerCase().includes(q) ||
                x.customerName?.toLowerCase().includes(q)
            );
        }

        return result;
    }, [docs, filterType, search]);

    const totalPages = Math.ceil(
        filtered.length / PAGE_SIZE
    );

    const pagedDocuments = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;

        return filtered.slice(
            start,
            start + PAGE_SIZE
        );
    }, [filtered, page]);

    useEffect(() => {
        setPage(1);
    }, [filterType, search]);

    return (
        <div>
            <PageHeader
                title="Documents"
                subtitle="Invoices, quotes, receipts, delivery notes and more"
                actions={
                    <Link
                        className="btn btn-primary"
                        to="/documents/create"
                    >
                        Create Document
                    </Link>
                }
            />

            <div className="card shadow-sm border-0">
                <div className="card-body">

                    <div className="row g-3 mb-4">

                        <div className="col-md-4">
                            <label className="form-label">
                                Search
                            </label>

                            <input
                                className="form-control"
                                placeholder="Document number or customer"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">
                                Document Type
                            </label>

                            <select
                                className="form-select"
                                value={filterType}
                                onChange={(e) =>
                                    setFilterType(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="All">
                                    All Documents
                                </option>

                                {DOCUMENT_TYPES.map(t => (
                                    <option
                                        key={t.value}
                                        value={t.value}
                                    >
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading documents...</p>
                    ) : pagedDocuments.length === 0 ? (
                        <p className="text-muted">
                            No documents found.
                        </p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">

                                    <thead>
                                        <tr>
                                            <th>Number</th>
                                            <th>Type</th>
                                            <th>Customer</th>
                                                    <th>Issue Date</th>
                                                    <th>Status</th>
                                            <th className="text-end">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pagedDocuments.map(d => (
                                            <tr key={d.id}>
                                                <td>
                                                    <Link
                                                        to={`/documents/${d.id}`}
                                                    >
                                                        {d.documentNumber}
                                                    </Link>
                                                </td>

                                                <td>
                                                    <DocumentTypeBadge
                                                        type={d.type}
                                                    />
                                                </td>

                                                <td>
                                                    {d.customerName}
                                                </td>

                                                <td>
                                                    {new Date(
                                                        d.issueDate
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <DocumentStatusBadge
                                                        status={d.status}
                                                    />
                                                </td>
                                                <td className="text-end fw-bold">
                                                    {currencySymbol(
                                                        d.total,
                                                        d.currency
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-end gap-2 mt-3">

                                    <button
                                        className="btn btn-outline-secondary"
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span className="align-self-center">
                                        Page {page} of {totalPages}
                                    </span>

                                    <button
                                        className="btn btn-outline-secondary"
                                        disabled={
                                            page === totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}



//import { Link } from "react-router-dom";
//import { useMemo, useState } from "react";
//import PageHeader from "../components/PageHeader.jsx";
//import DocumentTypeBadge from "../components/DocumentTypeBadge.jsx";
//import { DOCUMENT_TYPES } from "../utils/constants.jsx";

//export default function Documents() {
//    const [docs] = useState([]); // will come from API later
//    const [filterType, setFilterType] = useState("All");

//    const filtered = useMemo(() => {
//        if (filterType === "All") return docs;
//        return docs.filter((d) => d.type === filterType);
//    }, [docs, filterType]);

//    return (
//        <div>
//            <PageHeader
//                title="Documents"
//                subtitle="Invoices, quotes, receipts, POs, delivery notes…"
//                actions={
//                    <Link className="btn" to="/documents/new">
//                        Create Document
//                    </Link>
//                }
//            />

//            <div className="card">
//                <div className="row">
//                    <div className="row-item">
//                        <label className="muted">Filter by type</label>
//                        <select className="input" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
//                            <option value="All">All</option>
//                            {DOCUMENT_TYPES.map((t) => (
//                                <option key={t.value} value={t.value}>{t.label}</option>
//                            ))}
//                        </select>
//                    </div>
//                </div>

//                {filtered.length === 0 ? (
//                    <p className="muted">No documents yet. Create your first one.</p>
//                ) : (
//                    <div className="table-wrap">
//                        <table className="table">
//                            <thead>
//                                <tr>
//                                    <th>Number</th>
//                                    <th>Type</th>
//                                    <th>Status</th>
//                                    <th>Customer</th>
//                                    <th className="right">Total</th>
//                                </tr>
//                            </thead>
//                            <tbody>
//                                {filtered.map((d) => (
//                                    <tr key={d.id}>
//                                        <td>
//                                            <Link to={`/documents/${d.id}`}>{d.number}</Link>
//                                        </td>
//                                        <td><DocumentTypeBadge type={d.type} /></td>
//                                        <td>{d.status}</td>
//                                        <td>{d.customerName}</td>
//                                        <td className="right"><Money value={d.total} currency={d.currency} /></td>
//                                    </tr>
//                                ))}
//                            </tbody>
//                        </table>
//                    </div>
//                )}
//            </div>
//        </div>
//    );
//}
