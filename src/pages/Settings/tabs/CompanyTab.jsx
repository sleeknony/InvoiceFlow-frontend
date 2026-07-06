import "./Tab.css";

export default function CompanyTab({ form, setForm }) {

    function update(field, value) {
        setForm({
            ...form,
            [field]: value
        });
    }

    return (

        <>

            <h4 className="tab-title">
                Company Information
            </h4>

            <p className="tab-subtitle">
                These details appear on all your documents.
            </p>

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

                    <label>Email</label>

                    <input
                        className="form-control"
                        value={form.email || ""}
                        onChange={(e) =>
                            update("email", e.target.value)
                        }
                    />

                </div>

                <div className="form-group">

                    <label>Phone</label>

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

                    <label>Currency</label>

                    <select
                        className="form-select"
                        value={form.currency ?? "NGN"}
                        onChange={(e) =>
                            update("currency", e.target.value)
                        }
                    >
                        <option value="NGN">Nigerian Naira (NGN)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="EUR">Euro (EUR)</option>
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

                <div className="form-group full-width">

                    <label>Business Address</label>

                    <textarea
                        rows="3"
                        className="form-control"
                        value={form.address || ""}
                        onChange={(e) =>
                            update("address", e.target.value)
                        }
                    />

                </div>

            </div>

        </>

    );

}