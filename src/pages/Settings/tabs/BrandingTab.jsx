import "./Tab.css";

export default function BrandingTab({
    form,
    setForm,
    uploadLogo
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
                    Branding
                </h3>

                <p className="tab-subtitle">
                    Customize your company's visual identity.
                </p>

            </div>

            {/* ======================================
                COMPANY LOGO
            ====================================== */}

            <section className="settings-section">

                <div className="section-header">

                    <h5>Company Logo</h5>

                    <small>
                        Upload the logo that appears on your documents.
                    </small>

                </div>

                <div className="logo-upload">

                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={async (e) => {

                            const file =
                                e.target.files?.[0];

                            if (!file)
                                return;

                            try {

                                await uploadLogo(file);

                            }
                            catch (err) {

                                console.error(err);

                            }

                        }}
                    />

                    {(form.logoBase64 || form.logoUrl) && (

                        <div className="logo-preview">

                            <img
                                src={
                                    form.logoBase64 ??
                                    form.logoUrl
                                }
                                alt="Logo"
                            />

                        </div>

                    )}

                </div>

            </section>

            {/* ======================================
                TYPOGRAPHY
            ====================================== */}

            <section className="settings-section">

                <div className="section-header">

                    <h5>Typography</h5>

                    <small>
                        Select the default font used in documents.
                    </small>

                </div>

                <select
                    className="form-select"
                    value={form.fontFamily ?? "Inter"}
                    onChange={(e) =>
                        update(
                            "fontFamily",
                            e.target.value
                        )
                    }
                >
                    <option value="Inter">
                        Inter
                    </option>

                    <option value="Roboto">
                        Roboto
                    </option>

                    <option value="Poppins">
                        Poppins
                    </option>

                    <option value="Montserrat">
                        Montserrat
                    </option>

                    <option value="Open Sans">
                        Open Sans
                    </option>

                </select>

            </section>

        </>
    );
}