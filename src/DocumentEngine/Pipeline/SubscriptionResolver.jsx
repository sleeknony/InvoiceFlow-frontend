class SubscriptionResolver {

    resolve(settings = {}, config = {}) {

        const plan =
            settings.subscriptionPlan ?? "Free";

        const rules =
            config.subscription ?? {};

        const isFree =
            String(plan).toLowerCase() === "free";

        return {

            plan,

            isFree,

            canRemoveBranding:
                Boolean(rules.allowBrandRemoval) && !isFree,

            showInvoiceFlowBranding:
                !(Boolean(rules.allowBrandRemoval) && !isFree),

            canUseCustomFonts:
                Boolean(rules.allowCustomFonts) && !isFree,

            canUseBackground:
                Boolean(rules.allowBackground) && !isFree,

            canUseExtraPages:
                Boolean(rules.allowExtraPages) && !isFree

        };

    }

}

export default new SubscriptionResolver();