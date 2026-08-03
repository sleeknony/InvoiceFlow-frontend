import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function CustomerModal({

    show,

    editing,

    form,

    setForm,

    saving,

    onSave,

    onClose

}) {

    function update(field, value) {

        setForm({

            ...form,

            [field]: value

        });

    }

    return (

        <Modal

            show={show}

            onHide={onClose}

            centered

            size="lg"

        >

            <Modal.Header
                closeButton
                className="border-0 pb-0 pt-4 px-4"
            >

                <div>

                    <h3 className="fw-bold mb-1">

                        {editing ? "Edit Customer" : "New Customer"}

                    </h3>

                    <p className="text-muted mb-0">

                        Store customer information for invoices, quotations and receipts.

                    </p>

                </div>

            </Modal.Header>

            <Modal.Body className="px-4 pb-4">

                {/* BASIC INFORMATION */}

                <div className="mb-5">

                    <h6 className="fw-bold text-uppercase text-primary mb-3">

                        Basic Information

                    </h6>

                    <div className="row g-3">

                        <div className="col-12">

                            <label className="form-label">

                                Company Name *

                            </label>

                            <input
                                className="form-control form-control-lg rounded-3"
                                value={form.companyName}
                                onChange={(e) =>
                                    update("companyName", e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">

                                Contact Person

                            </label>

                            <input
                                className="form-control rounded-3"
                                value={form.contactPerson}
                                onChange={(e) =>
                                    update("contactPerson", e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* CONTACT */}

                <div className="mb-5">

                    <h6 className="fw-bold text-uppercase text-primary mb-3">

                        Contact Information

                    </h6>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label">

                                Email

                            </label>

                            <input
                                type="email"
                                className="form-control rounded-3"
                                value={form.email}
                                onChange={(e) =>
                                    update("email", e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">

                                Phone

                            </label>

                            <input
                                className="form-control rounded-3"
                                value={form.phone}
                                onChange={(e) =>
                                    update("phone", e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* ADDRESS */}

                <div className="mb-5">

                    <h6 className="fw-bold text-uppercase text-primary mb-3">

                        Address

                    </h6>

                    <div className="row g-3">

                        <div className="col-12">

                            <textarea
                                rows="2"
                                className="form-control rounded-3"
                                placeholder="Street Address"
                                value={form.address}
                                onChange={(e) =>
                                    update("address", e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <input
                                className="form-control rounded-3"
                                placeholder="City"
                                value={form.city}
                                onChange={(e) =>
                                    update("city", e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <input
                                className="form-control rounded-3"
                                placeholder="State"
                                value={form.state}
                                onChange={(e) =>
                                    update("state", e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <input
                                className="form-control rounded-3"
                                placeholder="Country"
                                value={form.country}
                                onChange={(e) =>
                                    update("country", e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

                {/* TAX */}

                <div className="mb-5">

                    <h6 className="fw-bold text-uppercase text-primary mb-3">

                        Tax Information

                    </h6>

                    <input
                        className="form-control rounded-3"
                        placeholder="Tax Number"
                        value={form.taxNumber}
                        onChange={(e) =>
                            update("taxNumber", e.target.value)
                        }
                    />

                </div>

                {/* NOTES */}

                <div>

                    <h6 className="fw-bold text-uppercase text-primary mb-3">

                        Notes

                    </h6>

                    <textarea
                        rows="4"
                        className="form-control rounded-3"
                        placeholder="Additional notes..."
                        value={form.notes}
                        onChange={(e) =>
                            update("notes", e.target.value)
                        }
                    />

                </div>

            </Modal.Body>

            <Modal.Footer className="border-0 px-4 pb-4">

                <button
                    className="btn btn-light rounded-pill px-4"
                    onClick={onClose}
                >

                    Cancel

                </button>

                <button
                    className="btn btn-primary rounded-pill px-5"
                    disabled={saving}
                    onClick={onSave}
                >

                    {editing ? "Update Customer" : "Save Customer"}

                </button>

            </Modal.Footer>

        </Modal>

    );

}