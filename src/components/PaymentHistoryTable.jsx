export default function
    PaymentHistoryTable({
        payments,
        currency
    }) {
    if (!payments.length)
        return null;

    return (
        <div className="card mt-4">

            <div className="card-header">
                Payment History
            </div>

            <div className="card-body p-0">

                <table className="table mb-0">

                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Reference</th>
                            <th>Notes</th>
                            <th className="text-end">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>
                                    {
                                        new Date(
                                            p.paymentDate
                                        )
                                            .toLocaleDateString()
                                    }
                                </td>

                                <td>
                                    {
                                        p.paymentMethod
                                    }
                                </td>

                                <td>
                                    {
                                        p.referenceNumber
                                    }
                                </td>

                                <td>
                                    {
                                        p.notes
                                    }
                                </td>

                                <td className="text-end">
                                    {
                                        currency
                                    }
                                    {" "}
                                    {
                                        p.amount
                                            .toLocaleString()
                                    }
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}