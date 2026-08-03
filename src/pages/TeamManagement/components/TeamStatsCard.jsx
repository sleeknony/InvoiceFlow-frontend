import "./TeamStats.css";

export default function TeamStatCard({
    title,
    value,
    icon,
    color = "primary"
}) {

    return (

        <div className={`team-stat-card ${color}`}>

            <div className="team-stat-icon">

                {icon}

            </div>

            <div className="team-stat-content">

                <span className="team-stat-title">

                    {title}

                </span>

                <h2 className="team-stat-value">

                    {value}

                </h2>

            </div>

        </div>

    );

}