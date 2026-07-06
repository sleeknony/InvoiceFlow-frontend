import "./DocumentHeader.css";
import { getDocumentLabel }
    from "../../utils/documentTypes";

export default function DocumentHeader({
    document,
    settings
}) {
    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString()
            : "-";

    return (
        <div className="doc-header">

            {/* COMPANY */}

            <div className="company-section">

                {settings?.logoUrl ? (
                    <img
                        src={settings.logoUrl}
                        alt={settings.companyName}
                        className="company-logo"
                    />
                ) : (
                    <div className="company-logo-placeholder">
                        {settings?.companyName?.charAt(0) || "I"}
                    </div>
                )}

                <div className="company-details">

                    <h2>
                        {settings?.companyName}
                    </h2>

                    {settings?.address &&
                        <p>{settings.address}</p>}

                    {settings?.phone &&
                        <p>{settings.phone}</p>}

                    {settings?.email &&
                        <p>{settings.email}</p>}

                    {settings?.website &&
                        <p>{settings.website}</p>}
                </div>
            </div>

            {/* DOCUMENT DETAILS */}

            <div className="document-section">

                <h1 className="document-title">
                    {getDocumentLabel(
                        document.type
                    ).toUpperCase()}
                </h1>

                <table className="document-meta">
                    <tbody>

                        <tr>
                            <td>Number</td>
                            <td>
                                {document.number ||
                                    document.documentNumber}
                            </td>
                        </tr>

                        <tr>
                            <td>Issue Date</td>
                            <td>
                                {formatDate(
                                    document.issueDate
                                )}
                            </td>
                        </tr>

                        {document.dueDate && (
                            <tr>
                                <td>Due Date</td>
                                <td>
                                    {formatDate(
                                        document.dueDate
                                    )}
                                </td>
                            </tr>
                        )}

                        {document.validityDate && (
                            <tr>
                                <td>Valid Until</td>
                                <td>
                                    {formatDate(
                                        document.validityDate
                                    )}
                                </td>
                            </tr>
                        )}

                        {document.purchaseOrderNumber && (
                            <tr>
                                <td>PO Number</td>
                                <td>
                                    {
                                        document.purchaseOrderNumber
                                    }
                                </td>
                            </tr>
                        )}

                        {document.referenceNumber && (
                            <tr>
                                <td>Reference</td>
                                <td>
                                    {
                                        document.referenceNumber
                                    }
                                </td>
                            </tr>
                        )}

                        {document.originalDocumentNumber && (
                            <tr>
                                <td>
                                    Original Invoice
                                </td>
                                <td>
                                    {
                                        document.originalDocumentNumber
                                    }
                                </td>
                            </tr>
                        )}

                        {document.deliveryDate && (
                            <tr>
                                <td>
                                    Delivery Date
                                </td>
                                <td>
                                    {formatDate(
                                        document.deliveryDate
                                    )}
                                </td>
                            </tr>
                        )}

                        {document.deliveryMethod && (
                            <tr>
                                <td>
                                    Delivery Method
                                </td>
                                <td>
                                    {
                                        document.deliveryMethod
                                    }
                                </td>
                            </tr>
                        )}

                        {document.trackingNumber && (
                            <tr>
                                <td>
                                    Tracking No.
                                </td>
                                <td>
                                    {
                                        document.trackingNumber
                                    }
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>

            </div>

        </div>
    );
}