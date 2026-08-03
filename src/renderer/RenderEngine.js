import RendererRegistry
    from "./RendererRegistry";

import RenderPipeline
    from "../DocumentEngine/Pipeline/RenderPipeline";

class RenderEngine {

    render({

        renderDocument,

        template,

        mode

    }) {

        const context =

            RenderPipeline.build({

                renderDocument,

                template

            });

        const renderer =

            RendererRegistry[mode];

        if (!renderer) {

            throw new Error(

                `Renderer '${mode}' is not registered.`

            );

        }

        return renderer.render(

            context

        );

    }

}

export default new RenderEngine();