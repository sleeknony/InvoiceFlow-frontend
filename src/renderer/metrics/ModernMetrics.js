const ModernMetrics = {

    page: {

        width: 794,

        height: 1122,

        paddingTop: 48,

        paddingBottom: 48,

        paddingLeft: 40,

        paddingRight: 40

    },

    spacing: {

        section: 24,

        large: 36

    },

    table: {

        headerHeight: 56,

        rowBaseHeight: 60,

        charactersPerLine: 42,

        lineHeight: 22

    },

    header(document) {

        let height = 120;

        if (document?.company?.logo)
            height += 35;

        if (document?.company?.email)
            height += 10;

        if (document?.company?.phone)
            height += 10;

        return height;

    },

    addresses(document) {

        let height = 90;

        if (document?.customer?.billingAddress)
            height += 30;

        if (document?.customer?.shippingAddress)
            height += 30;

        return height;

    },

    totals(document) {

        let rows = 3;

        if ((document?.totals?.discount ?? 0) > 0)
            rows++;

        if ((document?.totals?.tax ?? 0) > 0)
            rows++;

        if ((document?.totals?.shipping ?? 0) > 0)
            rows++;

        return rows * 28;

    },

    payment(document) {

        if (!document?.flags?.showPaymentInstructions)
            return 0;

        let height = 70;

        if (document?.payment?.bank?.name)
            height += 18;

        if (document?.payment?.bank?.accountNumber)
            height += 18;

        if (document?.payment?.bank?.iban)
            height += 18;

        if (document?.payment?.bank?.swiftCode)
            height += 18;

        if (document?.payment?.bank?.instructions)
            height += 24;

        return height;

    },

    signature(document) {

        if (!document?.flags?.showSignature)
            return 0;

        let height = 70;

        if (document?.approvals?.latest)
            height += 40;

        return height;

    },

    footer(document) {

        let height = 45;

        if (document?.flags?.showInvoiceFlowBranding)
            height += 20;

        if (document?.company?.footer?.text)
            height += 20;

        return height;

    }

};

export default ModernMetrics;