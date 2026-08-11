// src/services/dashboardService.js

import http from "../api/http";

export const getDashboardSummary = async () => {

    const res =
        await http.get(
            "/dashboard/summary"
        );

    return res.data;
};