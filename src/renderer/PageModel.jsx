class PageModel {

    constructor({

        pageNumber = 1,

        pageHeight = 1122,

        reservedHeight = 0

    } = {}) {

        this.pageNumber = pageNumber;

        this.pageHeight = pageHeight;

        this.reservedHeight = reservedHeight;

        this.usedHeight = 0;

        this.availableHeight =
            pageHeight - reservedHeight;

        this.rows = [];

        this.sections = [];

        this.firstPage = false;

        this.lastPage = false;

    }

    addSection(section) {

        this.sections.push(section);

    }

    addSections(sections = []) {

        this.sections.push(

            ...sections

        );

    }

    addRow(row) {

        this.rows.push(row);

        this.usedHeight +=
            row.estimatedHeight ?? 0;

    }

    canFit(row) {

        return (

            this.usedHeight +

            (row.estimatedHeight ?? 0)

        ) <= this.availableHeight;

    }

    remainingHeight() {

        return Math.max(

            0,

            this.availableHeight -

            this.usedHeight

        );

    }

    markFirst() {

        this.firstPage = true;

        return this;

    }

    markLast() {

        this.lastPage = true;

        return this;

    }

    clearMarks() {

        this.firstPage = false;

        this.lastPage = false;

        return this;

    }

    isEmpty() {

        return (

            this.rows.length === 0 &&

            this.sections.length === 0

        );

    }

    toJSON() {

        return {

            pageNumber:
                this.pageNumber,

            firstPage:
                this.firstPage,

            lastPage:
                this.lastPage,

            rows:
                this.rows,

            sections:
                [...this.sections],

            usedHeight:
                this.usedHeight,

            availableHeight:
                this.availableHeight,

            remainingHeight:
                this.remainingHeight()

        };

    }

}

export default PageModel;