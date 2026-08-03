import PaginationEngine
    from "../../renderer/Print/PaginationEngine";

import RenderContextBuilder
    from "../../renderer/Core/RenderContextBuilder";

class RenderPipeline {

    build({

        renderDocument,

        template

    }) {

        let pages = [];

        // Modern renderer uses continuous HTML.
        // Browser printing performs pagination.
        if (template !== "Modern") {

            const result =

                PaginationEngine.paginate({

                    document: renderDocument,

                    template

                });

            pages = result.pages ?? [];

        }

        return RenderContextBuilder.build({

            renderDocument,

            pages,

            template

        });

    }

}

export default new RenderPipeline();