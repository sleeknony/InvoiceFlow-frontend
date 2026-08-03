import RendererMode from "../renderer/Core/RendererMode";

import PreviewTarget
    from "../renderer/Targets/PreviewTarget";

import PrintTarget
    from "../renderer/Targets/PrintTarget";

import PdfTarget
    from "../renderer/Targets/PdfTarget";

export default {

    [RendererMode.Preview]:

        PreviewTarget,

    [RendererMode.Print]:

        PrintTarget,

    [RendererMode.Pdf]:

        PdfTarget

};