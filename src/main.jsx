import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Residence from "./pages/Residence.jsx";
import Reservation from "./pages/Reservation.jsx";
import NewsLetter from "./pages/NewsLetter.jsx";
import Profil from "./pages/Profil.jsx";
import { ConfigProvider } from "antd";
import { library } from "@fortawesome/fontawesome-svg-core";

// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Otp from "./pages/Otp.jsx";
library.add(fab, fas, far);
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "reservation",
                element: <Reservation />,
            },
            {
                path: "residence",
                element: <Residence />,
            },
            {
                path: "newsletter",
                element: <NewsLetter />,
            },
            {
                path: "profil",
                element: <Profil />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        path: "/new-password",
        element: <ChangePassword />,
    },
    {
        path: "/otp",
        element: <Otp />,
    },
]);
const theme = {
    token: {
        colorPrimary: "#A273FF",
        dotActiveWidth: "100% !important",
        dotWidth: "100% !important",
    },
};
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ConfigProvider theme={theme}>
            <RouterProvider router={router} />
        </ConfigProvider>
    </React.StrictMode>
);
