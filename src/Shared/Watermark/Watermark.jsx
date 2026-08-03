import "./Watermark.css";

import { useDocument } from "../../renderer/RenderContext";

export default function Watermark() {

    const { watermark } = useDocument();

    if (!watermark) return null;

    return (

        <div className="document-watermark">

            {watermark}

        </div>

    );

}