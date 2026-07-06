import "./Tab.css";

export default function FooterTab({ form, setForm }) {

    function update(field, value) {

        setForm({

            ...form,

            [field]: value

        });

    }

    return (

        <>

            <h4 className="tab-title">

                Footer

            </h4>

            <p className="tab-subtitle">

                Configure the footer displayed on all printed documents.

            </p>

            <div className="card">

                <div className="card-body">

                    <label>

                        Footer Text

                    </label>

                    <textarea

                        rows="6"

                        className="form-control"

                        value={form.footerText || ""}

                        onChange={(e) =>

                            update(

                                "footerText",

                                e.target.value

                            )

                        }

                    />

                    <div className="form-check mt-4">

                        <input

                            className="form-check-input"

                            type="checkbox"

                            checked={form.showPoweredBy || false}

                            onChange={(e) =>

                                update(

                                    "showPoweredBy",

                                    e.target.checked

                                )

                            }

                        />

                        <label className="form-check-label">

                            Show "Powered by InvoiceFlow"

                        </label>

                    </div>

                </div>

            </div>

            <div className="card border-warning mt-4">

                <div className="card-body">

                    <h6>

                        Premium Features

                    </h6>

                    <div className="premium-grid">

                        <div className="premium-item">
                            🔒 Custom Footer Layout
                        </div>

                        <div className="premium-item">
                            🔒 Social Media Icons
                        </div>

                        <div className="premium-item">
                            🔒 Website QR Code
                        </div>

                        <div className="premium-item">
                            🔒 Multiple Footers
                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}