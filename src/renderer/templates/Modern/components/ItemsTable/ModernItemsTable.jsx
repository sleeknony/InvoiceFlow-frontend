import "./ModernItemsTable.css";

import { useDocument } from "../../../../RenderContext";

import formatCurrency from "../../../../../utils/currency";

export default function ModernItemsTable() {

    const {

        items

    } = useDocument();

    const currency =

        items.currency || "NGN";

    return (

        <section className="modern-items">

            <table className="modern-items-table">

                <thead>

                    <tr>

                        <th className="description">

                            DESCRIPTION

                        </th>

                        <th className="quantity">

                            QTY

                        </th>

                        <th className="price">

                            UNIT PRICE

                        </th>

                        <th className="amount">

                            AMOUNT

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        items.rows.map(row => (

                            <tr
                                key={row.id}
                            >

                                <td className="description">

                                    <div className="item-description">

                                        {

                                            row.description ||

                                            "-"

                                        }

                                    </div>

                                </td>

                                <td className="quantity">

                                    {

                                        row.quantity

                                    }

                                </td>

                                <td className="price">

                                    {

                                        formatCurrency(

                                            row.unitPrice,

                                            currency

                                        )

                                    }

                                </td>

                                <td className="amount">

                                    {

                                        formatCurrency(

                                            row.total,

                                            currency

                                        )

                                    }

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </section>

    );

}