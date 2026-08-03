class RowHeightEstimator {

    estimate(row, metrics) {

        const table = metrics.table;

        const baseHeight =
            table.rowBaseHeight;

        const charsPerLine =
            table.charactersPerLine;

        const lineHeight =
            table.lineHeight;

        const description =
            (row.description ?? "").trim();

        if (!description) {

            return baseHeight;

        }

        const explicitLines =
            description
                .split(/\r?\n/)
                .length;

        // Give the estimator a little more room before
        // assuming a wrap. This better matches the browser.
        const estimatedLines =
            Math.max(

                explicitLines,

                Math.ceil(

                    description.length /

                    (charsPerLine + 8)

                )

            );

        const extraLines =
            Math.max(

                0,

                estimatedLines - 1

            );

        // Use about 85% of a line height for each wrapped line.
        return Math.round(

            baseHeight +

            (extraLines * lineHeight * 0.85)

        );

    }

    estimateAll(rows = [], metrics) {

        return rows.map(row => ({

            ...row,

            estimatedHeight:

                this.estimate(

                    row,

                    metrics

                )

        }));

    }

    totalHeight(rows = [], metrics) {

        return this

            .estimateAll(rows, metrics)

            .reduce(

                (sum, row) =>

                    sum +

                    row.estimatedHeight,

                0

            );

    }

}

export default new RowHeightEstimator();