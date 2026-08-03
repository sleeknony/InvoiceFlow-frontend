const CorporateMetrics = {

    page: {

        width: 794,

        height: 1122,

        paddingTop: 52,

        paddingBottom: 52,

        paddingLeft: 42,

        paddingRight: 42

    },

    spacing: {

        section: 28,

        large: 40

    },

    table: {

        headerHeight: 46,

        rowBaseHeight: 36,

        charactersPerLine: 45,

        lineHeight: 19

    },

    header(document) {

        let height = 145;

        if (document?.company?.logo)
            height += 45;

        return height;

    },

    addresses(document) {

        let height = 100;

        if (document?.customer?.billingAddress)
            height += 35;

        if (document?.customer?.shippingAddress)
            height += 35;

        return height;

    },

    totals(document) {

        let rows = 3;

        if (document?.discountTotal > 0)
            rows++;

        if (document?.taxTotal > 0)
            rows++;

        if (document?.shippingCost > 0)
            rows++;

        return rows * 30;

    },

    payment(document) {

        if (!document?.payment?.show)
            return 0;

        return 110;

    },

    signature(document) {

        if (!document?.signature?.show)
            return 0;

        return 110;

    },

    footer(document) {

        let height = 50;

        if (document?.settings?.showBranding)
            height += 20;

        return height;

    }

};

export default CorporateMetrics;