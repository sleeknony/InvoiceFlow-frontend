import currencySymbol from "../../utils/currency";

export default function TotalsSidebar({

    totals,

    currency,

    behavior

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body p-4">

                <h5 className="fw-bold mb-4">

                    Totals

                </h5>

                <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">

                        Subtotal

                    </span>

                    <strong>

                        {currencySymbol(
                            totals.subTotal,
                            currency
                        )}

                    </strong>

                </div>

                <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">

                        Discount

                    </span>

                    <strong className="text-danger">

                        - {currencySymbol(
                            totals.discountTotal,
                            currency
                        )}

                    </strong>

                </div>

                <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">

                        Tax

                    </span>

                    <strong>

                        {currencySymbol(
                            totals.taxTotal,
                            currency
                        )}

                    </strong>

                </div>

                {

                    behavior.showShippingCost && (

                        <div className="d-flex justify-content-between mb-3">

                            <span className="text-muted">

                                Shipping

                            </span>

                            <strong>

                                {currencySymbol(
                                    totals.shippingCost,
                                    currency
                                )}

                            </strong>

                        </div>

                    )

                }

                <hr />

                <div
                    className="rounded-4 p-3 mt-4"
                    style={{
                        background: "#f8f9fa"
                    }}>

                    <div className="small text-muted">

                        GRAND TOTAL

                    </div>

                    <div
                        className="fw-bold"
                        style={{
                            fontSize: "2rem"
                        }}>

                        {currencySymbol(
                            totals.total,
                            currency
                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}