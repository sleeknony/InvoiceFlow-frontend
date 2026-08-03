import "./SignatureSection.css";

import PrintableSection
    from "../../../../PrintableSection";

import { useDocument } from "../../../../RenderContext";

import formatDate
    from "../../../../../utils/formatDate";

export default function SignatureSection() {

    const {

        approvals

    } = useDocument();

    if (!approvals?.enabled)
        return null;

    const approval = approvals.latest;

    return (

        <PrintableSection type="signature">

            <section className="signature-section">

                <div className="signature-block">

                    <div className="signature-line" />

                    {approval ? (

                        <>

                            <div className="signature-title">

                                Approved By

                            </div>

                            <div className="signature-name">

                                {approval.user}

                            </div>

                            <div className="signature-role">

                                {approval.role}

                            </div>

                            <div className="signature-date">

                                {formatDate(
                                    approval.date
                                )}

                            </div>

                        </>

                    ) : (

                        <>

                            <div className="signature-title">

                                Awaiting Approval

                            </div>

                        </>

                    )}

                </div>

            </section>

        </PrintableSection>

    );

}