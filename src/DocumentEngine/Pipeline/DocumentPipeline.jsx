import RenderDocument from "../Models/RenderDocument";

import CompanyResolver from "./CompanyResolver";
import CustomerResolver from "./CustomerResolver";
import ItemResolver from "./ItemsResolver";
import PaymentResolver from "./PaymentResolver";
import ApprovalResolver from "./ApprovalResolver";
import ThemeResolver from "./ThemeResolver";
import FeatureResolver from "./FeatureResolver";
import LayoutResolver from "./LayoutResolver";
import MetadataResolver from "./MetaDataResolver";
import FlagResolver from "./FlagResolver";
import TotalsResolver from "./TotalsResolver";
import SubscriptionResolver from "./SubscriptionResolver";

class DocumentPipeline {
    build({
        document = {},
        settings = {},
        config = {},
        payments = [],
        approvalHistory = []
    } = {}) {

        // const header = HeaderResolver.resolve(document);

        const company = CompanyResolver.resolve(settings) ?? {};

        const customer = CustomerResolver.resolve(document) ?? {};

        const items = ItemResolver.resolve(document) ?? [];

        const payment = PaymentResolver.resolve(
            document,
            payments,
            company
        ) ?? {};

        const theme = ThemeResolver.resolve(settings) ?? {};

        const features = FeatureResolver.resolve(config) ?? {};

        const subscription = SubscriptionResolver.resolve(
            settings,
            config
        ) ?? {};

        const layout = LayoutResolver.resolve(config) ?? {};

        const meta = MetadataResolver.resolve(
            document,
            settings,
            features
        ) ?? {};

        const flags = FlagResolver.resolve({
            meta,
            customer,
            payment,
            features,
            subscription
        }) ?? {};

        const totals = TotalsResolver.resolve(document) ?? {};

        const approvals = ApprovalResolver.resolve(
            approvalHistory,
            features
        ) ?? {};

        return new RenderDocument({
            meta,
            company,
            customer,
            items,
            payment,
            approvals,
            theme,
            layout,
            features,
            subscription,
            flags,
            totals
        });
    }
}

export default new DocumentPipeline();