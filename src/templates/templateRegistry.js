
import ModernTemplate from "./Modern/ModernTemplate";
import ClassicTemplate from "./Classic/ClassicTemplate";
import CorporateTemplate from "./Corporate/CorporateTemplate";
import MinimalTemplate from "./Minimal/MinimalTemplate";

//import modernPreview from "../assets/templates/modern.png";
//import classicPreview from "../assets/templates/classic.png";
//import corporatePreview from "../assets/templates/corporate.png";
//import minimalPreview from "../assets/templates/minimal.png";

export const TEMPLATE_REGISTRY = {
    Modern: {
        code: "Modern",
        name: "Modern",
        description: "Clean modern invoice layout",
        preview:null /*modernPreview*/,
        component: ModernTemplate,
        premium: false,
        supportsMultipage: true,
        category: "Business"
    },

    Classic: {
        code: "Classic",
        name: "Classic",
        description: "Traditional invoice design",
        preview: null /*classicPreview*/,
        component: ClassicTemplate,
        premium: false,
        supportsMultipage: true,
        category: "Business"
    },

    Corporate: {
        code: "Corporate",
        name: "Corporate",
        description: "Professional premium template",
        preview: null /*corporatePreview*/,
        component: CorporateTemplate,
        premium: true,
        supportsMultipage: true,
        category: "Premium"
    },

    Minimal: {
        code: "Minimal",
        name: "Minimal",
        description: "Simple minimalist layout",
        preview: null /*minimalPreview*/,
        component: MinimalTemplate,
        premium: false,
        supportsMultipage: true,
        category: "Business"
    }
};

