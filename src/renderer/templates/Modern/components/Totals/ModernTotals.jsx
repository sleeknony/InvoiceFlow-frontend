import "./ModernTotals.css";

import { useDocument } from "../../../../RenderContext";

import formatCurrency from "../../../../../utils/currency";

export default function ModernTotals() {

    const {

        totals,
        meta

    } = useDocument();

    const currency =
        totals.currency || "NGN";

    return (

        <section className="modern-totals">

            {/*<div className="modern-totals-left">*/}

            {/*    <h4>*/}

            {/*        Notes*/}

            {/*    </h4>*/}

            {/*    <p>*/}

            {/*        {*/}

            {/*            meta.notes ||*/}

            {/*            "Thank you for your business."*/}

            {/*        }*/}

            {/*    </p>*/}

            {/*    {*/}

            {/*        meta.terms && (*/}

            {/*            <>*/}

            {/*                <h4>*/}

            {/*                    Payment Terms*/}

            {/*                </h4>*/}

            {/*                <p>*/}

            {/*                    {meta.terms}*/}

            {/*                </p>*/}

            {/*            </>*/}

            {/*        )*/}

            {/*    }*/}

            {/*</div>*/}

            <div className="modern-totals-right">

                <table className="totals-table">

                    <tbody>

                        <tr>

                            <td>

                                Subtotal

                            </td>

                            <td>

                                {

                                    formatCurrency(

                                        totals.subtotal,

                                        currency

                                    )

                                }

                            </td>

                        </tr>

                        {

                            totals.discount > 0 && (

                                <tr>

                                    <td>

                                        Discount

                                    </td>

                                    <td>

                                        -

                                        {

                                            formatCurrency(

                                                totals.discount,

                                                currency

                                            )

                                        }

                                    </td>

                                </tr>

                            )

                        }

                        {

                            totals.shipping > 0 && (

                                <tr>

                                    <td>

                                        Shipping

                                    </td>

                                    <td>

                                        {

                                            formatCurrency(

                                                totals.shipping,

                                                currency

                                            )

                                        }

                                    </td>

                                </tr>

                            )

                        }

                        {

                            totals.tax > 0 && (

                                <tr>

                                    <td>

                                        VAT

                                    </td>

                                    <td>

                                        {

                                            formatCurrency(

                                                totals.tax,

                                                currency

                                            )

                                        }

                                    </td>

                                </tr>

                            )

                        }

                        {

                            totals.amountPaid > 0 && (

                                <tr>

                                    <td>

                                        Amount Paid

                                    </td>

                                    <td>

                                        -

                                        {

                                            formatCurrency(

                                                totals.amountPaid,

                                                currency

                                            )

                                        }

                                    </td>

                                </tr>

                            )

                        }

                        <tr className="grand-total">

                            <td>

                                Total

                            </td>

                            <td>

                                {

                                    formatCurrency(

                                        totals.total,

                                        currency

                                    )

                                }

                            </td>

                        </tr>

                        <tr className="balance-row">

                            <td>

                                Balance Due

                            </td>

                            <td>

                                {

                                    formatCurrency(

                                        totals.balanceDue,

                                        currency

                                    )

                                }

                            </td>

                        </tr>

                    </tbody>

                </table>

                <div className={`balance-status ${totals.balanceStatus.toLowerCase()}`}>

                    {totals.balanceStatus}

                </div>

            </div>

        </section>

    );

}