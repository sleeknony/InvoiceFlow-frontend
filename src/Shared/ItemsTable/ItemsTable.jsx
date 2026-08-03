import "./ItemsTable.css";

import PrintableSection
    from "../../renderer/PrintableSection";

import {
    useRenderDocument
} from "../../renderer/RenderContext";

import formatCurrency
    from "../../utils/currency";

import { useDocument } from "../../renderer/RenderContext";


export default function ItemsTable({

    rows = null

}) {

    const {

        items,

        layout

    } = useDocument();

    const displayRows =
        rows ?? items.rows;

  

    // Hide the entire section if there are no items
    if (!displayRows?.length) {

        return null;

    }

    const {

        currency

    } = items;

    const {

        columns,

        widths

    } = layout;

    return (

        <PrintableSection type="items">

            <section className="items-card">

                <table className="items-table">

                    <colgroup>

                        {columns.map(column => (

                            <col
                                key={column}
                                style={{
                                    width: widths[column]
                                }}
                            />

                        ))}

                    </colgroup>

                    <thead>

                        <tr>

                            {columns.includes("description") &&
                                <th>DESCRIPTION</th>}

                            {columns.includes("quantity") &&
                                <th className="numeric">
                                    QTY
                                </th>}

                            {columns.includes("unitPrice") &&
                                <th className="numeric">
                                    PRICE
                                </th>}

                            {columns.includes("discount") &&
                                <th className="numeric">
                                    DISC %
                                </th>}

                            {columns.includes("tax") &&
                                <th className="numeric">
                                    VAT %
                                </th>}

                            {columns.includes("total") &&
                                <th className="numeric">
                                    AMOUNT
                                </th>}

                        </tr>

                    </thead>

                    <tbody>

                        {displayRows.map(item => (

                            <tr key={item.id}>

                                {columns.includes("description") &&
                                    <td>
                                        {item.description}
                                    </td>}

                                {columns.includes("quantity") &&
                                    <td className="numeric">
                                        {item.quantity}
                                    </td>}

                                {columns.includes("unitPrice") &&
                                    <td className="numeric">
                                        {formatCurrency(
                                            item.unitPrice,
                                            currency
                                        )}
                                    </td>}

                                {columns.includes("discount") &&
                                    <td className="numeric">
                                        {item.discount}
                                    </td>}

                                {columns.includes("tax") &&
                                    <td className="numeric">
                                        {item.tax}
                                    </td>}

                                {columns.includes("total") &&
                                    <td className="numeric total-column">
                                        {formatCurrency(
                                            item.total,
                                            currency
                                        )}
                                    </td>}

                            </tr>

                        ))}

                    </tbody>

                </table>

            </section>

        </PrintableSection>

    );

}