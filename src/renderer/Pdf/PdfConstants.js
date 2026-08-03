
const PdfConstants = {

    page: {

        format: "a4",

        orientation: "portrait"

    },

    image: {

        type: "image/png",

        quality: 1,

        scale: window.devicePixelRatio > 3
            ? window.devicePixelRatio
            : 3

    },

    margin: 0

};

export default PdfConstants;