import { TemplateRegistry } from "./templateRegistry";

export  function getTemplate(name) {

    return (
        TemplateRegistry[name]?.component ??
        TemplateRegistry.Modern.component
    );

}