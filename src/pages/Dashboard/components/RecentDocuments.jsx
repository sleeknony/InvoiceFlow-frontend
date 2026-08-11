import { Link } from "react-router-dom";
import DocumentStatusBadge from "../../../components/documentStatusBadge";

export default function RecentDocuments({
    documents = []
}) {
    return (
        <div className="card border-0 shadow-sm mt-4">

            <div className="card-header bg-white">
                <h5 className="mb-0">
                    Recent Documents
                </h5>
            </div>

            <div className="table-responsive">

                <table className="table table-hover mb-0">

                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {documents.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No recent documents found.
                            </td>
                        </tr>

                        ) : (

                        documents.map(doc => (

                            <tr key={doc.id}>

                                <td>
                                    <Link
                                        to={`/documents/${doc.id}`}
                                    >
                                        {doc.documentNumber}
                                    </Link>
                                </td>

                                <td>
                                    {doc.customerName}
                                </td>

                                <td>
                                    <DocumentStatusBadge status={doc.status}/>
                                </td>

                                <td>
                                    {doc.currency}{" "}
                                    {doc.total?.toLocaleString()}
                                </td>

                                <td>
                                    {new Date(
                                        doc.createdAt
                                    ).toLocaleDateString()}
                                </td>

                            </tr>

                        ))

                    )}
                        
                    </tbody>

                </table>

            </div>

        </div>
    );
}