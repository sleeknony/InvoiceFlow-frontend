import "./Tab.css";

export default function CompanyTab({
    form,
    setForm
}) {

    function update(field, value) {
        setForm({
            ...form,
            [field]: value
        });
    }

    return (
        <>

            <div className="tab-header">

                <h3 className="tab-title">
                    Company Information
                </h3>

                <p className="tab-subtitle">
                    Configure the information that appears on your invoices and business documents.
                </p>

            </div>

            {/* ======================================
                BUSINESS DETAILS
            ======================================= */}

            <section className="settings-section">

                <div className="section-header">

                    <h5>Business Details</h5>

                    <small>
                        Basic information about your company.
                    </small>

                </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Company Name</label>

                        <input
                            className="form-control"
                            value={form.companyName || ""}
                            onChange={(e) =>
                                update("companyName", e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">

                        <label>Registration Number</label>

                        <input
                            className="form-control"
                            value={form.registrationNumber || ""}
                            onChange={(e) =>
                                update("registrationNumber", e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            className="form-control"
                            value={form.email || ""}
                            onChange={(e) =>
                                update("email", e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Tax Number</label>

                        <input
                            className="form-control"
                            value={form.taxNumber || ""}
                            onChange={(e) =>
                                update("taxNumber", e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Phone Number</label>

                        <input
                            className="form-control"
                            value={form.phone || ""}
                            onChange={(e) =>
                                update("phone", e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Website</label>

                        <input
                            className="form-control"
                            value={form.website || ""}
                            onChange={(e) =>
                                update("website", e.target.value)
                            }
                        />

                    </div>

                </div>

            </section>

            {/* ======================================
                ADDRESS
            ======================================= */}

            <section className="settings-section">

                <div className="section-header">

                    <h5>Business Address</h5>

                    <small>
                        Printed on invoices and quotations.
                    </small>

                </div>

                <textarea
                    rows="4"
                    className="form-control"
                    value={form.address || ""}
                    onChange={(e) =>
                        update("address", e.target.value)
                    }
                />

            </section>

            {/* ======================================
                REGIONAL
            ======================================= */}

            <section className="settings-section">

                <div className="section-header">

                    <h5>Regional Settings</h5>

                    <small>
                        Default currency and tax values.
                    </small>

                </div>

                <div className="form-grid">

                    <div className="form-group">

                        <label>Default Currency</label>

                        <select
                            className="form-select"
                            value={form.currency ?? "NGN"}
                            onChange={(e) =>
                                update("currency", e.target.value)
                            }
                        >
                            <option value="NGN">
                                Nigerian Naira (NGN)
                            </option>

                            <option value="USD">
                                US Dollar (USD)
                            </option>

                            <option value="GBP">
                                British Pound (GBP)
                            </option>

                            <option value="EUR">
                                Euro (EUR)
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Default VAT (%)</label>

                        <input
                            type="number"
                            className="form-control"
                            value={form.defaultVatRate || ""}
                            onChange={(e) =>
                                update(
                                    "defaultVatRate",
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>

                </div>

            </section>

        </>
    );
}