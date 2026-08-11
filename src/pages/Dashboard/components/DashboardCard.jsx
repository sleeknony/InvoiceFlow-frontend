import "./DashboardCard.css";

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    subtitle,
    color = "primary"
}) {
    return (
        <div className={`dashboard-card ${color}`}>

            <div className="dashboard-card-header">

                <span className="dashboard-card-title">
                    {title}
                </span>

                <Icon
                    size={26}
                    className="dashboard-card-icon"
                />

            </div>

            <div className="dashboard-card-value">
                {value}
            </div>

            {subtitle && (
                <div className="dashboard-card-subtitle">
                    {subtitle}
                </div>
            )}

        </div>
    );
}