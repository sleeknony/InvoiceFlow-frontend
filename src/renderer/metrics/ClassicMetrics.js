const ClassicMetrics = {

    page: {

        width: 794,

        height: 1122,

        paddingTop: 40,

        paddingBottom: 40,

        paddingLeft: 36,

        paddingRight: 36

    },

    spacing: {

        section: 20,

        large: 28

    },

    table: {

        headerHeight: 40,

        rowBaseHeight: 32,

        charactersPerLine: 52,

        lineHeight: 17

    },

    header(document) {

        let height = 110;

        if (document?.company?.logo)
            height += 30;

        return height;

    },

    addresses(document) {

        let height = 85;

        if (document?.customer?.billingAddress)
            height += 28;

        if (document?.customer?.shippingAddress)
            height += 28;

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

        return rows * 26;

    },

    payment(document) {

        if (!document?.payment?.show)
            return 0;

        return 80;

    },

    signature(document) {

        if (!document?.signature?.show)
            return 0;

        return 90;

    },

    footer(document) {

        let height = 40;

        if (document?.settings?.showBranding)
            height += 20;

        return height;

    }

};

export default ClassicMetrics;