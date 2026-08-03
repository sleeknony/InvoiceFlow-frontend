export default function AddressCard({

    doc,

    setDoc,

    behavior

}) {

    function update(field, value) {

        setDoc(prev => ({

            ...prev,

            [field]: value

        }));

    }

    function updateBilling(value) {

        setDoc(prev => ({

            ...prev,

            billingAddress: value,

            shippingAddress:

                prev.sameAsBilling

                    ? value

                    : prev.shippingAddress

        }));

    }

    function toggleSameAddress(checked) {

        setDoc(prev => ({

            ...prev,

            sameAsBilling: checked,

            shippingAddress:

                checked

                    ? prev.billingAddress

                    : prev.shippingAddress

        }));

    }

    return (

        <div className="card border-0 shadow-sm rounded-4 h-100">

            <div className="card-body p-4">

                <div className="mb-4">

                    <h5 className="fw-bold mb-1">

                        Addresses

                    </h5>

                    <small className="text-muted">

                        Billing and delivery information

                    </small>

                </div>

                <div className="row">

                    <div className="col-md-6 mb-4">

                        <label className="form-label fw-semibold">

                            Billing Address

                        </label>

                        <textarea

                            rows="7"

                            className="form-control"

                            value={doc.billingAddress || ""}

                            onChange={(e) =>

                                updateBilling(

                                    e.target.value

                                )

                            }

                        />

                    </div>

                    <div className="col-md-6 mb-4">

                        <label className="form-label fw-semibold">

                            Shipping Address

                        </label>

                        <textarea

                            rows="7"

                            className="form-control"

                            disabled={doc.sameAsBilling}

                            value={

                                doc.sameAsBilling

                                    ? doc.billingAddress

                                    : doc.shippingAddress || ""

                            }

                            onChange={(e) =>

                                update(

                                    "shippingAddress",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                </div>

                <div className="border rounded-4 p-3 bg-light mb-4">

                    <div className="form-check form-switch">

                        <input

                            className="form-check-input"

                            type="checkbox"

                            id="sameAddress"

                            checked={doc.sameAsBilling}

                            onChange={(e) =>

                                toggleSameAddress(

                                    e.target.checked

                                )

                            }

                        />

                        <label

                            htmlFor="sameAddress"

                            className="form-check-label ms-2"

                        >

                            Shipping address is the same as billing address

                        </label>

                    </div>

                </div>

                {

                    behavior.showShippingCost && (

                        <div className="row">

                            <div className="col-md-4">

                                <label className="form-label fw-semibold">

                                    Shipping Cost

                                </label>

                                <input

                                    type="number"

                                    min="0"

                                    className="form-control"

                                    value={doc.shippingCost || 0}

                                    onChange={(e) =>

                                        update(

                                            "shippingCost",

                                            Number(e.target.value)

                                        )

                                    }

                                />

                            </div>

                            <div className="col-md-8 d-flex align-items-end">

                                <div className="alert alert-info w-100 mb-0">

                                    Shipping cost will automatically be included in the document total.

                                </div>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}