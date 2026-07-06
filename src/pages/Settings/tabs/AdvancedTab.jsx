import "./Tab.css";

export default function AdvancedTab({

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

            <h4 className="tab-title">

                Advanced Settings

            </h4>

            <p className="tab-subtitle">

                Configure application-wide document behaviour.

            </p>

            <div className="card mb-4">

                <div className="card-body">

                    <div className="form-check mb-3">

                        <input

                            className="form-check-input"

                            type="checkbox"

                            checked={form.autoSaveDrafts || false}

                            onChange={(e) =>

                                update(

                                    "autoSaveDrafts",

                                    e.target.checked

                                )

                            }

                        />

                        <label className="form-check-label">

                            Automatically save drafts

                        </label>

                    </div>

                    <div className="form-check mb-3">

                        <input

                            className="form-check-input"

                            type="checkbox"

                            checked={form.autoGenerateNumbers || true}

                            onChange={(e) =>

                                update(

                                    "autoGenerateNumbers",

                                    e.target.checked

                                )

                            }

                        />

                        <label className="form-check-label">

                            Automatically generate document numbers

                        </label>

                    </div>

                    <div className="form-check mb-3">

                        <input

                            className="form-check-input"

                            type="checkbox"

                            checked={form.confirmDelete || true}

                            onChange={(e) =>

                                update(

                                    "confirmDelete",

                                    e.target.checked

                                )

                            }

                        />

                        <label className="form-check-label">

                            Confirm before deleting documents

                        </label>

                    </div>

                </div>

            </div>

            <div className="card border-warning">

                <div className="card-body">

                    <h6>

                        Premium Features

                    </h6>

                    <div className="premium-grid">

                        <div className="premium-item">
                            🔒 Audit Logs
                        </div>

                        <div className="premium-item">
                            🔒 Digital Signatures
                        </div>

                        <div className="premium-item">
                            🔒 Approval Workflow
                        </div>

                        <div className="premium-item">
                            🔒 Multiple Users
                        </div>

                        <div className="premium-item">
                            🔒 API Access
                        </div>

                        <div className="premium-item">
                            🔒 Custom CSS
                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}