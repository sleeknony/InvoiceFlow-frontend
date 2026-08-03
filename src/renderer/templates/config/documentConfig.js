export const DOCUMENT_CONFIG = {

    Invoice: {

        title: "Invoice",
        badge: "UNPAID",
        color: "#0d6efd",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: true,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Issue Date",
                secondary: "Due Date"
            },
            secondaryDateField: "dueDate"
            
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    TaxInvoice: {

        title: "Tax Invoice",
        badge: "TAX INVOICE",
        color: "#198754",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: true,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: true,
            dateLabels: {
                primary: "Issue Date",
                secondary: "Due Date"
            },
            secondaryDateField: "dueDate"
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    ProformaInvoice: {

        title: "Proforma Invoice",
        badge: "PROFORMA",
        color: "#6f42c1",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Issue Date",
                secondary: "Valid Until"
            },
            secondaryDateField: "validityDate"
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    Quote: {

        title: "Quotation",
        badge: "QUOTE",
        color: "#fd7e14",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Quote Date",
                secondary: "Valid Until"
            },
            secondaryDateField: "validityDate"
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    Estimate: {

        title: "Estimate",
        badge: "ESTIMATE",
        color: "#20c997",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Estimate Date",
                secondary: "Valid Until"
            },
            secondaryDateField: "validityDate"
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    Receipt: {

        title: "Receipt",
        badge: "PAID",
        color: "#198754",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false,
            dateLabels: {
                primary: "Receipt Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    SalesReceipt: {

        title: "Sales Receipt",
        badge: "PAID",
        color: "#198754",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false,
            dateLabels: {
                primary: "Receipt Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    CashReceipt: {

        title: "Cash Receipt",
        badge: "PAID",
        color: "#20c997",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false,
            dateLabels: {
                primary: "Receipt Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    PurchaseOrder: {

        title: "Purchase Order",
        badge: "PURCHASE ORDER",
        color: "#0dcaf0",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Order Date",
                secondary: "Expected Delivery"
            },
            secondaryDateField: "deliveryDate"
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    DeliveryNote: {

        title: "Delivery Note",
        badge: "DELIVERY",
        color: "#6c757d",

        columns: [
            "description",
            "quantity"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: false,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true,
            dateLabels: {
                primary: "Delivery Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    CreditMemo: {

        title: "Credit Memo",
        badge: "CREDIT MEMO",
        color: "#dc3545",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: false,
            dateLabels: {
                primary: "Credit Memo Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    },

    CreditNote: {

        title: "Credit Note",
        badge: "CREDIT NOTE",
        color: "#dc3545",

        columns: [
            "description",
            "quantity",
            "unitPrice",
            "discount",
            "tax",
            "total"
        ],

        features: {
            showLogo: true,
            showRecipient: true,
            showPaymentInstructions: false,
            showTerms: false,
            showTotals: true,
            showFooter: true,
            showApprovalWorkflow: true,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: false,
            dateLabels: {
                primary: "Credit Note Date",
                secondary: null
            },
            secondaryDateField: null
        },

        subscription: {
            requiredPlan: "Free",
            allowBrandRemoval: false,
            allowCustomFonts: false,
            allowExtraPages: false,
            allowBackground: false
        }
    }

};