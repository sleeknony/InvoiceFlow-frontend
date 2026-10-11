import { useCallback, useState } from "react";

const DEFAULT_QUERY = {
    page: 1,
    pageSize: 25,
    search: "",
    sortBy: "",
    sortDirection: "desc",
    fromDate: "",
    toDate: "",
};

export default function useReportQuery(
    initialValues = {}
) {
    const buildInitialQuery = useCallback(
        () => ({
            ...DEFAULT_QUERY,
            ...initialValues,
        }),
        [initialValues]
    );

    const [query, setQuery] = useState(
        buildInitialQuery
    );

    const updateQuery = useCallback(
        (name, value) => {
            setQuery((current) => ({
                ...current,
                [name]: value,
                ...(name !== "page"
                    ? { page: 1 }
                    : {}),
            }));
        },
        []
    );

    const updateQueries = useCallback(
        (values) => {
            setQuery((current) => ({
                ...current,
                ...values,
                page: 1,
            }));
        },
        []
    );

    const setPage = useCallback(
        (page) => {
            setQuery((current) => ({
                ...current,
                page,
            }));
        },
        []
    );

    const setPageSize = useCallback(
        (pageSize) => {
            setQuery((current) => ({
                ...current,
                pageSize,
                page: 1,
            }));
        },
        []
    );

    const setSorting = useCallback(
        (sortBy) => {
            setQuery((current) => ({
                ...current,
                sortBy,
                sortDirection:
                    current.sortBy === sortBy &&
                        current.sortDirection === "asc"
                        ? "desc"
                        : "asc",
                page: 1,
            }));
        },
        []
    );

    const reset = useCallback(() => {
        setQuery(buildInitialQuery());
    }, [buildInitialQuery]);

    return {
        query,
        updateQuery,
        updateQueries,
        setPage,
        setPageSize,
        setSorting,
        reset,
    };
}