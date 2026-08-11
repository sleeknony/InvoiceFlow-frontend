import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const emptyAccount = {

    id: 0,

    bankName: "",

    accountName: "",

    accountNumber: "",

    currency: "NGN",

    sortCode: "",

    swiftCode: "",

    iban: "",

    isDefault: false

};

export default function BankAccountModal({

    show,

    onClose,

    onSave,

    account

}) {

    const [form, setForm] =
        useState(emptyAccount);

    useEffect(() => {

        if (account) {

            setForm(account);

        }

        else {

            setForm(emptyAccount);

        }

    }, [account, show]);

    function update(field, value) {

        setForm(prev => ({

            ...prev,

            [field]: value

        }));

    }

    function handleSubmit(e) {

        e.preventDefault();

        onSave(form);

    }

    return (

        <Modal
            show={show}
            onHide={onClose}
            centered
            size="lg"
        >

            <form onSubmit={handleSubmit}>

                <Modal.Header closeButton>

                    <Modal.Title>

                        {form.id > 0
                            ? "Edit Bank Account"
                            : "Add Bank Account"}

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label">

                                Bank Name

                            </label>

                            <input
                                className="form-control"
                                value={form.bankName}
                                onChange={(e) =>
                                    update(
                                        "bankName",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">

                                Currency

                            </label>

                            <select
                                className="form-select"
                                value={form.currency}
                                onChange={(e) =>
                                    update(
                                        "currency",
                                        e.target.value
                                    )
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

                        <div className="col-md-6">

                            <label className="form-label">

                                Account Name

                            </label>

                            <input
                                className="form-control"
                                value={form.accountName}
                                onChange={(e) =>
                                    update(
                                        "accountName",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label">

                                Account Number

                            </label>

                            <input
                                className="form-control"
                                value={form.accountNumber}
                                onChange={(e) =>
                                    update(
                                        "accountNumber",
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">

                                Sort Code

                            </label>

                            <input
                                className="form-control"
                                value={form.sortCode}
                                onChange={(e) =>
                                    update(
                                        "sortCode",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">

                                SWIFT Code

                            </label>

                            <input
                                className="form-control"
                                value={form.swiftCode}
                                onChange={(e) =>
                                    update(
                                        "swiftCode",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">

                                IBAN

                            </label>

                            <input
                                className="form-control"
                                value={form.iban}
                                onChange={(e) =>
                                    update(
                                        "iban",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-12">

                            <div className="form-check">

                                <input
                                    id="defaultAccount"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={form.isDefault}
                                    onChange={(e) =>
                                        update(
                                            "isDefault",
                                            e.target.checked
                                        )
                                    }
                                />

                                <label
                                    htmlFor="defaultAccount"
                                    className="form-check-label"
                                >

                                    Make this my default bank account

                                </label>

                            </div>

                        </div>

                    </div>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="light"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                    >
                        {form.id > 0
                            ? "Save Changes"
                            : "Add Account"}
                    </Button>

                </Modal.Footer>

            </form>

        </Modal>

    );

}