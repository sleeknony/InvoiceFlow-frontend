class ApprovalResolver {

    resolve(
        history = [],
        features = {}
    ) {

        const records = (history ?? []).map((item, index) => ({

            id:
                item.id ?? index,

            user:
                item.userName ?? "",

            action:
                item.action ?? "",

            comment:
                item.comment ?? "",

            date:
                item.actionDate ?? "",

            role:
                item.roleName ?? ""

        }));

        const latestApproved =
            records
                .slice()
                .reverse()
                .find(record => record.action === "Approved") ?? null;

        return {

            enabled:
                features.showApprovalWorkflow === true,

            history:
                records,

            latest:
                latestApproved

        };

    }

}

export default new ApprovalResolver();