class FlagResolver {

    resolve({

        meta = {},

        customer = {},

        payment = {},

        features = {},

        company = {},

        subscription = {}

    } = {}) {

        return {

            showStatus:
                Boolean(meta.status),

            showDueDate:
                Boolean(meta.dateValue),

            showShippingAddress:
                customer.shipping?.exists === true,

            showPaymentInstructions:
                Boolean(payment.bank?.instructions),

            showSignature:
                features.showSignature === true,

            showQrCode:
                features.showQrCode === true,

            showInvoiceFlowBranding:
                subscription.showInvoiceFlowBranding === true

        };

    }

}

export default new FlagResolver();