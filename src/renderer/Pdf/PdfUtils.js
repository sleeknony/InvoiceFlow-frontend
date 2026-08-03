class PdfUtils {

    async wait(milliseconds = 50) {

        return new Promise(

            resolve =>

                setTimeout(

                    resolve,

                    milliseconds

                )

        );

    }

    async waitForImages(element) {

        const images =

            Array.from(

                element.querySelectorAll("img")

            );

        await Promise.all(

            images.map(image => {

                if (image.complete)

                    return Promise.resolve();

                return new Promise(resolve => {

                    image.onload = resolve;

                    image.onerror = resolve;

                });

            })

        );

    }

    async waitForFonts() {

        if (document.fonts) {

            await document.fonts.ready;

        }

    }

    async waitForRender(element) {

        await this.wait();

        await this.waitForFonts();

        await this.waitForImages(element);

    }

}

export default new PdfUtils();