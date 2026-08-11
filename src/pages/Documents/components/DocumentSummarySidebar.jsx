import { Card } from "react-bootstrap";

export default function DocumentSummarySidebar({
    document,
    totalPaid,
    remainingBalance
}) {

    const formatMoney = value =>
        new Intl.NumberFormat(
            undefined,
            {
                style: "currency",
                currency: document.currency || "NGN"
            }
        ).format(value ?? 0);

    const formatDate = value =>
        value
            ? new Date(value).toLocaleDateString()
            : "-";

    return (

        <div className="document-summary-sidebar">

            <Card className="shadow-sm border-0 mb-3">

                <Card.Header>
                    Summary
                </Card.Header>

                <Card.Body>

                    <div className="mb-3">

                        <small className="text-muted">
                            Document
                        </small>

                        <div>
                            <strong>{document.documentNumber}</strong>
                        </div>

                        <div>{document.type}</div>

                        <div>{document.status}</div>

                    </div>

                    <hr />

                    <div className="mb-3">

                        <small className="text-muted">
                            Customer
                        </small>

                        <div>{document.customerName}</div>

                        {document.customerEmail && (
                            <div className="text-muted">
                                {document.customerEmail}
                            </div>
                        )}

                    </div>

                </Card.Body>

            </Card>


            <Card className="shadow-sm border-0 mb-3">

                <Card.Header>
                    Financial Summary
                </Card.Header>

                <Card.Body>

                    <SummaryRow
                        label="Subtotal"
                        value={formatMoney(document.subTotal)}
                    />

                    <SummaryRow
                        label="Discount"
                        value={formatMoney(document.discountAmount)}
                    />

                    <SummaryRow
                        label="Tax"
                        value={formatMoney(document.taxAmount)}
                    />

                    <SummaryRow
                        label="Shipping"
                        value={formatMoney(document.shippingCost)}
                    />

                    <hr />

                    <SummaryRow
                        label="Total"
                        value={formatMoney(document.total)}
                        bold
                    />

                    <SummaryRow
                        label="Paid"
                        value={formatMoney(totalPaid)}
                    />

                    <SummaryRow
                        label="Balance"
                        value={formatMoney(remainingBalance)}
                        bold
                    />

                </Card.Body>

            </Card>


            <Card className="shadow-sm border-0 mb-3">

                <Card.Header>
                    Important Dates
                </Card.Header>

                <Card.Body>

                    <SummaryRow
                        label="Issue"
                        value={formatDate(document.issueDate)}
                    />

                    {document.dueDate && (
                        <SummaryRow
                            label="Due"
                            value={formatDate(document.dueDate)}
                        />
                    )}

                    {document.validityDate && (
                        <SummaryRow
                            label="Valid Until"
                            value={formatDate(document.validityDate)}
                        />
                    )}

                    {document.deliveryDate && (
                        <SummaryRow
                            label="Delivery"
                            value={formatDate(document.deliveryDate)}
                        />
                    )}

                </Card.Body>

            </Card>


            <Card className="shadow-sm border-0">

                <Card.Header>
                    Additional Information
                </Card.Header>

                <Card.Body>

                    {document.purchaseOrderNumber && (
                        <SummaryRow
                            label="PO"
                            value={document.purchaseOrderNumber}
                        />
                    )}

                    {document.referenceNumber && (
                        <SummaryRow
                            label="Reference"
                            value={document.referenceNumber}
                        />
                    )}

                    {document.deliveryMethod && (
                        <SummaryRow
                            label="Delivery"
                            value={document.deliveryMethod}
                        />
                    )}

                    {document.trackingNumber && (
                        <SummaryRow
                            label="Tracking"
                            value={document.trackingNumber}
                        />
                    )}

                </Card.Body>

            </Card>

        </div>

    );

}

function SummaryRow({
    label,
    value,
    bold = false
}) {

    return (

        <div className="d-flex justify-content-between mb-2">

            <span>{label}</span>

            <span className={bold ? "fw-bold" : ""}>
                {value}
            </span>

        </div>

    );

}