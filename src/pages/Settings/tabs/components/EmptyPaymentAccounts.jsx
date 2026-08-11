export default function EmptyPaymentAccounts({

    onAdd

}) {

    return (

        <div className="payment-empty">

            <div className="payment-empty-icon">

                <i className="bi bi-bank"></i>

            </div>

            <h5 className="mt-3">

                No bank accounts yet

            </h5>

            <p className="text-muted mb-4">

                Add your first bank account so customers know
                where to send payments.

            </p>

            <button
                className="btn btn-primary"
                onClick={onAdd}
            >

                <i className="bi bi-plus-lg me-2"></i>

                Add Bank Account

            </button>

        </div>

    );

}