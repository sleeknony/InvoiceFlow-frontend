import { forwardRef } from "react";

import { RenderContextProvider }
    from "./RenderContext";

import TemplateRegistry
    from "./templates/TemplateRegistry";

import RenderEngine
    from "./RenderEngine";

import RendererMode
    from "./Core/RendererMode";

const DocumentRenderer = forwardRef(({

    renderDocument,

    mode = RendererMode.Preview

}, ref) => {

    if (!renderDocument) {

        return null;

    }

    const templateName =

        renderDocument.theme?.template ??

        "Modern";

    const renderContext =

        RenderEngine.render({

            renderDocument,

            template: templateName,

            mode

        });

    const Template =

        TemplateRegistry[templateName] ??

        TemplateRegistry.Modern;

    //return (

    //    <RenderContextProvider value={renderContext}>

    //        <div ref={ref}>

    //            <Template />

    //        </div>

    //    </RenderContextProvider>

    //);


    return (

        <RenderContextProvider value={renderContext}>

            <div
                ref={ref}
                className="document-render-root"
                data-renderer="InvoiceFlow"
                data-template={templateName}
            >
                <Template />
            </div>

        </RenderContextProvider>

    );

});

DocumentRenderer.displayName = "DocumentRenderer";

export default DocumentRenderer;