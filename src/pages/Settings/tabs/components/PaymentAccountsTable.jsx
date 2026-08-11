import EmptyPaymentAccounts from "./EmptyPaymentAccounts";
import {
    FaEdit,
    FaArchive
} from "react-icons/fa";
export default function PaymentAccountsTable({

    accounts = [],

    onAdd,

    onEdit,

    onArchive,

    onSetDefault

}) {

    return (

        <div className="card shadow-sm border-0 mb-4">

            <div className="card-header bg-white">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h5 className="mb-1">
                            Bank Accounts
                        </h5>

                        <small className="text-muted">
                            Choose which bank accounts are available on your invoices.
                        </small>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={onAdd}
                        disabled={accounts.length >= 3}
                    >
                        <i className="bi bi-plus-lg me-2"></i>

                        Add Bank Account
                    </button>

                </div>

                {
                    accounts.length >= 3 && (

                        <div className="alert alert-warning rounded-0 border-0 mt-3 mb-0">

                            <i className="bi bi-exclamation-triangle me-2"></i>

                            Maximum of <strong>3 bank accounts</strong> allowed.

                        </div>

                    )
                }

            </div>

            <div className="card-body p-0">

                {accounts.length === 0 ? (

                    <EmptyPaymentAccounts
                        onAdd={onAdd}
                    />

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead>

                                <tr>

                                    <th>Bank</th>

                                    <th>Account Name</th>

                                    <th>Account Number</th>

                                    <th>Currency</th>

                                    <th>Default</th>

                                    <th width="140">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {accounts.map(account => (

                                    <tr key={account.id}>

                                        <td>

                                            <div>

                                                <strong>

                                                    {account.displayName}

                                                </strong>

                                                <div className="text-muted small">

                                                    {account.bankName}

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            {account.accountName}

                                        </td>

                                        <td>

                                            {account.accountNumber}

                                        </td>

                                        <td>

                                            {account.currency}

                                        </td>

                                        <td>

                                            {account.isDefault ? (
                                                <span className="badge bg-success-subtle text-success border">

                                                    <i className="bi bi-star-fill me-1"></i>

                                                    Default

                                                </span>

                                            ) : (

                                                <span className="text-muted">

                                                    —

                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Edit"
                                                    onClick={() => onEdit(account)}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Archive"
                                                    onClick={() => onDelete(account)}
                                                >
                                                    <FaArchive />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}