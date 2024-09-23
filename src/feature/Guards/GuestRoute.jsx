// GuestRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

const GuestRoute = ({ element }) => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isLog");
    const logUser = JSON.parse(localStorage.getItem("user"));
    const isFirstLogin = localStorage.getItem("firstLogin")
    if (isAuthenticated && isFirstLogin === "true") {

        return <Navigate to="/firstlogin" />
    }
    if (isAuthenticated && logUser?.profile !== "Client") {
        return element;
    } else {
        return <Navigate to="/login" />
    }
};

export default GuestRoute;
