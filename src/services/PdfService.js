//import api from "./api";
import http from "../api/http";

export async function downloadPdf(fileName = "Document.pdf") {

    const root = document.getElementById("invoice-root");

    if (!root) {

        throw new Error("invoice-root not found");

    }

    const response = await http.post(
        "/pdf",
        {
            html: root.outerHTML,
            fileName
        },
        {
            responseType: "blob"
        });

    const blob = new Blob(
        [response.data],
        {
            type: "application/pdf"
        });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = fileName;

    a.click();

    window.URL.revokeObjectURL(url);
}