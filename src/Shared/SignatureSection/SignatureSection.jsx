import "./SignatureSection.css";

export default function SignatureSection({
    document,
    settings,
    config
}) {

    if (!config?.features?.showSignature)
        return null;

    return (

        <section className="signature-section">

            <div className="signature-grid">

                {/* Customer Acceptance */}

                <div className="signature-box">

                    <div className="signature-title">

                        Customer Acceptance

                    </div>

                    <div className="signature-line"></div>

                    <div className="signature-meta">

                        Name / Signature

                    </div>

                </div>

                {/* Company Signature */}

                <div className="signature-box company-signature">

                    <div className="signature-title">

                        Authorized By

                    </div>

                    <div className="signature-image">

                        {settings?.signatureUrl ? (

                            <img
                                src={settings.signatureUrl}
                                alt="Signature"
                            />

                        ) : (

                            <div className="signature-placeholder">

                                No Signature

                            </div>

                        )}

                    </div>

                    <div className="signature-name">

                        {settings?.authorizedName ||
                            settings?.companyName}

                    </div>

                    <div className="signature-position">

                        {settings?.authorizedTitle ||
                            "Authorized Signatory"}

                    </div>

                </div>

            </div>

            {/* Company Seal */}

            {config.features.showCompanySeal && (

                <div className="company-seal">

                    {settings?.companySealUrl ? (

                        <img
                            src={settings.companySealUrl}
                            alt="Company Seal"
                        />

                    ) : (

                        <div className="seal-placeholder">

                            COMPANY SEAL

                        </div>

                    )}

                </div>

            )}

        </section>

    );

}