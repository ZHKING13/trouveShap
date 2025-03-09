import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const EvolutionHotes = ({ stats }) => {
    const { evolutionRate, hostPerMonth, totalHosts } = stats;

    // 📌 Mapper les mois en format abrégé
    const monthNames = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
    ];

    // 📌 Extraire les données pour le graphique
    const labels = hostPerMonth.map((item) => monthNames[item.month - 1]);
    const dataValues = hostPerMonth.map((item) => item.count);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Nombre d'hôtes",
                data: dataValues,
                borderColor: "#9B74F3",
                backgroundColor: "rgba(155, 116, 243, 0.2)",
                pointBackgroundColor: "#9B74F3",
                tension: 0.4, // Ajoute un effet de courbe lisse
                fill: true,
            },
        ],
    };

  const chartOptions = {
      responsive: true,
      maintainAspectRatio: false, // Permet au graphique de s’adapter à la largeur
      plugins: {
          legend: { display: false }, // Masquer la légende
          tooltip: { enabled: true, mode: "index" },
      },
      scales: {
          x: { grid: { display: false } },
          y: { display: false }, // Masquer l'axe Y
      },
  };


    return (
        <div style={styles.container}>
            {/* 📌 En-tête avec Total des hôtes & taux de croissance */}
            <div style={styles.header}>
                <div style={styles.infoBox}>
                    <p style={styles.label}>Nombre d'hôtes</p>
                    <h2 style={styles.value}>{totalHosts.toLocaleString()}</h2>
                </div>
                <div style={styles.infoBox}>
                    <p style={styles.label}>Taux de croissance</p>
                    <h2 style={styles.percentage}>{evolutionRate}%</h2>
                </div>
                <p style={styles.year}>2025 🗓</p>
            </div>

            {/* 📌 Graphique */}
            <div style={styles.chartContainer}>
                <Line
                    data={chartData}
                    options={chartOptions}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    );
};

// 🎨 **Styles**
const styles = {
    container: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    infoBox: { textAlign: "left" },
    label: { fontSize: "14px", color: "#666" },
    value: { fontSize: "24px", fontWeight: "bold", color: "#9B74F3" },
    percentage: { fontSize: "24px", fontWeight: "bold", color: "#6E57E0" },
    year: { fontSize: "14px", color: "#666" },
    chartContainer: {
        width: "99%",
        height: "250px",
        display: "flex",
        justifyContent: "center",
    },
};

export default EvolutionHotes;
