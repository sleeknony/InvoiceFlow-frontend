import useRenderContext from "./useRenderContext";

export default function Watermark() {

    const { document } =
        useRenderContext();

    if (!document)
        return null;

    const status = document.status;

    if (
        status === "Approved" ||
        status === "Sent"
    )
        return null;

    return (

        <div className="document-watermark">

            {status.toUpperCase()}

        </div>

    );
}