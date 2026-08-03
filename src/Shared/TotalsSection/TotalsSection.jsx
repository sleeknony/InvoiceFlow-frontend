
import "./TotalsSection.css";
import PrintableSection from "../../renderer/PrintableSection";
import { useRenderDocument} from "../../renderer/RenderContext";
import formatMoney  from "../../utils/formatMoney";
import formatCurrency from "../../utils/currency";
import { useDocument } from "../../renderer/RenderContext";


export default function TotalsSection() {

    const {

        totals,

        features

    } = useDocument();

    return (

        <PrintableSection type="totals">

            <div className="totals-container">

                <table className="totals-table">

                    <tbody>

                        {features.showSubTotal && (

                            <tr>

                                <td>Subtotal</td>

                                <td>

                                    {formatCurrency(
                                        totals.subtotal
                                    )}

                                </td>

                            </tr>

                        )}

                        {features.showDiscountTotal &&
                            totals.discount > 0 && (

                                <tr>

                                    <td>Discount</td>

                                    <td>

                                    -{formatCurrency(
                                            totals.discount
                                        )}

                                    </td>

                                </tr>

                            )}

                        {features.showTaxTotal &&
                            totals.tax > 0 && (

                                <tr>

                                    <td>VAT</td>

                                    <td>

                                    {formatCurrency(
                                            totals.tax
                                        )}

                                    </td>

                                </tr>

                            )}

                        {features.showShippingCost &&
                            totals.shipping > 0 && (

                                <tr>

                                    <td>Shipping</td>

                                    <td>

                                    {formatCurrency(
                                            totals.shipping
                                        )}

                                    </td>

                                </tr>

                            )}

                        <tr className="grand-total">

                            <td>Total</td>

                            <td>

                                {formatCurrency(
                                    totals.total
                                )}

                            </td>

                        </tr>

                        {totals.amountPaid > 0 && (

                            <tr>

                                <td>Amount Paid</td>

                                <td>

                                    {formatCurrency(
                                        totals.amountPaid
                                    )}

                                </td>

                            </tr>

                        )}

                        {totals.balanceStatus === "Outstanding" && (

                            <tr className="balance-due">

                                <td>Balance Due</td>

                                <td>

                                    {formatCurrency(
                                        totals.balanceDue
                                    )}

                                </td>

                            </tr>

                        )}

                        {totals.balanceStatus === "Overdue" && (

                            <tr className="balance-overdue">

                                <td>Overdue</td>

                                <td>

                                    {formatCurrency(
                                        totals.balanceDue
                                    )}

                                </td>

                            </tr>

                        )}

                        {totals.balanceStatus === "Paid" && (

                            <tr className="balance-paid">

                                <td>Status</td>

                                <td>

                                    PAID IN FULL ✓

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </PrintableSection>

    );

}




//import "./TotalsSection.css";

//import PrintableSection
//    from "../../renderer/PrintableSection";

//import {

//    useRenderDocument

//}
//    from "../../renderer/RenderContext";

//import currencySymbol
//    from "../../utils/currency";

//export default function TotalsSection() {

//    const {

//        totals,

//        features

//    }
//        =
//        useRenderDocument();

//    const {

//        currency

//    }
//        =
//        totals;

//    return (

//        <PrintableSection type="totals">

//            <table className="totals-table">

//                <tbody>

//                    {features.showSubTotal && (

//                        <tr>

//                            <td>Subtotal</td>

//                            <td>

//                                {currencySymbol(
//                                    totals.subtotal,
//                                    currency
//                                )}

//                            </td>

//                        </tr>

//                    )}

//                    {features.showDiscountTotal && (

//                        <tr>

//                            <td>Discount</td>

//                            <td>

//                                -{currencySymbol(
//                                    totals.discount,
//                                    currency
//                                )}

//                            </td>

//                        </tr>

//                    )}

//                    {features.showTaxTotal && (

//                        <tr>

//                            <td>Tax</td>

//                            <td>

//                                {currencySymbol(
//                                    totals.tax,
//                                    currency
//                                )}

//                            </td>

//                        </tr>

//                    )}

//                    {features.showShippingCost &&
//                        totals.shipping > 0 && (

//                            <tr>

//                                <td>Shipping</td>

//                                <td>

//                                    {currencySymbol(
//                                        totals.shipping,
//                                        currency
//                                    )}

//                                </td>

//                            </tr>

//                        )}

//                    {features.showTotals && (

//                        <tr className="grand-total">

//                            <td>Total</td>

//                            <td>

//                                {currencySymbol(
//                                    totals.total,
//                                    currency
//                                )}

//                            </td>

//                        </tr>

//                    )}

//                </tbody>

//            </table>

//        </PrintableSection>

//    );

//}