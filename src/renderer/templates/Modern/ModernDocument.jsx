import { RenderContextProvider,  useDocument } from "../../RenderContext";
import ModernHeader from "./components/Header/ModernHeader";
import ModernAddresses from "./components/Addresses/ModernAddresses";
import ModernItemsTable from "./components/ItemsTable/ModernItemsTable";
import BottomSection from "./components/BottomSection/BottomSection";
import ModernFooter from "./components/Footer/ModernFooter";
import SignatureSection from "./components/SignatureSection/SignatureSection";
import SectionTypes from "../../Layout/SectionType";
import "./ModernPreview.css";
import "./ModernPrint.css";

export default function ModernDocument({

    page


}) {

    const renderDocument = useDocument();

    const pageDocument = {

        ...renderDocument,

        items: {

            ...renderDocument.items,

            rows: page.rows

        }

    };

    console.log(
        `Page ${page.pageNumber}`,
        page.sections.map(s => s.type)
    );

    return (

        <RenderContextProvider

            value={{

                renderDocument: pageDocument,

                template: renderDocument.theme,

                pages: [page]

                

            }}

        >

            <div className="modern-document">

                {page.sections.map(

                    (section, index) => {

                        switch (section.type) {

                            case SectionTypes.Header:

                                return (

                                    <ModernHeader

                                        key={index}

                                    />

                                );

                            case SectionTypes.Addresses:

                                return (

                                    <ModernAddresses

                                        key={index}

                                    />

                                );

                            case SectionTypes.Items:

                                return (

                                    <ModernItemsTable

                                        key={index}

                                    />

                                );

                            case SectionTypes.Bottom:

                                return (

                                    <BottomSection

                                        key={index}

                                    />

                                );

                            case SectionTypes.Signature:

                                return (

                                    <SignatureSection

                                        key={index}

                                    />

                                );

                            case SectionTypes.Footer:

                                return (

                                    <ModernFooter

                                        key={index}

                                    />

                                );

                            default:

                                return null;

                        }

                    }

                )}

               
            </div>

           
        </RenderContextProvider>

    );

}