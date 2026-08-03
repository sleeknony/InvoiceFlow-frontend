import RenderTarget
    from "./RenderTarget";

class PrintTarget extends RenderTarget {

    render(context) {

        return context;

    }

}

export default new PrintTarget();