import "./DocumentHeader.css";

import {
    useRenderDocument
} from "../../renderer/RenderContext";
import formatDate
    from "../../utils/formatDate";
import { useDocument}  from "../../renderer/RenderContext";

export default function DocumentHeader() {

    const {

        company,

        meta,

        flags

    } = useDocument();

    const logo =

        company.logo?.base64 ??

        company.logo?.url;

    return (

        <header className="document-header">

            <section className="company-section">

                {company.logo?.exists ? (

                    <img
                        src={logo}
                        alt={company.name}
                        className="company-logo"
                        crossOrigin="anonymous"
                    />

                ) : (

                    <div className="company-logo-placeholder">

                        {company.name?.charAt(0)}

                    </div>

                )}

                <div className="company-details">

                    <h1>

                        {company.name}

                    </h1>

                    {company.address && (

                        <div>

                            {company.address}

                        </div>

                    )}

                    {company.phone && (

                        <div>

                            {company.phone}

                        </div>

                    )}

                    {company.email && (

                        <div>

                            {company.email}

                        </div>

                    )}

                    {company.website && (

                        <div>

                            {company.website}

                        </div>

                    )}

                </div>

            </section>

            <section className="document-info">

                <h2>

                    {meta.title}

                </h2>

                <table className="document-meta">

                    <tbody>

                        <tr>

                            <td>Document No.</td>

                            <td>{meta.documentNumber}</td>

                        </tr>

                        <tr>

                            <td>Date</td>

                            <td>{formatDate(meta.formattedIssueDate)}</td>

                        </tr>
                        {meta.dateLabel && meta.dateValue && (

                            <tr>

                                <td>{meta.dateLabel}</td>

                                <td>{meta.formattedSecondaryDate}</td>

                            </tr>

                        )}

                        {flags.showStatus && (

                            <tr>

                                <td>Status</td>

                                <td>

                                    <span className={`status-badge status-${meta.status?.toLowerCase()}`}>

                                        {meta.status}

                                    </span>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </section>

        </header>

    );

}