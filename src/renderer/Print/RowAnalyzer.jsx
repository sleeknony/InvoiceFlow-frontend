class RowAnalyzer {

    analyze(section) {

        if (!section)
            return [];

        const table =
            section.querySelector("table");

        if (!table)
            return [];

        const body =
            table.tBodies[0];

        if (!body)
            return [];

        return Array.from(body.rows).map((row, index) => {

            const rect =
                row.getBoundingClientRect();

            return {

                index,

                element: row,

                height: rect.height,

                cells: row.cells.length

            };

        });

    }

}

export default new RowAnalyzer();