import {
    FiUsers,
    FiShield,
    FiClock,
    FiUserX
} from "react-icons/fi";

import TeamStatCard from "./TeamStatsCard";

import "./TeamStats.css";

export default function TeamStats({
    members = [],
    invitations = []
}) {

    const totalMembers =
        members.length;

    const admins =
        members.filter(x =>
            x.roleName === "Owner" ||
            x.roleName === "Admin")
            .length;

    const inactive =
        members.filter(x =>
            !x.isActive)
            .length;

    const pending =
        invitations.length;

    return (

        <div className="team-stats-grid">

            <TeamStatCard
                title="Members"
                value={totalMembers}
                icon={<FiUsers />}
                color="primary"
            />

            <TeamStatCard
                title="Admins"
                value={admins}
                icon={<FiShield />}
                color="success"
            />

            <TeamStatCard
                title="Pending"
                value={pending}
                icon={<FiClock />}
                color="warning"
            />

            <TeamStatCard
                title="Inactive"
                value={inactive}
                icon={<FiUserX />}
                color="danger"
            />

        </div>

    );

}