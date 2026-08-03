import {
    FiSearch,
    FiFilter,
    FiRefreshCw
} from "react-icons/fi";

export default function CustomerToolbar({

    search,

    setSearch,

    status,

    setStatus,

    onRefresh

}) {

    return (

        <div className="card border-0 shadow-sm rounded-4 mb-4">

            <div className="card-body">

                <div className="row g-3 align-items-center">

                    {/* Search */}

                    <div className="col-lg-5">

                        <div className="input-group">

                            <span className="input-group-text bg-white border-end-0">

                                <FiSearch />

                            </span>

                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Search company, contact, email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    {/* Status */}

                    <div className="col-lg-2">

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }>

                            <option value="All">
                                All Customers
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                    {/* Placeholder */}

                    <div className="col-lg-3">

                        <button
                            className="btn btn-light border w-100">

                            <FiFilter className="me-2" />

                            More Filters

                        </button>

                    </div>

                    {/* Refresh */}

                    <div className="col-lg-2">

                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={onRefresh}>

                            <FiRefreshCw className="me-2" />

                            Refresh

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}