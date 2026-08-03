import ModernTemplate from "./Modern/ModernTemplate";
import ClassicTemplate from "./Classic/ClassicTemplate";
import CorporateTemplate from "./Corporate/CorporateTemplate";
import MinimalTemplate from "./Minimal/MinimalTemplate";

const TemplateRegistry = {

    Modern: ModernTemplate,

    Classic: ClassicTemplate,

    Corporate: CorporateTemplate,

    Minimal: MinimalTemplate

};

export const getTemplate = (name = "Modern") => {

    const templateName =
        String(name);

    return (

        TemplateRegistry[templateName] ??

        TemplateRegistry.Modern

    );

};

export default TemplateRegistry;