import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RendererHost from "../RendererHost";

/**
 * Renders a RenderDocument to a complete HTML document.
 *
 * @param {Object} props
 * @returns {string}
 */
export function renderDocumentToHtml(props) {
    const markup = renderToStaticMarkup(
        <RendererHost {...props} />
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${props.document?.documentNumber ?? "Document"}</title>
</head>
<body>
${markup}
</body>
</html>`;
}