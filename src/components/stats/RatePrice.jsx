import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification, Spin } from "antd";
import AreaCharts from "../chart/AreaChart";
import { getMeanPriceStats } from "../../feature/API";
import { currencySign } from "../DataTable";

const RatePrice = () => {
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [Stats, setStats] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, message) => {
        api[type]({ message: title, description: message });
    };

    const getYearRange = (year) => ({
        fromDate: `${year}-01-01`,
        toDate: `${year}-12-31`,
    });

    const handleYearChange = (date) => {
        setSelectedYear(date.getFullYear());
    };

    const fetchState = async () => {
        setLoading(true);
        try {
            const query = getYearRange(selectedYear);
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
                "refresh-token": localStorage.getItem("refreshToken"),
            };

            const res = await getMeanPriceStats(headers, query);
            console.log(res);

            if (res.status !== 200) {
                throw new Error(res?.data?.message || "Erreur inconnue");
            }
            setStats(res.data);
        } catch (error) {
            openNotificationWithIcon("error", "Erreur", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchState();
    }, [selectedYear]);
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
    const {
        meanRate,
        nbResidencesPerRateValue,
        totalBookings,
        totalResidences,
    } = statsData;

    // Préparer les données du graphique
    const labels = Stats?.meanPricePerPart.map((item) => item.label); // Extrait les labels
    const dataValues = Stats?.meanPricePerPart.map((item) => item.count);
    const colors = labels?.map((_, index) =>
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
                <div style={styles.card}>
                    <p style={styles.label}>Total résidences</p>
                    <h2 style={styles.value}>{Stats?.totalResidences}</h2>
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
                            {Stats?.meanPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
                                " " +
                                currencySign() || "0"}
                        </h2>
                    </div>
                    <div style={styles.datePickerContainer}>
                        <DatePicker
                            selected={new Date(selectedYear, 0, 1)}
                            onChange={handleYearChange}
                            showYearPicker
                            dateFormat="yyyy"
                            disabled={loading}
                            customInput={
                                <CustomDatePickerButton year={selectedYear} />
                            }
                        />
                    </div>
                </div>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};
const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));
// Styles en ligne pour respecter le design
const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        gap: 20,
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
       
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "150px",
        width:"100"
    },
    cardContainer: {
        flexGrow: 1,
    },
    cardParent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        alignItems:"flex-start",
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
    totalBookings: {
        fontSize: "24px",
        color: "#9B74F3",
        fontWeight: "bold",
        margin: "0px",
    },
    year: { fontSize: "14px", color: "#666", marginTop: "5px" },
    datePickerContainer: {
        position: "relative",
    },
    datePickerButton: {
        fontSize: "14px",
        background: "#F1F1F1",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
};

export default RatePrice;
