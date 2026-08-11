export default function DocumentTypeBadge({ type }) {

    const map = {
        Invoice: "invoice",
        Quote: "quote",
        Receipt: "receipt",
        Estimate: "estimate",
        ProformaInvoice: "proforma",
        CreditNote: "credit-note",
        CreditMemo: "credit-note",
        PurchaseOrder: "purchase-order",
        DeliveryNote: "delivery-note",
        SalesReceipt: "sales-receipt",
        CashReceipt: "cash-receipt"
    };

    return (
        <span
            className={`document-type-badge ${map[type] ?? "default"}`}
        >
            {type}
        </span>
    );
}