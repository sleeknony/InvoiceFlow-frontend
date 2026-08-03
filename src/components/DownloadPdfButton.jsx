import PdfExporter
    from "../renderer/Pdf/PdfExporter";

export default function DownloadPdfButton({

    documentRef,

    renderDocument

}) {

    async function handleDownload() {

        try {

            await PdfExporter.export({

                element:
                    documentRef.current,

                document:
                    renderDocument

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <button

            className="btn btn-danger"

            onClick={handleDownload}

        >

            Download PDF

        </button>

    );

}