import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const NoteMoyenne = ({ stats }) => {
    const {
        meanRate,
        nbResidencesPerRateValue,
        totalBookings,
        totalResidences,
    } = stats;

    // Préparer les données du graphique
    const labels = Object.keys(nbResidencesPerRateValue);
    const dataValues = Object.values(nbResidencesPerRateValue);
    const colors = labels.map((label, index) =>
        index % 2 === 0 ? "#FC9C66" : "#9B74F3"
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: "Nombre de résidences",
                data: dataValues,
                backgroundColor: colors,
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { display: false },
        },
    };

    return (
        <div style={styles.container}>
            {/* Carte Total Résidences */}
            <div style={styles.cardContainer}>
                <div style={styles.cardParent}>
                    <div style={styles.card}>
                        <p style={styles.label}>Total résidences</p>
                        <h2 style={styles.value}>{totalResidences}</h2>
                    </div>

                    {/* Carte Note Moyenne */}
                    <div style={styles.card}>
                        <p style={styles.label}>Note moyenne</p>
                        <h2 style={styles.value}>{meanRate.toFixed(1)} / 5</h2>
                    </div>
                </div>
            </div>

            {/* Graphique */}
            <div style={styles.chartContainer}>
                <div style={styles.chartHeader}>
                    <div>
                        <p style={styles.chartTitle}>
                            Nombre total de réservation
                        </p>
                        <h2 style={styles.totalBookings}>
                            {totalBookings.toLocaleString()}
                        </h2>
                    </div>
                    <p style={styles.year}>2025 🗓</p>
                </div>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

// Styles en ligne pour respecter le design
const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    cardContainer: {
        flexGrow: 1,
    },
    cardParent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        gap: 8,
        padding: "1px",
    },
    label: { fontSize: "18px", color: "#666" },
    value: { fontSize: "34px", fontWeight: "bold" },
    chartContainer: {
        flex: 3,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    chartHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    chartTitle: { fontSize: "14px", color: "#666" },
    totalBookings: { fontSize: "24px", color: "#9B74F3", fontWeight: "bold",margin:"0px" },
    year: { fontSize: "14px", color: "#666", marginTop: "5px" },
};

export default NoteMoyenne;
