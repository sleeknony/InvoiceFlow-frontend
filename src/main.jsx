//import React from "react";
//import ReactDOM from "react-dom/client";
//import { BrowserRouter } from "react-router-dom";
//import App from "./App.jsx";
//import "./styles.css";
//import "./renderer/styles/print.css";
//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min.js";
//import { AuthProvider } from "./context/AuthContext";
//import { Toaster } from "react-hot-toast";
//import { SubscriptionProvider } from "./context/SubscriptionContext";

//ReactDOM.createRoot(document.getElementById("root")).render(
//    //<React.StrictMode>
//    //    <BrowserRouter>
//    //        <App />
//    //    </BrowserRouter>
//    //</React.StrictMode>

//    <React.StrictMode>
//        <BrowserRouter>
//            <AuthProvider>

//                <SubscriptionProvider>
//                    <App />
//                    <Toaster position="top-right" />
//                </SubscriptionProvider>

//            </AuthProvider>
//        </BrowserRouter>
//    </React.StrictMode>
//);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./styles.css";
import "./renderer/styles/print.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <BrowserRouter>

            <AuthProvider>

                <App />

                <Toaster
                    position="top-right"
                />

            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>
);
