import { useEffect, useState } from "react";

export default function usePagination(

    rows = []

) {

    const [

        pages,

        setPages

    ] = useState([]);

    useEffect(() => {

        if (!rows.length) {

            setPages([]);

            return;

        }

        // Temporary.
        // Next step:
        // replace with PaginationEngine.

        setPages([

            {

                pageNumber: 1,

                firstPage: true,

                lastPage: rows.length <= 15,

                rows: rows.slice(0, 15)

            },

            ...(rows.length > 15

                ? [

                    {

                        pageNumber: 2,

                        firstPage: false,

                        lastPage: true,

                        rows: rows.slice(15)

                    }

                ]

                : [])

        ]);

    }, [rows]);

    return pages;

}