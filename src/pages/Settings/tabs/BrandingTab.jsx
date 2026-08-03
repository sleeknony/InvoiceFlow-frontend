import TemplateSelector from "../../../components/TemplateSelector";
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

            <h4 className="tab-title">

                Branding

            </h4>

            <p className="tab-subtitle">

                Customize how your invoices and documents look.

            </p>

            {/* Logo */}

            <div className="card mb-4">

                <div className="card-body">

                    <h6 className="mb-3">

                        Company Logo

                    </h6>

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

                        <div className="text-center mt-4">

                            <img

                                src={form.logoBase64 ?? form.logoUrl}

                                alt="Logo"

                                style={{

                                    maxHeight: 80,

                                    objectFit: "contain"

                                }}

                            />

                        </div>

                    )}

                </div>

            </div>

            {/* Brand Colours */}

            <div className="card mb-4">

                <div className="card-body">

                    <h6 className="mb-4">

                        Brand Colours

                    </h6>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>

                                Primary Colour

                            </label>

                            <input

                                type="color"

                                className="form-control form-control-color"

                                value={form.primaryColor}

                                onChange={(e) =>

                                    update(

                                        "primaryColor",

                                        e.target.value

                                    )

                                }

                            />

                        </div>

                        <div className="form-group">

                            <label>

                                Secondary Colour

                            </label>

                            <input

                                type="color"

                                className="form-control form-control-color"

                                value={form.secondaryColor}

                                onChange={(e) =>

                                    update(

                                        "secondaryColor",

                                        e.target.value

                                    )

                                }

                            />

                        </div>

                        <div className="form-group">

                            <label>

                                Accent Colour

                            </label>

                            <input

                                type="color"

                                className="form-control form-control-color"

                                value={form.accentColor}

                                onChange={(e) =>

                                    update(

                                        "accentColor",

                                        e.target.value

                                    )

                                }

                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* Typography */}

            <div className="card mb-4">

                <div className="card-body">

                    <h6 className="mb-3">

                        Typography

                    </h6>

                    <label>

                        Font Family

                    </label>

                    <select
                        className="form-select"
                        value={form.fontFamily ?? "Inter"}
                        onChange={(e) =>
                            update("fontFamily", e.target.value)
                        }
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Open Sans">Open Sans</option>
                    </select>
                </div>

            </div>

            {/* Template */}

            <div className="card mb-4">

                <div className="card-body">

                    <h6 className="mb-3">

                        Default Template

                    </h6>

                    <TemplateSelector

                        value={form.documentTemplate}

                        onChange={(value) =>

                            update(

                                "documentTemplate",

                                value

                            )

                        }

                    />

                </div>

            </div>

            {/* Premium */}

            <div className="card border-warning">

                <div className="card-body">

                    <h6>

                        Premium Features

                    </h6>

                    <div className="premium-grid">

                        <div className="premium-item">

                            🔒 Background Image

                        </div>

                        <div className="premium-item">

                            🔒 Company Watermark

                        </div>

                        <div className="premium-item">

                            🔒 Company Seal

                        </div>

                        <div className="premium-item">

                            🔒 Signature Upload

                        </div>

                        <div className="premium-item">

                            🔒 Premium Fonts

                        </div>

                        <div className="premium-item">

                            🔒 Brand Removal

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}