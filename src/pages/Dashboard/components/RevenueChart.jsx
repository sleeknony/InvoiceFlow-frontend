import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
}
    from "recharts";

export default function RevenueChart({
    data
}) {
    return (
        <div className="card border-0 shadow-sm">

            <div className="card-body">

                <h5 className="fw-bold mb-4">
                    Revenue Trend
                </h5>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <AreaChart data={data}>

                        <defs>

                            <linearGradient
                                id="revenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#0d6efd"
                                    stopOpacity={0.4}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#0d6efd"
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                        />

                        <YAxis />

                        <Tooltip
                            formatter={(v) =>
                                `₦${Number(v)
                                    .toLocaleString()}`
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0d6efd"
                            fill="url(#revenue)"
                            strokeWidth={3}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}