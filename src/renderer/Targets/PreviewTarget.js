import RenderTarget
    from "./RenderTarget";

class PreviewTarget extends RenderTarget {

    render(context) {

        return context;

    }

}

export default new PreviewTarget();