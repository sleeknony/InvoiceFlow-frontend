import PaginationEngine from "../../Print/PaginationEngine";
import ModernDocument from "./ModernDocument";
import { useDocument } from "../../RenderContext";

export default function ModernTemplate() {

    const renderDocument = useDocument();

    const result = PaginationEngine.paginate({

        document: renderDocument,

        template:
            renderDocument.theme?.template ??
            "Modern"

    });

    return (

        <div className="modern-preview">

            {result.pages.map(page => (

                <div
                    key={page.pageNumber}
                    className="modern-page-wrapper"
                >

                    <ModernDocument
                       
                        page={page}
                        pageCount={result.pageCount}
                    />

                </div>

            ))}

        </div>

    );

}