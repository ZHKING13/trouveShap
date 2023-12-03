import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Residence from './pages/Residence.jsx';
import Reservation from './pages/Reservation.jsx';
import NewsLetter from './pages/NewsLetter.jsx';
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
        ],
    },
    {
        path: "login",
        element: <Login />,
    },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
