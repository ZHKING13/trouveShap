// GuestRoute.jsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

const GuestRoute = ({element}) => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isLog");
    const logUser = JSON.parse(localStorage.getItem("user"));
//     if (logUser.isFirstLogin) {
//         alert("premier connexion")
//         return
// }
     if (isAuthenticated && logUser.profile !== "Client") {
        return element;
    } else {
        return <Navigate to="/login"/>
    }
};

export default GuestRoute;
