import PageModel from "./PageModel";

class PageBuilder {

    create({

        pageNumber,

        metrics,

        reservedHeight

    }) {

        return new PageModel({

            pageNumber,

            pageHeight:
                metrics.page?.height ?? 0,

            reservedHeight

        });

    }

    next(currentPage, pages, metrics, reservedHeight) {

        if (

            !currentPage.isEmpty() &&

            pages[pages.length - 1] !== currentPage

        ) {

            pages.push(currentPage);

        }

        return this.create({

            pageNumber:
                pages.length + 1,

            metrics,

            reservedHeight

        });

    }

    finalize(currentPage, pages) {

        if (

            !currentPage.isEmpty() &&

            pages[pages.length - 1] !== currentPage

        ) {

            pages.push(currentPage);

        }

        if (pages.length) {

            pages[0].markFirst();

            pages[pages.length - 1].markLast();

        }

        return pages;

    }

}

export default new PageBuilder();