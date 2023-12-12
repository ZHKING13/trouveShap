// GuestRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

const GuestRoute = ({element}) => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isLog");
    const logUser = JSON.parse(localStorage.getItem("user"));

     if (isAuthenticated && logUser.profile === "Admin") {
        return element;
    } else {
        return <Navigate to="/login"/>
    }
};

export default GuestRoute;
