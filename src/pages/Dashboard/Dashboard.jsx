import { useEffect, useState } from "react";

import DashboardCard from "./components/DashboardCard";
import RevenueChart from "./components/RevenueChart";
import { getDashboardSummary } from "../../services/dashboardService";
import { FaMoneyBillWave, FaWallet, FaExclamationTriangle, FaUsers } from "react-icons/fa";
import RecentDocuments   from "./components/RecentDocuments";
import { toast } from "react-hot-toast";

export default function Dashboard() {

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {
        try {

            const data =
                await getDashboardSummary();

            setSummary(data);

        }
        catch (err) {

            toast.error("Failed to load dashboard");

            setSummary({
                totalRevenue: 0,
                outstandingAmount: 0,
                overdueAmount: 0,
                customers: 0,
                revenueTrend: [],
                recentDocuments: []
            });

        }
        finally {

            setLoading(false);

        }
    }

    if (loading)
        return <div>Loading...</div>;

    return (

        <div className="container-fluid">
            <div className="mb-4">

                <h2 className="fw-bold mb-1">
                    Dashboard
                </h2>

                <p className="text-muted mb-0">
                    Overview of your business performance.
                </p>

            </div>
            <div className="row g-3">

                <div className="col-md-3">

                    <DashboardCard
                        title="Revenue"
                        value={`₦${Number(
                            summary?.totalRevenue ?? 0
                        ).toLocaleString()}`}
                        subtitle="Paid invoices"
                        icon={FaMoneyBillWave}
                        color="success"
                    />

                </div>
                <div className="col-md-3">
                <DashboardCard
                    title="Outstanding"
                    value={`₦${Number(
                        summary?.outstandingAmount ?? 0
                    ).toLocaleString()}`}
                    subtitle="Awaiting payment"
                    icon={FaWallet}
                    color="warning"
                />

                </div>

                <div className="col-md-3">
                <DashboardCard
                    title="Overdue"
                    value={`₦${Number(
                        summary?.overdueAmount ?? 0
                    ).toLocaleString()}`}
                    subtitle="Past due date"
                    icon={FaExclamationTriangle}
                    color="danger"
                />
                </div>

                <div className="col-md-3">

                <DashboardCard
                    title="Customers"
                    value={summary?.customers ?? 0}
                    subtitle="Active customers"
                    icon={FaUsers}
                    color="primary"
                />

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-12">

                    <RevenueChart
                        data={
                            summary?.revenueTrend ?? []
                        }
                    />

                </div>

            </div>

            <RecentDocuments
                documents={
                    summary?.recentDocuments ?? []
                }
            />

        </div>
    );
}