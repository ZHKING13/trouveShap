import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { notification } from "antd";
import "./stats.css";
import {
    getCancellationBookingStatOne,
    getCancellationBookingStatTwo,
    getHostStat,
    getRateStat,
} from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import NoteMoyenne from "../components/stats/NoteMoyenne";
import EvolutionHotes from "../components/stats/HostStat";
import Probleme from "../components/stats/Probleme";
import ReservationStats from "../components/stats/Reservation";
import EmplacementPage from "../components/stats/Emplacement";
import RatePrice from "../components/stats/RatePrice";
import ConversionState from "../components/stats/Conversion";
import CroissanceStat from "../components/stats/Croissance";
function Statistique() {
    const [hostStat, setHostStat] = useState();
    const [rateStat, setRateStat] = useState();
    const [cancel1Rate, setCancel1Rate] = useState();
    const [cancel2Rate, setCancel2Rate] = useState();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const [activeTab, setActiveTab] = useState("Note moyenne");
    const [loading, setLoading] = useOutletContext();
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const fetchState = async () => {
        setLoading(true);

        const [rate, host, cancel1, cancel2] = await Promise.all([
            getRateStat(headers),
            getHostStat(headers),
            getCancellationBookingStatOne(headers),
            getCancellationBookingStatTwo(headers),
        ]);
        console.log("ratemoyen", rate);
        if (rate.status !== 200) {
            openNotificationWithIcon("error", "Opps ", rate?.data?.message);
            setLoading(false);
            return;
        }
        setRateStat(rate.data);
        setHostStat(host.data);
        setCancel1Rate(cancel1.data);
        setCancel2Rate(cancel2.data);
        setLoading(false);
    };
    const statsData = {
        meanRate: 4.8,
        nbResidencesPerRateValue: {
            0: 100,
            1: 200,
            2: 300,
            3: 250,
            4: 400,
            5: 320,
        },
        totalBookings: 1000000,
        totalResidences: 1200,
    };
    const stats = {
        evolutionRate: 18, // Taux de croissance en %
        totalHosts: 1000000, // Nombre total d'hôtes
        hostPerMonth: [
            { month: 1, count: 120000 },
            { month: 2, count: 100000 },
            { month: 3, count: 140000 },
            { month: 4, count: 90000 },
            { month: 5, count: 95000 },
            { month: 6, count: 130000 },
            { month: 7, count: 160000 },
            { month: 8, count: 150000 },
            { month: 9, count: 140000 },
            { month: 10, count: 145000 },
            { month: 11, count: 155000 },
            { month: 12, count: 165000 },
        ],
    };
    const reservationData = {
        annualReservations: 200,
        cancellationRate: "18%",
        refundedReservations: 150,
        refundRate: "12%",
        blockingRate: "18%",
        totalAds: 1000,
        blockedAds: 250,
    };
    useEffect(() => {
        fetchState();
    }, []);
    return (
        <main>
            <>
                {contextHolder}
                <Header title={"Statistiques"} path={"statistiques"} />
                <nav className="tabs">
                    <Tab
                        name="Note moyenne"
                        isActive={activeTab === "Note moyenne"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Nombre d'hôte"
                        isActive={activeTab === "Nombre d'hôte"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Problèmes"
                        isActive={activeTab === "Problèmes"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Réservations"
                        isActive={activeTab === "Réservations"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Emplacement"
                        isActive={activeTab === "Emplacement"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Croissance"
                        isActive={activeTab === "Croissance"}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Prix Moyen Resi."
                        isActive={activeTab === "Prix Moyen Resi."}
                        onClick={handleTabClick}
                    />
                    <Tab
                        name="Conversion & réservatrion"
                        isActive={activeTab === "Conversion & réservatrion"}
                        onClick={handleTabClick}
                    />
                </nav>
                <div className="content">
                    {activeTab === "Note moyenne" && (
                        <NoteMoyenne stats={rateStat ?? statsData} />
                    )}
                    {activeTab === "Nombre d'hôte" && (
                        <EvolutionHotes stats={hostStat ?? stats} />
                    )}
                    {activeTab === "Problèmes" && (
                        <Probleme pieStat={cancel1Rate} barStat={cancel2Rate} />
                    )}
                    {activeTab === "Réservations" && (
                        <ReservationStats reservationData={reservationData} />
                    )}
                    {activeTab === "Emplacement" && <EmplacementPage />}
                    {activeTab === "Croissance" && <CroissanceStat />}
                    {activeTab === "Prix Moyen Resi." && <RatePrice />}
                    {activeTab === "Conversion & réservatrion" && (
                        <ConversionState />
                    )}
                    {/* {activeTab === "Nombre d'hôte" && <NombreHote />}
                  {activeTab === "Problèmes" && <Problemes />}
                  */}
                </div>
            </>
        </main>
    );
}

export default Statistique;

function Tab({ name, isActive, onClick }) {
    return (
        <a
            href="#"
            className={`tab ${isActive ? "active" : ""}`}
            onClick={(e) => {
                e.preventDefault();
                onClick(name);
            }}
        >
            {name}
        </a>
    );
}
