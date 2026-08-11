
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState} from "react";
import PageHeader from "../../components/PageHeader";
import DocumentTypeBadge from "../../components/DocumentTypeBadge";
import { DOCUMENT_TYPES } from "../../utils/constants";
import { getAllInvoices } from "../../services/documentService";
import currencySymbol from "../../utils/currency";
import DocumentStatusBadge from "../../components/documentStatusBadge";
import "./Documents.css"
import DocumentActionMenu from "./DocumentActionMenu";
import {FiFileText, FiDollarSign, FiCheckCircle, FiAlertTriangle} from "react-icons/fi";

const PAGE_SIZE = 10;

export default function Documents() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
  

    const [filterType, setFilterType] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortField, setSortField] =
        useState("issueDate");

    const [sortDirection, setSortDirection] =
        useState("desc");

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            setLoading(true);

            const data = await getAllInvoices();
            setDocs(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    function handleSort(field) {

        if (sortField === field) {

            setSortDirection(prev =>
                prev === "asc"
                    ? "desc"
                    : "asc"
            );

            return;
        }

        setSortField(field);
        setSortDirection("asc");
    }

    function renderSort(field) {

        if (sortField !== field)
            return " ⇅";

        return sortDirection === "asc"
            ? " ▲"
            : " ▼";
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

            result = result.filter(x => {

                const query = q;

                return (
                    x.documentNumber?.toLowerCase().includes(query) ||
                    x.customerName?.toLowerCase().includes(query) ||
                    x.type?.toLowerCase().includes(query) ||
                    x.status?.toLowerCase().includes(query)
                );

            });

        }

        return result;
    }, [docs, filterType, search]);

    const sortedDocuments = useMemo(() => {

        const data = [...filtered];

        data.sort((a, b) => {

            let valueA = a[sortField];
            let valueB = b[sortField];

            if (sortField === "issueDate") {

                valueA = new Date(valueA);
                valueB = new Date(valueB);

            }

            if (sortField === "total") {

                valueA = Number(valueA ?? 0);
                valueB = Number(valueB ?? 0);

            }

            if (typeof valueA === "string")
                valueA = valueA.toLowerCase();

            if (typeof valueB === "string")
                valueB = valueB.toLowerCase();

            if (valueA < valueB)
                return sortDirection === "asc" ? -1 : 1;

            if (valueA > valueB)
                return sortDirection === "asc" ? 1 : -1;

            return 0;

        });

        return data;

    }, [filtered, sortField, sortDirection]);


    const kpis = useMemo(() => {

        const documents = docs ?? [];

        const totalDocuments = documents.length;

        const totalPaid = documents
            .filter(d => d.status === "Paid")
            .reduce(
                (sum, d) => sum + (Number(d.total) || 0),
                0
            );

        const totalOutstanding = documents
            .filter(d =>
                ![
                    "Paid",
                    "Cancelled",
                    "Void"
                ].includes(d.status)
            )
            .reduce(
                (sum, d) => sum + (Number(d.total) || 0),
                0
            );

        const totalOverdue = documents
            .filter(d => d.status === "Overdue")
            .reduce(
                (sum, d) => sum + (Number(d.total) || 0),
                0
            );

        return {

            totalDocuments,

            totalPaid,

            totalOutstanding,

            totalOverdue

        };

    }, [docs]);

    const totalPages = Math.ceil(
        sortedDocuments.length / PAGE_SIZE
    );

    const pagedDocuments = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;

        return sortedDocuments.slice(
            start,
            start + PAGE_SIZE
        );
    }, [sortedDocuments, page]);

    //const handleDelete = async () => {
    //    setOpen(false);

    //    const result = await Swal.fire({
    //        title: "Delete document?",
    //        text: "This action cannot be undone.",
    //        icon: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "Delete",
    //        cancelButtonText: "Cancel",
    //        reverseButtons: true,
    //        confirmButtonColor: "#dc3545"
    //    });

    //    if (!result.isConfirmed)
    //        return;

    //    try {
    //        setDeleting(true);

    //        await deleteDocument(document.id);

    //        await Swal.fire({
    //            icon: "success",
    //            title: "Deleted",
    //            text: "Document deleted successfully.",
    //            timer: 1500,
    //            showConfirmButton: false
    //        });

    //        await onDeleted?.();
    //    }
    //    catch (err) {
    //        await Swal.fire({
    //            icon: "error",
    //            title: "Delete Failed",
    //            text:
    //                err?.response?.data?.message ??
    //                "Unable to delete document."
    //        });
    //    }
    //    finally {
    //        setDeleting(false);
    //    }
    //};

    useEffect(() => {
        setPage(1);
    }, [filterType, search]);

    return (
        <div className="documents-page">
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

            <div className="documents-stats">

                <div className="document-stat-card">

                    <div className="document-stat-icon">
                        <FiFileText />
                    </div>

                    <div>

                        <span>Total Documents</span>

                        <strong>
                            {kpis.totalDocuments}
                        </strong>

                    </div>

                </div>

                <div className="document-stat-card">

                    <div className="document-stat-icon">
                        <FiCheckCircle />
                    </div>

                    <div>

                        <span>Total Paid</span>

                        <strong>

                            {currencySymbol(
                                kpis.totalPaid,
                                docs[0]?.currency
                            )}

                        </strong>

                    </div>

                </div>

                <div className="document-stat-card">

                    <div className="document-stat-icon">
                        <FiAlertTriangle />
                    </div>

                    <div>

                        <span>Total Overdue</span>

                        <strong>

                            {currencySymbol(
                                kpis.totalOverdue,
                                docs[0]?.currency
                            )}

                        </strong>

                    </div>

                </div>

                <div className="document-stat-card">

                    <div className="document-stat-icon">
                        <FiDollarSign />
                    </div>

                    <div>

                        <span>Total Outstanding</span>

                        <strong>

                            {currencySymbol(
                                kpis.totalOutstanding,
                                docs[0]?.currency
                            )}

                        </strong>

                    </div>

                </div>


                

            </div>

            <div className="documents-panel">

                <div className="documents-toolbar">

                    <div className="documents-search">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.867-3.834zM12 6.5A5.5 5.5 0 1 1 1 6.5a5.5 5.5 0 0 1 11 0z" />
                        </svg>

                        <input
                            placeholder="Search by document number or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <div className="documents-result-count">
                        {filtered.length} document{filtered.length !== 1 ? "s" : ""}
                    </div>

                </div>

                <div className="documents-filters">

                    <button
                        className={`document-filter ${filterType === "All" ? "active" : ""
                            }`}
                        onClick={() => setFilterType("All")}
                    >
                        All
                    </button>

                    {DOCUMENT_TYPES.map(type => (

                        <button
                            key={type.value}
                            className={`document-filter ${filterType === type.value
                                    ? "active"
                                    : ""
                                }`}
                            onClick={() =>
                                setFilterType(type.value)
                            }
                        >
                            {type.label}
                        </button>

                    ))}

                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <small className="text-muted">
                        Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </small>

                    {(search || filterType !== "All") && (

                        <button
                            className="btn btn-link text-decoration-none p-0"
                            onClick={() => {
                                setSearch("");
                                setFilterType("All");
                            }}
                        >
                            Clear Filters
                        </button>

                    )}

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
                                    <table className="documents-table">

                                        <thead>
                                            <tr>
                                                <th
                                                    role="button"
                                                    onClick={() => handleSort("documentNumber")}
                                                >
                                                    Document
                                                    {renderSort("documentNumber")}
                                                </th>
                                                <th
                                                    role="button"
                                                    onClick={() => handleSort("customerName")}
                                                >
                                                    Customer
                                                    {renderSort("customerName")}
                                                </th>
                                                <th
                                                    role="button"
                                                    onClick={() => handleSort("type")}
                                                >
                                                    Type
                                                    {renderSort("type")}
                                                </th>
                                                <th
                                                    role="button"
                                                    onClick={() => handleSort("status")}
                                                >
                                                    Status
                                                    {renderSort("status")}
                                                </th>
                                                <th
                                                    className="text-end"
                                                    role="button"
                                                    onClick={() => handleSort("total")}
                                                >
                                                    Total
                                                    {renderSort("total")}
                                                </th>
                                                <th style={{ width: 60 }}></th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {pagedDocuments.map(d => (

                                                <tr key={d.id}>

                                                    <td>

                                                        <Link
                                                            to={`/documents/${d.id}`}
                                                            className="document-number"
                                                        >
                                                            {d.documentNumber}
                                                        </Link>

                                                        <span className="document-meta">
                                                            {new Date(d.issueDate).toLocaleDateString()}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="document-customer">

                                                            <strong>
                                                                {d.customerName}
                                                            </strong>

                                                            <small>
                                                                Customer
                                                            </small>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <DocumentTypeBadge
                                                            type={d.type}
                                                        />

                                                    </td>

                                                    <td>

                                                        <DocumentStatusBadge
                                                            status={d.status}
                                                        />

                                                    </td>

                                                    <td className="document-amount">

                                                        {currencySymbol(
                                                            d.total,
                                                            d.currency
                                                        )}

                                                    </td>

                                                    

                                                        <td className="text-end">
                                                            <DocumentActionMenu
                                                                document={d}
                                                                onDeleted={loadDocuments}
                                                            />
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
       
    );
}




