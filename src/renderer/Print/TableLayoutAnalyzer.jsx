class TableLayoutAnalyzer {

    analyze(section) {

        const table =
            section.querySelector("table");

        if (!table)
            return null;

        const header =
            table.tHead;

        const footer =
            table.tFoot;

        const body =
            table.tBodies[0];

        const headerHeight =
            header
                ? header.getBoundingClientRect().height
                : 0;

        const footerHeight =
            footer
                ? footer.getBoundingClientRect().height
                : 0;

        const bodyHeight =
            body
                ? body.getBoundingClientRect().height
                : 0;

        return {

            table,

            headerHeight,

            footerHeight,

            bodyHeight,

            totalHeight:
                headerHeight +
                bodyHeight +
                footerHeight

        };

    }

}

export default new TableLayoutAnalyzer();