
import {
    FiCreditCard,
    FiHash,
    FiHome
} from "react-icons/fi";

export default function PaymentSidebar({
    bankAccounts,
    selectedBankAccountId,
    onBankAccountChange
}) {
    const account =
        bankAccounts?.find(
            x => String(x.id) === String(selectedBankAccountId)
        ) ||
        bankAccounts?.find(x => x.isDefault) ||
        bankAccounts?.[0];

    if (!account) {
        return null;
    }

    return (
        <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                    Payment Information
                </h5>

                {bankAccounts?.length > 1 && (
                    <div className="mb-4">
                        <label className="form-label small text-muted">
                            Select Bank Account
                        </label>

                        <select
                            className="form-select"
                            value={account.id}
                            onChange={(e) =>
                                onBankAccountChange?.(
                                    Number(e.target.value)
                                )
                            }
                        >
                            {bankAccounts.map(x => (
                                <option
                                    key={x.id}
                                    value={x.id}
                                >
                                    {x.displayName || x.bankName}
                                    {x.isDefault ? " (Default)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <div className="text-muted small">
                        <FiHome className="me-2" />
                        Bank
                    </div>

                    <div className="fw-semibold">
                        {account.bankName || "-"}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-muted small">
                        Account Name
                    </div>

                    <div className="fw-semibold">
                        {account.accountName || "-"}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-muted small">
                        <FiHash className="me-2" />
                        Account Number
                    </div>

                    <div className="fw-semibold">
                        {account.accountNumber || "-"}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-muted small">
                        Currency
                    </div>

                    <div className="fw-semibold">
                        {account.currency || "-"}
                    </div>
                </div>

                {account.paymentInstructions && (
                    <div className="alert alert-light border rounded-4 mb-0">
                        <div className="fw-semibold mb-2">
                            <FiCreditCard className="me-2" />
                            Payment Instructions
                        </div>

                        <small>
                            {account.paymentInstructions}
                        </small>
                    </div>
                )}

            </div>
        </div>
    );
}
