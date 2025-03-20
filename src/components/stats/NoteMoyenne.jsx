import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { ChartContainer } from "./Probleme";
import { getRateStat } from "../../feature/API";
import { Spin } from "antd";

const NoteMoyenne = () => {
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };
                const { data } = await getRateStat(headers, {
                    year: selectedYear.getFullYear(),
                });
                setStats(data);
                
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des données",
                    error
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedYear]);

    if (loading)
          return (
              <div style={styles.spinnerContainer}>
                  <Spin size="large" />
              </div>
          );
    if (!stats) return <p>Aucune donnée disponible</p>;

    const {
        meanRate,
        nbResidencesPerRateValue,
        totalBookings,
        totalResidences,
    } = stats;

    const labels = Object?.keys(nbResidencesPerRateValue);
    const dataValues = Object.values(nbResidencesPerRateValue);
    const colors = labels.map((_, index) =>
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
        scales: { x: { grid: { display: false } }, y: { display: false } },
    };

    return (
        <div style={styles.container}>
            <div style={styles.cardContainer}>
                <div style={styles.cardParent}>
                    <Card label="Total résidences" value={totalResidences} />
                    <Card
                        label="Note moyenne"
                        value={`${meanRate.toFixed(1)} / 5`}
                    />
                </div>
            </div>
            <ChartContainer
                title="Nombre total de réservation"
                value={totalBookings}
                year={selectedYear}
                handlDatePicker={(e) =>
                    setSelectedYear(e)
                }
            >
                <Bar data={chartData} options={chartOptions} />
            </ChartContainer>
        </div>
    );
};

const Card = ({ label, value }) => (
    <div style={styles.card}>
        <p style={styles.label}>{label}</p>
        <h2 style={styles.value}>{value}</h2>
    </div>
);

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    cardContainer: { flexGrow: 1 },
    cardParent: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "1px",
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
    label: { fontSize: "18px", color: "#666" },
    value: { fontSize: "34px", fontWeight: "bold" },
    spinnerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Ensure it takes the full height of the viewport
        width: "100%",
    },
};

export default NoteMoyenne;
