import {
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

export default function ReportPagination({
    page,
    pageSize,
    totalCount,
    totalPages,
    onPageChange,
    onPageSizeChange,
}) {
    if (!totalCount) {
        return null;
    }

    const start =
        (page - 1) * pageSize + 1;

    const end =
        Math.min(
            page * pageSize,
            totalCount
        );

    const pages = [];

    const startPage =
        Math.max(1, page - 2);

    const endPage =
        Math.min(
            totalPages,
            page + 2
        );

    for (
        let current = startPage;
        current <= endPage;
        current++
    ) {
        pages.push(current);
    }

    return (
        <div className="report-pagination">

            <div className="report-pagination-info">
                Showing{" "}
                <strong>
                    {start}
                </strong>
                -
                <strong>
                    {end}
                </strong>{" "}
                of{" "}
                <strong>
                    {totalCount}
                </strong>
            </div>

            <div className="report-pagination-controls">

                <select
                    value={pageSize}
                    onChange={(e) =>
                        onPageSizeChange(
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={10}>
                        10 / page
                    </option>

                    <option value={25}>
                        25 / page
                    </option>

                    <option value={50}>
                        50 / page
                    </option>

                    <option value={100}>
                        100 / page
                    </option>
                </select>

                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                        onPageChange(
                            page - 1
                        )
                    }
                >
                    <FiChevronLeft />
                </button>

                {pages.map(
                    (pageNumber) => (
                        <button
                            key={pageNumber}
                            type="button"
                            className={
                                pageNumber === page
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                onPageChange(
                                    pageNumber
                                )
                            }
                        >
                            {pageNumber}
                        </button>
                    )
                )}

                <button
                    type="button"
                    disabled={
                        page >= totalPages
                    }
                    onClick={() =>
                        onPageChange(
                            page + 1
                        )
                    }
                >
                    <FiChevronRight />
                </button>

            </div>

        </div>
    );
}