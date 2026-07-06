import "./TotalsSection.css";
import currencySymbol from "../../utils/currency";

export default function TotalsSection({
    document,
    settings,
    config
}) {
    const currency =
        document.currency ||
        settings?.currency ||
        "NGN";

    return (
        <div className="totals-section">
            <table className="totals-table">
                <tbody>

                    {config.features.showSubTotal && (
                        <tr>
                            <td>Subtotal</td>
                            <td>
                                {currencySymbol(
                                    document.subTotal,
                                    currency
                                )}
                            </td>
                        </tr>
                    )}

                    {config.features.showDiscountTotal && (
                        <tr>
                            <td>Discount</td>
                            <td>
                                -
                                {currencySymbol(
                                    document.discountAmount,
                                    currency
                                )}
                            </td>
                        </tr>
                    )}

                    {config.features.showTaxTotal && (
                        <tr>
                            <td>Tax</td>
                            <td>
                                {currencySymbol(
                                    document.taxAmount,
                                    currency
                                )}
                            </td>
                        </tr>
                    )}

                    {config.features.showShippingCost &&
                        document.shippingCost > 0 && (
                            <tr>
                                <td>Shipping</td>
                                <td>
                                    {currencySymbol(
                                        document.shippingCost,
                                        currency
                                    )}
                                </td>
                            </tr>
                        )}

                    {config.features.showTotals && (
                        <tr className="grand-total">
                            <td>Total</td>
                            <td>
                                {currencySymbol(
                                    document.total,
                                    currency
                                )}
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    );
}