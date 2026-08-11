import { useRef } from "react";
import "./Tab.css";

export default function AdvancedTab({
    form,
    setForm,
    onSignatureUpload,
    onSignatureToggle
}) {

    const signatureInputRef = useRef(null);

    function update(field, value) {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleFileChange(e) {

        const file = e.target.files?.[0];

        if (!file) return;

        onSignatureUpload(file);
    }

    return (
        <>
            <h4 className="tab-title">
                Workspace Preferences
            </h4>

            <p className="tab-subtitle">
                Configure how InvoiceFlow behaves while you work.
            </p>

            <div className="settings-section mt-4">

                <div className="section-header">
                    <h5>Document Signature</h5>

                    <small>
                        Upload an authorized signature and choose whether it appears on generated documents.
                    </small>
                </div>

                <input
                    ref={signatureInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                <div
                    className="border rounded bg-light d-flex align-items-center justify-content-center mb-3"
                    style={{
                        height: 140,
                        maxWidth: 400
                    }}
                >
                    {form.signatureBase64 ? (
                        <img
                            src={form.signatureBase64}
                            alt="Signature"
                            style={{
                                maxHeight: 110,
                                maxWidth: "95%"
                            }}
                        />
                    ) : (
                        <span className="text-muted">
                            No signature uploaded
                        </span>
                    )}
                </div>

                <div className="d-flex gap-2 mb-3">

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() =>
                            signatureInputRef.current?.click()
                        }
                    >
                        {form.signatureBase64
                            ? "Replace Signature"
                            : "Upload Signature"}
                    </button>

                </div>

                <div className="form-check form-switch">

                    <input
                        id="showSignature"
                        className="form-check-input"
                        type="checkbox"
                        checked={
                            form.showSignatureOnDocuments ?? false
                        }
                        onChange={(e) => {

                            update(
                                "showSignatureOnDocuments",
                                e.target.checked
                            );

                            onSignatureToggle(
                                e.target.checked
                            );
                        }}
                    />

                    <label
                        htmlFor="showSignature"
                        className="form-check-label"
                    >
                        Show signature on generated documents
                    </label>

                </div>

            </div>

            <div className="settings-section mt-4">

                <div className="section-header">
                    <h5>Approval Workflow</h5>

                    <small>
                        Configure document approvals.
                    </small>
                </div>

                <div className="form-check form-switch">

                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                            form.enableApprovalWorkflow ?? false
                        }
                        onChange={(e) => {

                            const enabled = e.target.checked;

                            setForm({
                                ...form,
                                enableApprovalWorkflow: enabled,
                                approvalLevelsRequired: enabled ? 1 : 0,
                                requireApprovalForInvoices: enabled && form.requireApprovalForInvoices,
                                requireApprovalForQuotes: enabled && form.requireApprovalForQuotes,
                                requireApprovalForPurchaseOrders: enabled && form.requireApprovalForPurchaseOrders,
                                requireApprovalForProformaInvoices: enabled && form.requireApprovalForProformaInvoices
                            });
                        }}
                    />

                    <label className="form-check-label">
                        Enable Approval Workflow
                    </label>

                </div>

                {form.enableApprovalWorkflow && (
                    <>
                        <div className="mb-3">

                            <label className="form-label">
                                Approval Levels
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                min={1}
                                max={1}
                                value={form.approvalLevelsRequired || 1}
                                onChange={(e) => {

                                    const value =
                                        Math.max(
                                            1,
                                            Math.min(
                                                1,
                                                Number(e.target.value) || 1
                                            )
                                        );

                                    update(
                                        "approvalLevelsRequired",
                                        value
                                    );
                                }}
                            />

                            <small className="text-muted">
                                Supported range: 1 approval levels.
                            </small>

                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                    form.requireApprovalForInvoices ?? false
                                }
                                onChange={(e) =>
                                    update(
                                        "requireApprovalForInvoices",
                                        e.target.checked
                                    )
                                }
                            />
                            <label className="form-check-label">
                              Approve Invoices
                            </label>
                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                    form.requireApprovalForQuotes ?? false
                                }
                                onChange={(e) =>
                                    update(
                                        "requireApprovalForQuotes",
                                        e.target.checked
                                    )
                                }
                            />
                            <label className="form-check-label">
                               Approve Quotes
                            </label>
                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                    form.requireApprovalForPurchaseOrders ?? false
                                }
                                onChange={(e) =>
                                    update(
                                        "requireApprovalForPurchaseOrders",
                                        e.target.checked
                                    )
                                }
                            />
                            <label className="form-check-label">
                              Approve Purchase Orders
                            </label>
                        </div>

                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                    form.requireApprovalForProformaInvoices ?? false
                                }
                                onChange={(e) =>
                                    update(
                                        "requireApprovalForProformaInvoices",
                                        e.target.checked
                                    )
                                }
                            />
                            <label className="form-check-label">
                               Approve Proforma Invoices
                            </label>
                        </div>
                    </>
                )}

            </div>


            <div className="alert alert-info mt-4">

                <strong>Coming Soon</strong>

                <div className="mt-2">

                    Future workspace preferences will include:

                    <ul className="mt-2 mb-0">
                        <li>Theme (Light/Dark)</li>
                        <li>Language</li>
                        <li>Timezone</li>
                        <li>Email Notifications</li>
                        <li>Desktop Notifications</li>
                    </ul>

                </div>

            </div>
        </>
    );
}