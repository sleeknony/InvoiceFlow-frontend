export const DOCUMENT_TYPES = [
    { value: "Invoice", label: "Invoice", prefix: "INV-" },
    { value: "TaxInvoice", label: "Tax Invoice", prefix: "TAX-" },
    { value: "ProformaInvoice", label: "Proforma Invoice", prefix: "PRF-" },
    { value: "Receipt", label: "Receipt", prefix: "RCT-" },
    { value: "SalesReceipt", label: "Sales Receipt", prefix: "SRT-" },
    { value: "CashReceipt", label: "Cash Receipt", prefix: "CRT-" },
    { value: "Quote", label: "Quote", prefix: "QTE-" },
    { value: "Estimate", label: "Estimate", prefix: "EST-" },
    { value: "CreditMemo", label: "Credit Memo", prefix: "CRM-" },
    { value: "CreditNote", label: "Credit Note", prefix: "CRN-" },
    { value: "PurchaseOrder", label: "Purchase Order", prefix: "PO-" },
    { value: "DeliveryNote", label: "Delivery Note", prefix: "DN-" },
];

export const CURRENCIES = ["NGN", "USD", "EUR", "GBP"];

export const DEFAULT_TAX_RATE = 7.5; // VAT (Nigeria) — change in settings later

export const DOC_STATUS = ["Draft", "Issued", "Sent", "Paid", "PartiallyPaid", "Void","Refunded"];

// src/utils/documentTemplates.js

export const DOCUMENT_TEMPLATES = [
    {
        value: "Modern",
        label: "Modern"
    },
    {
        value: "Classic",
        label: "Classic"
    },
    {
        value: "Minimal",
        label: "Minimal"
    },
    {
        value: "Corporate",
        label: "Corporate"
    }
];

export const SUBSCRIPTION_FEATURES = Object.freeze({
    CREATE_DOCUMENTS: "CreateDocuments",
    EDIT_DOCUMENTS: "EditDocuments",
    PDF_DOWNLOAD: "PdfDownload",
    EMAIL_DOCUMENTS: "EmailDocuments",
    CUSTOM_TEMPLATES: "CustomTemplates",
    PAYMENT_TRACKING: "PaymentTracking",
    MULTIPLE_USERS: "MultipleUsers",
    API_ACCESS: "ApiAccess",
    BULK_IMPORT: "BulkImport",
    MULTIPLE_COMPANIES: "MultipleCompanies",
    DOCUMENT_CONVERSION: "DocumentConversion"
});
