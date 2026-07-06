import { TEMPLATE_REGISTRY } from "./templateRegistry";

export function getTemplate(name) {

    return TEMPLATE_REGISTRY[name]?.component
        || TEMPLATE_REGISTRY.Modern.component;

}