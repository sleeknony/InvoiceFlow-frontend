import formatDate from "../../utils/formatDate";

class MetadataResolver {

    resolve(document = {}, settings = {}, config = {}) {

        const features = config.features ?? config;

        const secondaryDate =
            features.secondaryDateField
                ? document[features.secondaryDateField]
                : null;

        const issueDate =
            document.issueDate ?? null;

        return {

            title:
                config.title ?? document.type ?? "",

            subtitle:
                settings.companyName ?? "",

            documentNumber:
                document.documentNumber ?? "",

            status:
                document.status ?? "",

            issueDate,

            formattedIssueDate:
                issueDate ? formatDate(issueDate) : "",

            dateLabel:
                features.dateLabels?.secondary ?? "",

            dateValue:
                secondaryDate,

            formattedSecondaryDate:
                secondaryDate ? formatDate(secondaryDate) : "",

            reference:
                document.reference ?? "",

            purchaseOrder:
                document.purchaseOrder ?? "",

            notes:
                document.notes ?? "",

            terms:
                document.terms ?? "",

            fileName:
                `${document.type ?? "Document"}-${document.documentNumber ?? ""}`
        };
    }

}

export default new MetadataResolver();