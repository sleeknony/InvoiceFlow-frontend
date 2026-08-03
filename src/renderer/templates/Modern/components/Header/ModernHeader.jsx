import "./ModernHeader.css";

import { useDocument, useRenderPages } from "../../../../RenderContext";

export default function ModernHeader() {

    const {

        company,
        meta,
        flags

    } = useDocument();

    const pages = useRenderPages();
    const page = pages?.[0];

   
    const firstPage = page?.firstPage ?? true;

    const logo =

        company.logo?.base64 ??

        company.logo?.url;

 
    return (

        <header className="modern-header">

            {/* ==========================
                    TOP HEADER
            =========================== */}
            {

                firstPage && (

                    <>
                     

                        <div className="modern-header-top">

                            <div className="modern-company">

                                {

                                    company.logo?.exists ?

                                        (

                                            <img

                                                src={logo}

                                                alt={company.name}

                                                className="modern-company-logo"

                                                crossOrigin="anonymous"

                                            />

                                        )

                                        :

                                        (

                                            <div className="modern-logo-placeholder">

                                                {company.name?.charAt(0)}

                                            </div>

                                        )

                                }

                                <div className="modern-company-details">

                                    <h1>

                                        {company.name}

                                    </h1>

                                    {

                                        company.address &&

                                        <p>

                                            {company.address}

                                        </p>

                                    }

                                    {

                                        company.phone &&

                                        <p>

                                            {company.phone}

                                        </p>

                                    }

                                    {

                                        company.email &&

                                        <p>

                                            {company.email}

                                        </p>

                                    }

                                    {

                                        company.website &&

                                        <p>

                                            {company.website}

                                        </p>

                                    }

                                </div>

                            </div>

                            <div className="modern-document-title">

                                <h2>

                                    {meta.title}

                                </h2>

                                {

                                    meta.documentNumber &&

                                    <div className="modern-document-number">

                                        #

                                        {meta.documentNumber}

                                    </div>

                                }

                            </div>

                        </div>

                        {/* ==========================
                    ACCENT BAR
            =========================== */}

                        <div className="modern-header-accent" />

                        {/* ==========================
                    META INFORMATION
            =========================== */}

                        <div className="modern-meta-row">

                            <div className="modern-meta-card">

                                <span className="modern-meta-label">

                                    ISSUE DATE

                                </span>

                                <span className="modern-meta-value">

                                    {meta.formattedIssueDate}

                                </span>

                            </div>

                            {
                                meta.formattedSecondaryDate &&

                                <div className="modern-meta-card">

                                    <span className="modern-meta-label">
                                        {meta.dateLabel}
                                    </span>

                                    <span className="modern-meta-value">
                                        {meta.formattedSecondaryDate}
                                    </span>

                                </div>
                            }

                            {

                                flags.showStatus &&

                                <div className="modern-meta-card">

                                    <span className="modern-meta-label">

                                        STATUS

                                    </span>

                                    <span

                                        className={

                                            `modern-status modern-status-${meta.status?.toLowerCase()}`

                                        }

                                    >

                                        {meta.status}

                                    </span>

                                </div>

                            }

                        </div>

                    </>
                )
            }
        </header>

    );

}