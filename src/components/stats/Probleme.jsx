import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const Probleme = ({ pieStat, barStat }) => {
    const { cancellationReasonStat, cancellationRate } = pieStat;
    const { totalCancelledBookings, cancellationReasonStat: barDataStat } =
        barStat;

    // 📊 Données pour le Pie Chart (Taux de conversion)
    const pieData = {
        labels: cancellationReasonStat.map((item) => item.reason),
        datasets: [
            {
                data: cancellationReasonStat.map((item) => item.percentage),
                backgroundColor: ["#FFD580", "#5CB85C", "#FF6F61"],
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

    // 📊 Données pour le Bar Chart (Nombre total de problèmes)
    const labels = barDataStat.map((item) => item.reason);
    const dataValues = barDataStat.map((item) => item.count);
    const colors = labels.map((_, index) =>
        index % 2 === 0 ? "#FC9C66" : "#9B74F3"
    );

    const barData = {
        labels,
        datasets: [
            {
                label: "Nombre de problèmes",
                data: dataValues,
                backgroundColor: colors,
                borderRadius: 8,
            },
        ],
    };

    const barOptions = {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false } },
            y: { display: false },
        },
    };

    return (
        <div style={styles.container}>
            {/* 📊 Taux de conversion (Pie Chart) */}
            <div style={styles.pieContainer}>
                <div style={styles.header}>
                    <div>
                        <p style={styles.title}>Taux de conversion</p>
                        <p style={styles.mainValue}>{cancellationRate} %</p>
                    </div>
                    <p style={styles.year}>2025 📅</p>
                </div>
                <div style={styles.pieWrapper}>
                    {cancellationReasonStat.length > 0 ? (
                        <Pie data={pieData} options={pieOptions} />
                    ) : (
                        <p style={styles.noData}>Pas de données</p>
                    )}
                </div>
            </div>

            {/* 📊 Nombre total de problèmes (Bar Chart) */}
            <div style={styles.barContainer}>
                <div style={styles.header}>
                    <div>
                        <p style={styles.title}>Nombre total de problèmes</p>
                        <p style={styles.mainValue}>{totalCancelledBookings}</p>
                    </div>
                    <p style={styles.year}>2025 📅</p>
                </div>

                {barDataStat.length > 0 ? (
                    <div style={styles.barWrapper}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                ) : (
                    <p style={styles.noData}>Aucune annulation enregistrée</p>
                )}
            </div>
        </div>
    );
};

// 🎨 Styles améliorés avec un meilleur header
const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#F7F7FB",
        alignItems: "stretch",
    },
    pieContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        minWidth: "300px",
    },
    pieWrapper: {
        width: "100%",
        maxWidth: "250px",
        margin: "auto",
    },
    barContainer: {
        flex: 2,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        minWidth: "400px",
        justifyContent: "center",
    },
    barWrapper: {
        width: "100%",
        height: "250px",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
    },
    mainValue: {
        fontSize: "26px",
        fontWeight: "bold",
        color: "#9B74F3",
    },
    year: {
        fontSize: "14px",
        color: "#666",
        background: "#F1F1F1",
        padding: "6px 10px",
        borderRadius: "8px",
    },
    noData: {
        textAlign: "center",
        color: "#999",
        fontSize: "14px",
        marginTop: "20px",
    },
};

export default Probleme;
