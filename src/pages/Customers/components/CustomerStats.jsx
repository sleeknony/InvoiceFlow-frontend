import {
    FiUsers,
    FiMapPin,
    FiCheckCircle,
    FiTrendingUp
} from "react-icons/fi";

export default function CustomerStats({

    customers

}) {

    const total =
        customers.length;

    const active =
        customers.length;

    const countries =
        new Set(
            customers.map(x => x.country)
        ).size;

    return (

        <div className="row g-4 mb-4">

            <StatCard
                title="Customers"
                value={total}
                icon={<FiUsers />}
            />

            <StatCard
                title="Active"
                value={active}
                icon={<FiCheckCircle />}
            />

            <StatCard
                title="Countries"
                value={countries}
                icon={<FiMapPin />}
            />

            <StatCard
                title="New This Month"
                value="--"
                icon={<FiTrendingUp />}
            />

        </div>

    );

}

function StatCard({

    title,

    value,

    icon

}) {

    return (

        <div className="col-lg-3 col-md-6">

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between">

                        <div>

                            <div className="text-muted small">

                                {title}

                            </div>

                            <h3 className="fw-bold mt-2">

                                {value}

                            </h3>

                        </div>

                        <div
                            className="fs-3 text-primary">

                            {icon}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}