import { Children } from "react";
import { FiDownload, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";

export default function ReportToolbar({
    search,
    onSearchChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onRefresh,
    onReset,
    onExport,
    exporting = false,
    children,
}) {
    const hasExtraFilters = Children.toArray(children).length > 0;

    const actionButtons = (
        <>
            {onReset && (
                <button
                    type="button"
                    className="report-tool-btn"
                    onClick={onReset}
                >
                    <FiX />
                    Clear
                </button>
            )}

            {onRefresh && (
                <button
                    type="button"
                    className="report-tool-btn"
                    onClick={onRefresh}
                >
                    <FiRefreshCw />
                    Refresh
                </button>
            )}

            {onExport && (
                <button
                    type="button"
                    className="report-export-btn"
                    onClick={onExport}
                    disabled={exporting}
                >
                    <FiDownload />
                    {exporting ? "Exporting..." : "Export Excel"}
                </button>
            )}
        </>
    );

    return (
        <div
            className={`report-toolbar ${hasExtraFilters
                    ? "has-extra-filters"
                    : "no-extra-filters"
                }`}
        >
            <div className="report-toolbar-main">

                {/* Search always occupies the full top row */}
                <div className="report-search">
                    <FiSearch />

                    <input
                        type="text"
                        value={search || ""}
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        placeholder="Search..."
                    />

                    {search && (
                        <button
                            type="button"
                            className="report-search-clear"
                            onClick={() => onSearchChange("")}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <FiX />
                        </button>
                    )}
                </div>

                {/* Filters / action buttons */}
                <div className="report-toolbar-filter-row">

                    <div className="report-date-filter">
                        <label>From</label>

                        <input
                            type="date"
                            value={fromDate || ""}
                            onChange={(e) =>
                                onFromDateChange(e.target.value)
                            }
                        />
                    </div>

                    <div className="report-date-filter">
                        <label>To</label>

                        <input
                            type="date"
                            value={toDate || ""}
                            onChange={(e) =>
                                onToDateChange(e.target.value)
                            }
                        />
                    </div>

                    {/* Customer / Status / other report-specific filters */}
                    {hasExtraFilters && children}

                    {/* If there are no extra filters, actions occupy their space */}
                    {!hasExtraFilters && (
                        <div className="report-toolbar-actions report-toolbar-actions-inline">
                            {actionButtons}
                        </div>
                    )}
                </div>

                {/* If extra filters exist, actions return to their normal row */}
                {hasExtraFilters && (
                    <div className="report-toolbar-actions">
                        {actionButtons}
                    </div>
                )}

            </div>
        </div>
    );
}