import "./DocumentFooter.css";

export default function DocumentFooter({
    document,
    settings,
    config
}) {

    if (!config?.features?.showFooter)
        return null;

    return (

        <footer className="document-footer">

            {config.features.showFooterText &&
                settings?.footerText && (

                    <div className="footer-message">

                        {settings.footerText}

                    </div>

                )}

            <div className="footer-divider"></div>

            <div className="footer-grid">

                <div className="footer-company">

                    <strong>

                        {settings?.companyName}

                    </strong>

                    {settings?.address && (

                        <div>

                            {settings.address}

                        </div>

                    )}

                </div>

                <div className="footer-contact">

                    {settings?.phone && (

                        <div>

                            📞 {settings.phone}

                        </div>

                    )}

                    {settings?.email && (

                        <div>

                            ✉ {settings.email}

                        </div>

                    )}

                    {settings?.website && (

                        <div>

                            🌐 {settings.website}

                        </div>

                    )}

                </div>

            </div>

            <div className="footer-bottom">

                {settings?.showPoweredBy && (

                    <div className="footer-bottom">

                        Powered by <strong>InvoiceFlow</strong>

                    </div>

                )}
                {/*{config.subscription.allowBrandRemoval*/}
                {/*    ? null*/}
                {/*    : (*/}

                {/*        <span>*/}

                {/*            Powered by <strong>InvoiceFlow</strong>*/}

                {/*        </span>*/}

                {/*    )}*/}

            </div>

        </footer>

    );

}