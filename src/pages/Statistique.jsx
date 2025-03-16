import React, { useState, useMemo, useRef } from "react";
import Header from "../components/Header";
import { notification } from "antd";
import "./stats.css";
import {
    getCancellationBookingStatOne,
    getCancellationBookingStatTwo,
    getHostStat,
    getRateStat,
} from "../feature/API";
import NoteMoyenne from "../components/stats/NoteMoyenne";
import EvolutionHotes from "../components/stats/HostStat";
import Probleme from "../components/stats/Probleme";
import ReservationStats from "../components/stats/Reservation";
import EmplacementPage from "../components/stats/Emplacement";
import RatePrice from "../components/stats/RatePrice";
import ConversionState from "../components/stats/Conversion";
import CroissanceStat from "../components/stats/Croissance";
import EvolutionTravelers from "../components/stats/TravelerStat";

const tabs = [
    { name: "Note moyenne", component: <NoteMoyenne /> },
    { name: "Nombre d'hôte", component: <EvolutionHotes /> },
    { name: "Nombre de voyageur", component: <EvolutionTravelers /> },
    { name: "Problèmes", component: <Probleme /> },
    { name: "Réservations", component: <ReservationStats /> },
    { name: "Emplacement", component: <EmplacementPage /> },
    { name: "Croissance", component: <CroissanceStat /> },
    { name: "Prix Moyen Resi.", component: <RatePrice /> },
    { name: "Conversion & réservatrion", component: <ConversionState /> },
];

function Statistique() {
    const [api, contextHolder] = notification.useNotification();
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    const activeComponent = useMemo(
        () => tabs.find((tab) => tab.name === activeTab)?.component || null,
        [activeTab]
    );

    return (
        <main>
            {contextHolder}
            <Header title="Statistiques" path="statistiques" />
            <div></div>
            <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="content">{activeComponent}</div>
        </main>
    );
}

export default Statistique;


function Tabs({ activeTab, onTabClick }) {
    const tabsRef = useRef(null);

    return (
        <nav className="tabs" ref={tabsRef}>
            {tabs.map(({ name }) => (
                <Tab
                    key={name}
                    name={name}
                    isActive={activeTab === name}
                    onClick={(tabName, tabRef) => {
                        onTabClick(tabName);
                        tabsRef.current?.scrollTo({
                            left: tabRef.current?.offsetLeft - 50, // Ajustement pour centrer l'onglet
                            behavior: "smooth",
                        });
                    }}
                />
            ))}
        </nav>
    );
}

function Tab({ name, isActive, onClick }) {
    const tabRef = useRef(null);

    return (
        <a
            href="#"
            ref={tabRef}
            className={`tab ${isActive ? "active" : ""}`}
            onClick={(e) => {
                e.preventDefault();
                onClick(name, tabRef);
            }}
        >
            {name}
        </a>
    );
}
