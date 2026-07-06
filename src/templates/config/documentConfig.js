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
            showSignature: false,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: true
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
            showPaymentInstructions: true,
            showTerms: true,
            showTotals: true,
            showFooter: true,
            showSignature: false,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false
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
            showSignature: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false
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
            showSignature: false,
            showWatermark: false,
            showQRCode: true,
            showShippingCost: false
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
            showSignature: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: true,
            showWatermark: false,
            showQRCode: false,
            showShippingCost: true
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
            showSignature: true,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: false
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
            showSignature: true,
            showWatermark: true,
            showQRCode: false,
            showShippingCost: false
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