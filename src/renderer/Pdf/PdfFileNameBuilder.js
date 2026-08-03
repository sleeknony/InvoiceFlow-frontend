class PdfFileNameBuilder {

    build(document) {

        return (

            document.meta.fileName +

            ".pdf"

        );

    }

}

export default new PdfFileNameBuilder();