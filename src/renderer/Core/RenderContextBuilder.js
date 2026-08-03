class RenderContextBuilder {

    build({

        renderDocument,

        pages = [],

        template

    }) {

        return {

            renderDocument,

            pages,

            template

        };

    }

}

export default new RenderContextBuilder();