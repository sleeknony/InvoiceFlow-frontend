export function exportDocumentHtml(rootElement) {

    if (!rootElement) {
        throw new Error("Document root element not found.");
    }

    // Clone the rendered document so we don't modify the live DOM.
    const clone = rootElement.cloneNode(true);

    // Collect all CSS currently loaded by the page.
    let styles = "";

    for (const sheet of Array.from(document.styleSheets)) {

        try {

            const rules = sheet.cssRules;

            if (!rules) {
                continue;
            }

            for (const rule of Array.from(rules)) {
                styles += rule.cssText + "\n";
            }

        }
        catch {
            // Ignore stylesheets that cannot be read
            // (for example, cross-origin stylesheets).
        }
    }

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
${styles}
</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;
}