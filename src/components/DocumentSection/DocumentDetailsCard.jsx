import { CURRENCIES, DOCUMENT_TYPES } from "../../utils/constants";

export default function DocumentDetailsCard({

    doc,

    setDoc,

    behavior,

    mode

}) {

    function update(field, value) {

        setDoc(prev => ({

            ...prev,

            [field]: value

        }));

    }

    return (

        <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

                <div className="mb-4">

                    <h5 className="fw-bold mb-1">

                        Document Details

                    </h5>

                    <small className="text-muted">

                        Basic information about this document

                    </small>

                </div>

                <div className="row g-3">

                    <div className="col-md-6">

                        <label className="form-label">

                            Document Type

                        </label>

                        <select

                            className="form-select"

                            value={doc.type}

                            disabled={mode === "edit"}

                            onChange={(e) =>

                                update("type", e.target.value)

                            }

                        >

                            {

                                DOCUMENT_TYPES.map(type => (

                                    <option

                                        key={type.value}

                                        value={type.value}

                                    >

                                        {type.label}

                                    </option>

                                ))

                            }

                        </select>

                        {mode === "edit" && (

                            <small className="text-muted">

                                Document type cannot be edited.

                            </small>

                        )}

                    </div>

                    <div className="col-md-6">

                        <label className="form-label">

                            Currency

                        </label>

                        <select

                            className="form-select"

                            value={doc.currency}

                            onChange={(e) =>

                                update("currency", e.target.value)

                            }

                        >

                            {

                                CURRENCIES.map(currency => (

                                    <option

                                        key={currency}

                                        value={currency}

                                    >

                                        {currency}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="col-md-6">

                        <label className="form-label">

                            Document Number

                        </label>

                        <input

                            className="form-control"

                            readOnly

                            disabled

                            value={

                                mode === "create"

                                    ? "Auto Generated"

                                    : doc.documentNumber

                            }

                        />

                    </div>

                    <div className="col-md-6">

                        <label className="form-label">

                            Issue Date

                        </label>

                        <input

                            type="date"

                            className="form-control"

                            value={doc.issueDate || ""}

                            onChange={(e) =>

                                update(

                                    "issueDate",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                    {

                        behavior.showDueDate && (

                            <div className="col-md-6">

                                <label className="form-label">

                                    Due Date

                                </label>

                                <input

                                    type="date"

                                    className="form-control"

                                    value={doc.dueDate || ""}

                                    onChange={(e) =>

                                        update(

                                            "dueDate",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                        )

                    }

                    {

                        behavior.showValidityDate && (

                            <div className="col-md-6">

                                <label className="form-label">

                                    Valid Until

                                </label>

                                <input

                                    type="date"

                                    className="form-control"

                                    value={doc.validityDate || ""}

                                    onChange={(e) =>

                                        update(

                                            "validityDate",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                        )

                    }

                    {

                        behavior.showDeliveryDate && (

                            <div className="col-md-6">

                                <label className="form-label">

                                    Delivery Date

                                </label>

                                <input

                                    type="date"

                                    className="form-control"

                                    value={doc.deliveryDate || ""}

                                    onChange={(e) =>

                                        update(

                                            "deliveryDate",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                        )

                    }

                    {
                        behavior.showPurchaseOrderNumber && (

                            <div className="col-md-6">

                                <label className="form-label">
                                    PO Number
                                </label>

                                <input
                                    className="form-control"
                                    value={
                                        doc.purchaseOrderNumber || ""
                                    }
                                    onChange={(e) =>
                                        update(
                                            "purchaseOrderNumber",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        )
                    }

                    <div className="col-md-6">

                        <label className="form-label">

                            Reference

                        </label>

                        <input

                            className="form-control"

                            value={doc.referenceNumber || ""}

                            onChange={(e) =>

                                update(

                                    "referenceNumber",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                    {

                        behavior.showOriginalInvoiceNumber && (

                            <div className="col-12">

                                <label className="form-label">

                                    Original Invoice Number

                                </label>

                                <input

                                    className="form-control"

                                    value={

                                        doc.originalDocumentNumber || ""

                                    }

                                    onChange={(e) =>

                                        update(

                                            "originalDocumentNumber",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}