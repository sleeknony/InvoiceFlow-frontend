import RenderTarget
    from "./RenderTarget";

class PdfTarget extends RenderTarget {

    render(context) {

        return context;

    }

}

export default new PdfTarget();