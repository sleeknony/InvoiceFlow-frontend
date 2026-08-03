import { DOCUMENT_CONFIG } from "./documentConfig";

export const getDocumentConfig = (type) =>
    DOCUMENT_CONFIG[type] ??
    DOCUMENT_CONFIG.Invoice;