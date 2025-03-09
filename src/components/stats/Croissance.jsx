import React, { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import EarnStats from "./EarnStat";
import ReservationStats from "./ReservationStats";
import VisiteurStats from "./VisiteurStat";
import Portefuille from "./Portefeuill";

const CroissanceStat = () => {
    const [selectedYear, setSelectedYear] = useState(2025);

    const dataBar = [
        { name: "Jan", valeur: 100000 },
        { name: "Fév", valeur: 200000 },
        { name: "Mar", valeur: 150000 },
        { name: "Avr", valeur: 250000 },
        { name: "Mai", valeur: 300000 },
        { name: "Juin", valeur: 220000 },
    ];

    const dataLine = [
        { name: "Jan", valeur: 3600 },
        { name: "Fév", valeur: 4200 },
        { name: "Mar", valeur: 3800 },
        { name: "Avr", valeur: 4500 },
        { name: "Mai", valeur: 4800 },
        { name: "Juin", valeur: 4600 },
    ];

    return (
        <div style={styles.container}>
            {/* Statistiques principales */}
            <div style={styles.statCards}>
                <div style={styles.statCard}>
                    <p style={styles.statTitle}>Résidences totales</p>
                    <h2 style={styles.statValue}>32</h2>
                </div>
                <div style={styles.statCard}>
                    <p style={styles.statTitle}>Réservations totales</p>
                    <h2 style={styles.statValue}>250</h2>
                </div>
            </div>

            {/* Graphiques */}
            <div style={styles.chartsGrid}>
                {/* Graphique des gains */}
                <div style={styles.chartCard}>
                    <EarnStats />
                </div>

                {/* Réservations */}
                <div style={styles.chartCard}>
                   
                    <ReservationStats/>
                </div>

                {/* Visiteurs */}
                <div style={styles.chartCard}>
                    
                   <VisiteurStats/>
                </div>

                {/* Portefeuille */}
                <div style={styles.chartCard}>
                    
                    <Portefuille/>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#F8F9FC",
    },
    statCards: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        flex: 1,
        margin: "0 10px",
    },
    statTitle: {
        fontSize: "14px",
        color: "#6B7280",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    chartsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },
    chartCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    chartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    growthRate: {
        fontSize: "12px",
        color: "#6B7280",
    },
    yearSelector: {
        padding: "5px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
    },
};

export default CroissanceStat;
