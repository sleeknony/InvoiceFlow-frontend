import SectionTypes from "./SectionType";

import DocumentHeader
    from "../../shared/DocumentHeader/DocumentHeader";

import DocumentAddresses
    from "../../shared/DocumentAddresses/DocumentAddresses";

import ItemsTable
    from "../../shared/ItemsTable/ItemsTable";

import PaymentSection
    from "../../shared/PaymentSection/PaymentSection";

import TotalsSection
    from "../../shared/TotalsSection/TotalsSection";

import SignatureSection
    from "../../shared/SignatureSection/SignatureSection";

import DocumentFooter
    from "../../shared/DocumentFooter/DocumentFooter";

import BottomSection
    from "../../shared/BottomSection/BottomSection";



export default {

    [SectionTypes.Header]:
        DocumentHeader,

    [SectionTypes.Addresses]:
        DocumentAddresses,

    [SectionTypes.Items]:
        ItemsTable,

    [SectionTypes.Bottom]:
        BottomSection,

    [SectionTypes.Signature]:
        SignatureSection,

    [SectionTypes.Footer]:
        DocumentFooter

};