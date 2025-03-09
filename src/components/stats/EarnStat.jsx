import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification, Spin } from "antd";
import AreaCharts from "../chart/AreaChart";
import {
   
    getTotalMoneyStats,
} from "../../feature/API";
import { currencySign } from "../DataTable";
import BarCharts from "../chart/Bar";
import { transformData } from "../chart/Line";

const EarnStats = () => {
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
    // Préparer les données du graphique
    const dataTransform = transformData(Stats?.moneyPerMonth);
    const labels = Object.keys(dataTransform?? "");
    const dataValues = Object.values(dataTransform?? "");
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
    const fetchState = async () => {
        setLoading(true);
        try {
            const query = getYearRange(selectedYear);
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
                "refresh-token": localStorage.getItem("refreshToken"),
            };

            const res = await getTotalMoneyStats(headers, query);
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

    return (
        <div style={styles.container}>
            {contextHolder}
            <div style={styles.header}>
                <div>
                    <p style={styles.subtitle}>Gains totaux </p>
                    <p style={styles.mainValue}>
                        {loading
                            ? "..."
                            : Stats?.totalMoney
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
                                  " " +
                                  currencySign() || "0"}
                    </p>
                </div>
                <div>
                    <p style={styles.subtitle}>Taux de croissance</p>
                    <p style={styles.mainValue}>
                        {loading ? "..." : Stats?.evolutionRate || "0"}%
                    </p>
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
            {loading ? (
                <Spin size="full" />
            ) : (
                <div style={styles.chartWrapper}>
                    <BarCharts data={Stats?.moneyPerMonth} />
                </div>
            )}
        </div>
    );
};

const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));

export default EarnStats;

const styles = {
    container: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        minWidth: "450px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    mainValue: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#9B74F3",
    },
    subtitle: {
        fontSize: "13px",
        color: "#666",
    },
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
    loader: {
        textAlign: "center",
        fontSize: "16px",
        color: "#9B74F3",
        fontWeight: "bold",
        marginTop: "20px",
    },
    chartWrapper: {
        height: "300px",
        boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.12)",
    },
};
