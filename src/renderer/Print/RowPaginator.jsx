class RowPaginator {

    paginate(section, availableHeight) {

        if (!section.rows?.length) {

            return {

                currentPage: [],

                nextPage: []

            };

        }

        const currentPage = [];

        const nextPage = [];

        let usedHeight =

            section.table?.headerHeight ?? 0;

        section.rows.forEach(row => {

            if (

                usedHeight + row.height <= availableHeight

            ) {

                currentPage.push(row);

                usedHeight += row.height;

            }

            else {

                nextPage.push(row);

            }

        });

        return {

            currentPage,

            nextPage,

            usedHeight,

            remainingHeight:

                Math.max(

                    0,

                    availableHeight - usedHeight

                )

        };

    }

}

export default new RowPaginator();