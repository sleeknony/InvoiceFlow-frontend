export const DOCUMENT_BEHAVIOR = {
    Invoice: {
        customerLabel: "Customer",
        showDueDate: true,
        showValidityDate: false,
        showPaymentSection: true,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: false,
        allowPayments: true,
        showShippingCost: true
    },

    TaxInvoice: {
        customerLabel: "Customer",
        showDueDate: true,
        showValidityDate: false,
        showPaymentSection: true,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: false,
        allowPayments: true,
        showShippingCost: true
    },

    ProformaInvoice: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: true,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: true
    },

    Receipt: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: true,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: true,
        showTaxBreakdown: false,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: false
    },

    SalesReceipt: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: true,
        showTaxBreakdown: false,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: false
    },

    CashReceipt: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: true,
        showTaxBreakdown: false,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: false
    },

    Quote: {
        customerLabel: "Client",
        showDueDate: false,
        showValidityDate: true,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: true
    },

    Estimate: {
        customerLabel: "Client",
        showDueDate: false,
        showValidityDate: true,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: true
    },

    CreditMemo: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: true,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: true,
        allowPayments: false,
        showShippingCost: false
    },

    CreditNote: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: true,
        showPurchaseOrderNumber: false,
        showDeliveryDate: false,
        showPaidDate: false,
        showTaxBreakdown: true,
        allowNegativeItems: true,
        allowPayments: false,
        showShippingCost: false
    },

    PurchaseOrder: {
        customerLabel: "Supplier",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: true,
        showDeliveryDate: true,
        showPaidDate: false,
        showTaxBreakdown: false,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: true
    },

    DeliveryNote: {
        customerLabel: "Customer",
        showDueDate: false,
        showValidityDate: false,
        showPaymentSection: false,
        showOriginalInvoiceNumber: false,
        showPurchaseOrderNumber: true,
        showDeliveryDate: true,
        showPaidDate: false,
        showTaxBreakdown: false,
        allowNegativeItems: false,
        allowPayments: false,
        showShippingCost: true
    }

}

