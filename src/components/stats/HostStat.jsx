import React, { forwardRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { getHostStat } from "../../feature/API";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spin } from "antd";
import { FaDownload } from "react-icons/fa";
import { ExcelExportService } from "../../feature/util";

const EvolutionHotes = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };
                const { data } = await getHostStat(headers, {
                    year: selectedYear,
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

    const handleYearChange = (date) => {
        setSelectedYear(date.getFullYear());
    };

    if (loading)
        return (
            <div style={styles.spinnerContainer}>
                <Spin size="large" />
            </div>
        );
    if (!stats) return <p>Aucune donnée disponible</p>;

    const { evolutionRate, hostPerMonth, totalHosts } = stats;
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
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true, mode: "index" },
        },
        scales: {
            x: { grid: { display: false } },
            y: { display: false },
        },
    };
    const handleExport = async () => {
            if (!hostPerMonth) return;
            setLoading(true);
    
            // feuille 1 : Durée moyenne de séjour
            
            const excelService = new ExcelExportService();
           
            const dataToExport = hostPerMonth.map((item, index) => ({
                key: monthNames[item.month - 1],
                value: item.count,
            }));      
            
            await excelService.generateSheet(dataToExport, "hôte", "host", {
                maxWidth: 600,
            });
    
            setLoading(false);
            excelService.export("Host-stats");
        };

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <div id="host" style={styles.container}>
                <Header
                    totalHosts={totalHosts}
                    evolutionRate={evolutionRate}
                    selectedYear={selectedYear}
                    handleYearChange={handleYearChange}
                />
                <div style={styles.chartContainer}>
                    <Line
                        data={chartData}
                        options={chartOptions}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={handleExport}
                    className="export-button"
                >
                    <FaDownload size={20} color="#9B74F3" /> Exporter les
                    résultats
                </button>
            </div>
        </div>
    );
};

const Header = ({
    totalHosts,
    evolutionRate,
    selectedYear,
    handleYearChange,
}) => (
    <div style={styles.header}>
        <InfoBox label="Nombre d'hôtes" value={totalHosts.toLocaleString()} />
        <InfoBox label="Taux de croissance" value={`${evolutionRate || 0}%`} />
        <DatePicker
            selected={new Date(selectedYear, 0, 1)}
            onChange={(e) => handleYearChange(e)}
            showYearPicker
            dateFormat="yyyy"
            customInput={<CustomDateButton />}
            minDate={new Date(2024, 0, 1)}
            maxDate={new Date()}
        />
    </div>
);

const InfoBox = ({ label, value }) => (
    <div style={styles.infoBox}>
        <p style={styles.label}>{label}</p>
        <h2 style={styles.value}>{value}</h2>
    </div>
);

const CustomDateButton = forwardRef(({ value, onClick }, ref) => (
    <button style={styles.dateButton} onClick={onClick} ref={ref}>
        {value} 📅
    </button>
));

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
    chartContainer: {
        width: "99%",
        height: "250px",
        display: "flex",
        justifyContent: "center",
    },
    dateButton: {
        fontSize: "14px",
        background: "#F1F1F1",
        padding: "6px 10px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    spinnerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Ensure it takes the full height of the viewport
        width: "100%",
    },
};

export default EvolutionHotes;
