//VITE_API_BASE_URL=http://localhost:5047/api

//VITE_TAWK_PROPERTY_ID=6aca4b1de3863234c557c2c3
//VITE_TAWK_WIDGET_ID=1k4j3arqu

import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5047/api",
    timeout: 60000,
});

// Request interceptor
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
http.interceptors.response.use(
    (response) => response,
    (error) => {
        //if (
        //    error.response &&
        //    error.response.status === 401 &&
        //    window.location.pathname !== "/login"
        //) {
        //    localStorage.removeItem("token");
        //    window.location.href = "/login";
        //}

        if (
            error.response &&
            error.response.status === 401 &&
            window.location.pathname !== "/login"
        ) {
            // Remember where the user was
            localStorage.setItem(
                "redirectAfterLogin",
                window.location.pathname + window.location.search
            );

            // Clear auth
            localStorage.removeItem("token");

            // Redirect to login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default http;