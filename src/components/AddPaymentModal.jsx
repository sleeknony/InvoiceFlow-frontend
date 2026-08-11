import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function AddPaymentModal({
    show,
    onClose,
    onSave,
    balanceDue
}) {

    // =====================================================
    // INITIAL FORM
    // =====================================================

    const createPaymentForm = () => ({
        amount:
            Number(balanceDue) > 0
                ? String(balanceDue)
                : "",

        paymentDate:
            new Date()
                .toISOString()
                .split("T")[0],

        paymentMethod: "",
        reference: "",
        notes: ""
    });


    // =====================================================
    // STATE
    // =====================================================

    const [payment, setPayment] =
        useState(createPaymentForm);

    const [errors, setErrors] = useState({});

    // =====================================================
    // RESET FORM WHEN MODAL OPENS
    //
    // This ensures:
    // - Amount = current outstanding balance
    // - Payment method is cleared
    // - Reference is cleared
    // - Notes are cleared
    // - Date resets to today
    // =====================================================

    useEffect(() => {

        if (!show) {
            return;
        }

        setPayment({
            amount:
                Number(balanceDue) > 0
                    ? String(balanceDue)
                    : "",

            paymentDate:
                new Date()
                    .toISOString()
                    .split("T")[0],

            paymentMethod: "",
            reference: "",
            notes: ""
        });

        setErrors({});
    }, [show, balanceDue]);


    // =====================================================
    // UPDATE FIELD
    // =====================================================

    const updateField = (field, value) => {

        setPayment(current => ({
            ...current,
            [field]: value
        }));

        setErrors(current => ({
            ...current,
            [field]: ""
        }));

    };

    // =====================================================
    // VALIDATION
    // =====================================================

    function validate() {

        const validation = {};

        const amount =
            Number(payment.amount);

        if (!payment.amount) {

            validation.amount =
                "Amount is required.";

        }
        else if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            validation.amount =
                "Amount must be greater than zero.";

        }
        else if (
            amount >
            Number(balanceDue)
        ) {

            validation.amount =
                "Amount cannot exceed the outstanding balance.";

        }

        if (!payment.paymentDate) {

            validation.paymentDate =
                "Payment date is required.";

        }
        else {

            const selected =
                new Date(payment.paymentDate);

            const today =
                new Date();

            today.setHours(0, 0, 0, 0);

            selected.setHours(0, 0, 0, 0);

            if (selected > today) {

                validation.paymentDate =
                    "Payment date cannot be in the future.";

            }

        }

        if (!payment.paymentMethod) {

            validation.paymentMethod =
                "Please select a payment method.";

        }

        if (!payment.reference.trim()) {

            validation.reference =
                "Reference number is required.";

        }

        return validation;

    }
    // =====================================================
    // SAVE
    // =====================================================

    const save = () => {

        const validation =
            validate();

        if (
            Object.keys(validation).length > 0
        ) {

            setErrors(validation);

            return;

        }

        onSave({

            ...payment,

            amount:
                Number(payment.amount)

        });

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Payment
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {/* ==========================================
                    AMOUNT
                ========================================== */}

                <div className="mb-3">
                    <label className="form-label">
                        Amount
                    </label>

                    <input
                        type="number"
                        className="form-control"
                        min="0.01"
                        step="0.01"
                        max={balanceDue}
                        value={payment.amount}
                        onChange={(e) =>
                            updateField(
                                "amount",
                                e.target.value
                            )
                        }
                    />
                    {errors.amount && (

                        <div className="text-danger small mt-1">

                            {errors.amount}

                        </div>

                    )}

                    <div className="form-text">
                        Balance due:{" "}
                        {Number(
                            balanceDue ?? 0
                        ).toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </div>
                </div>


                {/* ==========================================
                    PAYMENT DATE
                ========================================== */}

                <div className="mb-3">
                    <label className="form-label">
                        Date
                    </label>

                    <input
                        type="date"
                        className="form-control"
                        value={
                            payment.paymentDate
                        }
                        onChange={(e) =>
                            updateField(
                                "paymentDate",
                                e.target.value
                            )
                        }
                    />

                    {errors.paymentDate && (

                        <div className="text-danger small mt-1">

                            {errors.paymentDate}

                        </div>

                    )}
                </div>


                {/* ==========================================
                    PAYMENT METHOD
                ========================================== */}

                <div className="mb-3">
                    <label className="form-label">
                        Payment Method
                    </label>

                    <select
                        className="form-select"
                        value={
                            payment.paymentMethod
                        }
                        onChange={(e) =>
                            updateField(
                                "paymentMethod",
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Select
                        </option>

                        <option value="Cash">
                            Cash
                        </option>

                        <option value="Bank Transfer">
                            Bank Transfer
                        </option>

                        <option value="Cheque">
                            Cheque
                        </option>

                        <option value="POS">
                            POS
                        </option>

                        <option value="Card">
                            Card
                        </option>
                    </select>

                    {errors.paymentMethod && (

                        <div className="text-danger small mt-1">

                            {errors.paymentMethod}

                        </div>

                    )}
                </div>


                {/* ==========================================
                    REFERENCE
                ========================================== */}

                <div className="mb-3">
                    <label className="form-label">
                        Reference Number
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={
                            payment.reference
                        }
                        onChange={(e) =>
                            updateField(
                                "reference",
                                e.target.value
                            )
                        }
                    />

                    {errors.reference && (

                        <div className="text-danger small mt-1">

                            {errors.reference}

                        </div>

                    )}
                </div>


                {/* ==========================================
                    NOTES
                ========================================== */}

                <div className="mb-3">
                    <label className="form-label">
                        Notes
                    </label>

                    <textarea
                        rows={3}
                        className="form-control"
                        value={payment.notes}
                        onChange={(e) =>
                            updateField(
                                "notes",
                                e.target.value
                            )
                        }
                    />
                </div>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={save}
                    disabled={false}
                >
                    Save Payment
                </Button>

            </Modal.Footer>
        </Modal>
    );
}