import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification, Spin } from "antd";
import { getMeanPriceStats } from "../../feature/API";
import { currencySign } from "../DataTable";
import { FaFileExcel } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const RatePrice = () => {
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, message) => {
        api[type]({ message: title, description: message });
    };

    const handleYearChange = (date) => {
        setSelectedYear(date.getFullYear());
    };
 const exportToExcel = () => {
     if (!stats) return;

     const worksheet = XLSX.utils.json_to_sheet(stats.meanPricePerPart || []);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Stats");

     const excelBuffer = XLSX.write(workbook, {
         bookType: "xlsx",
         type: "array",
     });
     const data = new Blob([excelBuffer], {
         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     });
     saveAs(data, `stats_${selectedYear}.xlsx`);
 };
    const fetchState = async () => {
        setLoading(true);
        try {
            const query = { year: selectedYear };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
                "refresh-token": localStorage.getItem("refreshToken"),
            };

            const res = await getMeanPriceStats(headers, query);
            if (!res || res.status !== 200) {
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

    if (loading)
        return (
            <div style={styles.spinnerContainer}>
                <Spin size="large" />
            </div>
        );

    if (!stats) return <p>Aucune donnée disponible</p>;

    const labels = stats.meanPricePerPart?.map((item) => item.label) || [];
    const dataValues = stats.meanPricePerPart?.map((item) => item.count) || [];
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
        <div
            style={{
                backgroundColor: "#fff",
            }}
        >
            <div style={styles.container}>
                {contextHolder}
                <div style={styles.cardContainer}>
                    <div style={styles.card}>
                        <p style={styles.label}>Total résidences</p>
                        <h2 style={styles.value}>
                            {stats?.totalResidences || 0}
                        </h2>
                    </div>
                </div>
                <div style={styles.chartContainer}>
                    <div style={styles.chartHeader}>
                        <div>
                            <p style={styles.chartTitle}>
                              Prix moyen des résidences
                            </p>
                            <h2 style={styles.totalBookings}>
                                {stats?.meanPrice
                                    ?.toString()
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
                                minDate={new Date(2024, 0, 1)}
                                maxDate={new Date()}
                                customInput={
                                    <CustomDatePickerButton
                                        year={selectedYear}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
            <button onClick={exportToExcel} style={styles.exportButton}>
                <FaFileExport size={20} color="#9B74F3" /> Exporter les
                résultats
            </button>
        </div>
    );
};

const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));

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
        width: "100",
    },
    cardContainer: { flexGrow: 1 },
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
    datePickerContainer: { position: "relative" },
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
    spinnerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Ensure it takes the full height of the viewport
        width: "100%",
    },
    exportButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "transparent",
        border: "2px solid #9B74F3",
        color: "#9B74F3",
        padding: "10px 15px",
        borderRadius: "20px",
        cursor: "pointer",
        fontWeight: "bold",
        margin: "20px",
    },
};

export default RatePrice;
