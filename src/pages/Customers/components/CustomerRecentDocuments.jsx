import { useNavigate } from "react-router-dom";
import { FiFileText, FiExternalLink } from "react-icons/fi";
import currencySymbol from "../../../utils/currency";

export default function CustomerRecentDocuments({

    documents

}) {

    const navigate = useNavigate();

    if (!documents || documents.length === 0) {

        return (

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body text-center py-5">

                    <FiFileText
                        size={40}
                        className="text-muted mb-3"
                    />

                    <h5>No Documents Yet</h5>

                    <p className="text-muted mb-0">

                        This customer has no documents.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h5 className="fw-bold mb-0">

                        Recent Documents

                    </h5>

                    <small className="text-muted">

                        {documents.length} document(s)

                    </small>

                </div>

                <div className="table-responsive">

                    <table className="table align-middle">

                        <thead>

                            <tr>

                                <th>Document</th>

                                <th>Type</th>

                                <th>Status</th>

                                <th>Total</th>

                                <th>Date</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                documents.map(doc => (

                                    <tr key={doc.id}>

                                        <td>

                                            <strong>

                                                {doc.documentNumber}

                                            </strong>

                                        </td>

                                        <td>

                                            {doc.type}

                                        </td>

                                        <td>

                                            <span
                                                className="badge bg-light text-dark border"
                                            >

                                                {doc.status}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                currencySymbol(

                                                    doc.total,

                                                    doc.currency

                                                )

                                            }

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    doc.issueDate

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            <button

                                                className="btn btn-sm btn-light"

                                                onClick={() =>

                                                    navigate(

                                                        `/documents/${doc.id}`

                                                    )

                                                }

                                            >

                                                <FiExternalLink />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}