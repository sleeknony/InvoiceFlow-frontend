//import html2canvas from "html2canvas";
//import { jsPDF } from "jspdf";

//import PdfUtils from "./PdfUtils";
//import PdfConstants from "./PdfConstants";
//import PdfFileNameBuilder from "./PdfFileNameBuilder";

//class PdfExporter {

//    async export({

//        element,

//        document

//    }) {

//        if (!element) {

//            throw new Error(
//                "PDF element not supplied."
//            );

//        }

//        await PdfUtils.waitForRender(element);

//        const pages = Array.from(

//            element.querySelectorAll(

//                ".print-page"

//            )

//        );

//        if (!pages.length) {

//            throw new Error(
//                "No printable pages found."
//            );

//        }

//        const pdf = new jsPDF({

//            orientation:
//                PdfConstants.page.orientation,

//            unit: "mm",

//            format:
//                PdfConstants.page.format,

//            compress: false

//        });

//        const pdfWidth =
//            pdf.internal.pageSize.getWidth();

//        const pdfHeight =
//            pdf.internal.pageSize.getHeight();

//        for (let i = 0; i < pages.length; i++) {

//            if (i > 0) {

//                pdf.addPage();

//            }

//            const page = pages[i];

//            await PdfUtils.waitForRender(page);

//            const canvas = await html2canvas(page, {

//                scale:
//                    PdfConstants.image.scale,

//                useCORS: true,

//                allowTaint: false,

//                backgroundColor: "#ffffff",

//                logging: false,

//                imageTimeout: 0,

//                removeContainer: true,

//                scrollX: 0,

//                scrollY: 0,

//                windowWidth:
//                    page.scrollWidth,

//                windowHeight:
//                    page.scrollHeight

//            });

//            const image =
//                canvas.toDataURL("image/png");

//            pdf.addImage(

//                image,

//                "PNG",

//                0,

//                0,

//                pdfWidth,

//                pdfHeight,

//                undefined,

//                "NONE"

//            );

//        }

//        pdf.save(

//            PdfFileNameBuilder.build(

//                document

//            )

//        );

//    }

//}

//export default new PdfExporter();

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PdfUtils from "./PdfUtils";
import PdfConstants from "./PdfConstants";
import PdfFileNameBuilder from "./PdfFileNameBuilder";
class PdfExporter {
    async export({ element, document })
    {
        if (!element)
        { throw new Error("PDF element not supplied."); }
        await PdfUtils.waitForRender(element);
        const pages = Array.from(element.querySelectorAll(".print-page"));
        if (!pages.length)
        { throw new Error("No printable pages found."); }
        const pdf = new jsPDF({
            orientation: PdfConstants.page.orientation, unit: "mm",
            format: PdfConstants.page.format, compress: false
        }); const pdfWidth = pdf.internal.pageSize.getWidth();
        for (let i = 0; i < pages.length; i++)
        {
            const page = pages[i]; await PdfUtils.waitForRender(page);

            const rect = page.getBoundingClientRect();

            console.log("========== PAGE ==========");
            console.log({
                width: rect.width,
                height: rect.height,
                scrollHeight: page.scrollHeight,
                clientHeight: page.clientHeight,
                offsetHeight: page.offsetHeight
            });


            const canvas = await html2canvas(page,
                {
                    scale: PdfConstants.image.scale,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: false,
                    imageTimeout: 0,
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: "high"
                });
            console.log("========== CANVAS ==========");
            console.log({
                width: canvas.width,
                height: canvas.height
            });

            const image = canvas.toDataURL("image/png");
            if (i > 0) { pdf.addPage(); }
            const imageWidth = pdfWidth;
            const imageHeight = (canvas.height * imageWidth) / canvas.width; const x = (pdfWidth - imageWidth) / 2;

            console.log("========== PDF ==========");
            console.log({
                pdfWidth,
                pdfHeight
            });

            pdf.addImage(image, "PNG", x, 0, imageWidth, imageHeight, undefined, "NONE");
        } pdf.save(PdfFileNameBuilder.build(document));
    }
} export default new PdfExporter();