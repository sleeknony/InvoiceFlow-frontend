import "./ItemsTable.css";
import currencySymbol from "../../utils/currency";
import { DOCUMENT_CONFIG }
    from "../../templates/config/documentConfig";

export default function ItemsTable({
    document,settings
}) {

    const config = DOCUMENT_CONFIG[document.type];
    const items = document?.items || [];
    const currency =
        document?.currency ||
        settings?.currency ||
        "NGN";

    return (

        <div className="document-items">

            <table className="invoice-table">

                <thead>

                    <tr>

                        {config.columns.includes("description") &&
                            <th>Description</th>}

                        {config.columns.includes("quantity") &&
                            <th>Qty</th>}

                        {config.columns.includes("unitPrice") &&
                            <th>Unit Price</th>}

                        {config.columns.includes("discount") &&
                            <th>Discount</th>}

                        {config.columns.includes("tax") &&
                            <th>VAT</th>}

                        {config.columns.includes("total") &&
                            <th className="text-end">Amount</th>}

                    </tr>

                </thead>

                <tbody>

                    {items.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-items"
                            >

                                No items available.

                            </td>

                        </tr>

                    ) : (

                        items.map((item) => (

                            <tr key={item.id}>

                                {config.columns.includes("description") && (
                                    <td>{item.description}</td>
                                )}

                                {config.columns.includes("quantity") && (
                                    <td>{item.quantity}</td>
                                )}

                               
                                {config.columns.includes("unitPrice") && (
                                    <td>
                                     
                                        {currencySymbol(
                                            item.unitPrice,
                                            currency
                                        )}
                                    </td>
                                )}

                                {config.columns.includes("discount") && (
                                    <td>{item.discountPercent}%</td>
                                )}

                                {config.columns.includes("tax") && (
                                    <td>{item.taxRatePercent}%</td>
                                )}

                                {config.columns.includes("total") && (
                                    <td className="text-end fw-bold">
                                        {currencySymbol(
                                            item.lineTotal,
                                            currency
                                        )}
                                    </td>
                                )}

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}