import { DOCUMENT_TYPES } from "./constants";

export function getDocumentType(type) {

    return DOCUMENT_TYPES.find(x => x.value === type);

}

export function getDocumentLabel(type) {

    return getDocumentType(type)?.label || type;

}

export function getDocumentPrefix(type) {

    return getDocumentType(type)?.prefix || "";

}