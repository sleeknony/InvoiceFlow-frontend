//import { calcLineTotal } from "../utils/calc.jsx";
//import { FaTrash } from "react-icons/fa";
//import { FaPlus } from "react-icons/fa";
//import { DEFAULT_TAX_RATE } from "../utils/constants.jsx";

//export default function LineItemsTable({ items, onChange, defaultVatRate, allowNegativeItems = false })
//{
//    /*console.log("Default VAT:", defaultVatRate);*/
//    {
//        function update(index, patch) {
//            const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
//            onChange(next);
//        }

//        function addRow() {
//            onChange([
//                ...items,
//                {
//                    description: "",
//                    quantity: 1,
//                    unitPrice: 0,
//                    discountPercent: 0,
//                    taxRatePercent: 0
//                },
//            ]);
//        }

//        function removeRow(index) {
//            onChange(items.filter((_, i) => i !== index));
//        }

//        return (
//            <div className="card">
//                <div className="card-head">
//                    <div className="card-title">Click to add line Items</div>
//                    {/*   <button className="btn btn-success" type="button" onClick={addRow}>Add Item</button>*/}

//                    <button
//                        className="btn btn-success"
//                        type="button"
//                        onClick={addRow}
//                        title="Add Item">
//                        <FaPlus />
//                    </button>

//                </div>

//                <div className="table-wrap">
//                    <table className="table">
//                        <thead>
//                            <tr>
//                                <th style={{ width: "40%" }}>Description</th>
//                                <th>Qty</th>
//                                <th>Unit Price</th>
//                                <th>Discount %</th>
//                                <th>Tax %</th>
//                                <th>Line Total</th>
//                                <th></th>
//                            </tr>
//                        </thead>

//                        <tbody>
//                            {items.length === 0 ? (
//                                <tr>
//                                    <td colSpan="7" className="muted">No items yet. Click + to add an item.</td>
//                                </tr>
//                            ) : (
//                                items.map((it, idx) => {
//                                    const r = calcLineTotal(it);
//                                    return (
//                                        <tr key={idx}>
//                                            <td>
//                                                <input
//                                                    className="form-control item-description"
//                                                    value={it.description}
//                                                    onChange={(e) => update(idx, { description: e.target.value })}
//                                                    placeholder="e.g. Shipping, Consultancy, Goods..."
//                                                />
//                                            </td>
//                                            <td>
//                                                <input
//                                                    className="form-control item-qty item-number"
//                                                    type="number"
//                                                    value={it.quantity ?? 1}
//                                                    min={allowNegativeItems ? -999999 : 0}
//                                                    onChange={(e) => update(idx, {
//                                                        quantity: Number(e.target.value)
//                                                    })}
//                                                />
//                                            </td>
//                                            <td>
//                                                <input
//                                                    className="form-control item-price item-number"
//                                                    type="number"
//                                                    value={it.unitPrice ?? 0}
//                                                    min="0"
//                                                    onChange={(e) => update(idx, { unitPrice: e.target.value })}
//                                                />
//                                            </td>
//                                            <td>
//                                                <input
//                                                    className="form-control item-percent item-number"
//                                                    type="number"
//                                                    value={it.discountPercent ?? 0}
//                                                    min="0"
//                                                    onChange={(e) => update(idx, {
//                                                        discountPercent: Number(e.target.value)
//                                                    })}
//                                                />
//                                            </td>
//                                            {/*<td>*/}
//                                            {/*    <input*/}
//                                            {/*        className="form-control item-percent item-number"*/}
//                                            {/*        type="number"*/}
//                                            {/*        value={it.taxRatePct}*/}
//                                            {/*        min="0"*/}
//                                            {/*        onChange={(e) => update(idx, { taxRatePct: e.target.value })}*/}
//                                            {/*    />*/}
//                                            {/*</td>*/}

//                                            <td>
//                                                <div className="d-flex align-items-center gap-2">

//                                                    <input
//                                                        type="checkbox"
//                                                        checked={(it.taxRatePercent ?? 0) > 0}
//                                                        onChange={(e) =>
//                                                            update(idx, {
//                                                                taxRatePercent: e.target.checked
//                                                                    ? (defaultVatRate || 0)
//                                                                    : 0
//                                                            })
//                                                        }
//                                                    />

//                                                    <input
//                                                        type="number"
//                                                        className="form-control form-control-sm"
//                                                        style={{ width: "70px" }}
//                                                        value={it.taxRatePercent ?? 0}
//                                                        disabled={it.taxRatePercent === 0}
//                                                        onChange={(e) =>
//                                                            update(idx, {
//                                                                taxRatePercent: Number(e.target.value)
//                                                            })
//                                                        }
//                                                    />

//                                                </div>
//                                            </td>
//                                            <td className="right">
//                                                {Number.isFinite(r.total) ? r.total.toFixed(2) : "0.00"}
//                                            </td>


//                                            <td className="text-center">
//                                                <button
//                                                    type="button"
//                                                    className="btn btn-sm btn-outline-danger"
//                                                    onClick={() => removeRow(idx)}
//                                                    title="Remove Item" >
//                                                    <FaTrash />
//                                                </button>


//                                                {/*<button*/}
//                                                {/*    type="button"*/}
//                                                {/*    className="btn btn-sm btn-danger rounded-circle"*/}
//                                                {/*    onClick={() => removeRow(idx)}*/}
//                                                {/*    title="Remove Item"*/}
//                                                {/*    style={{*/}
//                                                {/*        width: "34px",*/}
//                                                {/*        height: "34px",*/}
//                                                {/*        padding: 0*/}
//                                                {/*    }}*/}
//                                                {/*>*/}
//                                                {/*    <FaTrash size={10} />*/}
//                                                {/*</button>*/}

//                                            </td>
//                                        </tr>
//                                    );
//                                })
//                            )}
//                        </tbody>
//                    </table>
//                </div>
//            </div>
//        );
//    }
//}



import { calcLineTotal } from "../utils/calc.jsx";
import { FaTrash, FaPlus } from "react-icons/fa";
import "./LineItemsTable.css";

export default function LineItemsTable({
    items = [],
    onChange,
    defaultVatRate,
    allowNegativeItems = false
}) {
    function update(index, patch) {
        const next = items.map((item, i) =>
            i === index ? { ...item, ...patch } : item
        );

        onChange(next);
    }

    function addRow() {
        onChange([
            ...items,
            {
                description: "",
                quantity: 1,
                unitPrice: 0,
                discountPercent: 0,
                taxRatePercent: 0
            }
        ]);
    }

    function removeRow(index) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="card line-items-card">

            <div className="card-head line-items-header">
                <div>
                    <div className="card-title">
                        Add Items
                    </div>

                    <small className="line-items-subtitle">
                        Add products or services to this document.
                    </small>
                </div>

                <button
                    className="btn btn-success line-items-add-btn"
                    type="button"
                    onClick={addRow}
                    title="Add Item"
                >
                    <FaPlus />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="line-items-content">

                {/* Desktop column headings */}
                <div className="line-items-grid line-items-column-header">
                    <div>Description</div>
                    <div>Qty</div>
                    <div>Unit Price</div>
                    <div>Discount %</div>
                    <div>Tax %</div>
                    <div className="text-end">Line Total</div>
                    <div></div>
                </div>

                {items.length === 0 ? (
                    <div className="line-items-empty">
                        No items added yet.
                        <span>Click Add Item to get started.</span>
                    </div>
                ) : (
                    items.map((item, index) => {
                        const result = calcLineTotal(item);

                        return (
                            <div
                                className="line-items-grid line-item-row"
                                key={item.id ?? index}
                            >

                                <div className="line-item-field description-field">
                                    <label>Description</label>

                                    <input
                                        className="form-control"
                                        value={item.description ?? ""}
                                        onChange={(e) =>
                                            update(index, {
                                                description: e.target.value
                                            })
                                        }
                                        placeholder="e.g. Shipping, Consultancy, Goods..."
                                    />
                                </div>

                                <div className="line-item-field quantity-field">
                                    <label>Quantity</label>

                                    <input
                                        className="form-control"
                                        type="number"
                                        value={item.quantity ?? 1}
                                        min={allowNegativeItems ? -999999 : 0}
                                        onChange={(e) =>
                                            update(index, {
                                                quantity: Number(e.target.value)
                                            })
                                        }
                                    />
                                </div>

                                <div className="line-item-field price-field">
                                    <label>Unit Price</label>

                                    <input
                                        className="form-control"
                                        type="number"
                                        value={item.unitPrice ?? 0}
                                        min="0"
                                        onChange={(e) =>
                                            update(index, {
                                                unitPrice: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="line-item-field discount-field">
                                    <label>Discount %</label>

                                    <input
                                        className="form-control"
                                        type="number"
                                        value={item.discountPercent ?? 0}
                                        min="0"
                                        onChange={(e) =>
                                            update(index, {
                                                discountPercent: Number(e.target.value)
                                            })
                                        }
                                    />
                                </div>

                                <div className="line-item-field tax-field">
                                    <label>Tax %</label>

                                    <div className="line-item-tax-control">
                                        <input
                                            type="checkbox"
                                            checked={(item.taxRatePercent ?? 0) > 0}
                                            onChange={(e) =>
                                                update(index, {
                                                    taxRatePercent: e.target.checked
                                                        ? (defaultVatRate || 0)
                                                        : 0
                                                })
                                            }
                                        />

                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.taxRatePercent ?? 0}
                                            disabled={item.taxRatePercent === 0}
                                            onChange={(e) =>
                                                update(index, {
                                                    taxRatePercent: Number(e.target.value)
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="line-item-field line-total-field">
                                    <label>Line Total</label>

                                    <div className="line-item-total">
                                        {Number.isFinite(result.total)
                                            ? result.total.toFixed(2)
                                            : "0.00"}
                                    </div>
                                </div>

                                <div className="line-item-field line-item-delete-field">
                                    <label className="desktop-delete-label">
                                        Action
                                    </label>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger line-item-delete-btn"
                                        onClick={() => removeRow(index)}
                                        title="Remove Item"
                                    >
                                        <FaTrash />
                                        <span>Remove</span>
                                    </button>
                                </div>

                            </div>
                        );
                    })
                )}

            </div>
        </div>
    );
}

