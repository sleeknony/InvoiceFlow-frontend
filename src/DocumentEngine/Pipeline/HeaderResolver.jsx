class HeaderResolver {

    static resolve(document = {}) {

        //return {

        //    id:
        //        document.id,

        //    type:
        //        document.type,

        //    title:
        //        document.type,

        //    number:
        //        document.number,

        //    status:
        //        document.status,

        //    issueDate:
        //        document.issueDate,

        //    dueDate:
        //        document.dueDate,

        //    formattedIssueDate:
        //        document.issueDate
        //            ? new Date(document.issueDate).toLocaleDateString()
        //            : "",

        //    formattedDueDate:
        //        document.dueDate
        //            ? new Date(document.dueDate).toLocaleDateString()
        //            : "",

        //    currency:
        //        document.currency,

        //    reference:
        //        document.reference,

        //    purchaseOrder:
        //        document.purchaseOrder,

        //    notes:
        //        document.notes,

        //    terms:
        //        document.terms

        //};


        const secondaryDate =
            document.dueDate ??
            document.validityDate ??
            null;

        const secondaryLabel =
            document.dueDate
                ? "DUE DATE"
                : document.validityDate
                    ? "VALID UNTIL"
                    : null;

        return {

            id: document.id,
            type: document.type,
            title: document.type,
            number: document.number,
            status: document.status,

            issueDate: document.issueDate,
            dueDate: document.dueDate,
            validityDate: document.validityDate,

            formattedIssueDate:
                document.issueDate
                    ? new Date(document.issueDate).toLocaleDateString()
                    : "",

            formattedDueDate:
                document.dueDate
                    ? new Date(document.dueDate).toLocaleDateString()
                    : "",

            formattedValidityDate:
                document.validityDate
                    ? new Date(document.validityDate).toLocaleDateString()
                    : "",

            secondaryDate,
            dateLabel: secondaryLabel,

            formattedSecondaryDate:
                secondaryDate
                    ? new Date(secondaryDate).toLocaleDateString()
                    : "",

            currency: document.currency,
            reference: document.reference,
            purchaseOrder: document.purchaseOrder,
            notes: document.notes,
            terms: document.terms
        };

    }

}

export default HeaderResolver;