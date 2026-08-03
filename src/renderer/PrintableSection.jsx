import "./Styles/PrintableSection.css";

const TYPE_MAP = {

    header: {
        className: "document-header",
        keepTogether: true,
        pageBreak: "avoid"
    },

    addresses: {
        className: "document-addresses",
        keepTogether: true,
        pageBreak: "avoid"
    },

    recipient: {
        className: "document-recipient",
        keepTogether: true,
        pageBreak: "avoid"
    },

    items: {
        className: "items-table-section",
        keepTogether: false,
        pageBreak: "auto",
        splittable: true
    },

    totals: {
        className: "totals-section",
        keepTogether: true,
        pageBreak: "avoid"
    },

    payment: {
        className: "payment-section",
        keepTogether: true,
        pageBreak: "avoid"
    },

    signature: {
        className: "signature-section",
        keepTogether: true,
        pageBreak: "avoid"
    },

    footer: {
        className: "document-footer",
        keepTogether: true,
        pageBreak: "avoid"
    },

    notes: {
        className: "document-notes",
        keepTogether: true,
        pageBreak: "avoid"
    },

    terms: {
        className: "document-terms",
        keepTogether: true,
        pageBreak: "avoid"
    },

    qr: {
        className: "document-qr",
        keepTogether: true,
        pageBreak: "avoid"
    },

    history: {
        className: "document-history",
        keepTogether: true,
        pageBreak: "avoid"
    }

};

export default function PrintableSection({

    type,

    children,

    className = "",

    keepTogether,

    avoidBreak,

    pageBreakBefore,

    pageBreakAfter,

    pageBreakInside,

    pageBreak = null

}) {

    const config =
        TYPE_MAP[type] ?? {};

    const shouldKeepTogether =
        keepTogether ??
        config.keepTogether ??
        false;

    const effectiveBreak =
        pageBreak ??
        (pageBreakBefore
            ? "before"
            : pageBreakAfter
                ? "after"
                : avoidBreak
                    ? "avoid"
                    : config.pageBreak ??
                    "auto");

    const classes = [

        "printable-section",

        config.className,

        className,

        shouldKeepTogether &&
        "keep-together",

        effectiveBreak === "before" &&
        "page-break-before",

        effectiveBreak === "after" &&
        "page-break-after",

        effectiveBreak === "avoid" &&
        "avoid-break",

        effectiveBreak === "auto" &&
        "allow-break",

        pageBreakInside &&
        "page-break-inside"


    ]
        .filter(Boolean)
        .join(" ");

    const splittable =
        config.splittable ?? false;

    return (

        <section
            className={classes}
            data-section={type}
            data-splittable={splittable}
        >

            {children}

        </section>

    );

}