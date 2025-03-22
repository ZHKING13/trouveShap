import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import LineCharts from "../chart/Line";
import AreaCharts from "../chart/AreaChart";
import ReservationCancel from "./ReservationCancel1";
import RefundBookin from "./refundBooking";
import RejectedResidence from "./RejectedResidence";
import BlockBooking from "./blockBooking";
import { FaDownload } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { ExcelExportService } from "../../feature/util";
import { MonthArray } from "../../data";

const ReservationChart = ({ annualReservations, cancellationRate }) => {
    // 📆 État pour stocker l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [data, setData] = useState({});
    const [loading, setLoading] = useOutletContext();

    const handleExport = async () => {
        if (!data) return;
        setLoading(true);

        // feuille 1 : Durée moyenne de séjour
        const excelService = new ExcelExportService();
        for (const [key, values] of Object.entries(data)) {
            if (key == "reservation-bloqué") {
                const blockData = [
                    {
                        key: "residence total",
                        value: values.totalResidences,
                    },
                    {
                        key: "residence bloqué",
                        value: values.totalBlockedResidences,
                    },
                    {
                        key: "Taux de blockage",
                        value: values.blockedRate,
                    },
                ];
                  await excelService.generateSheet(blockData, key, key, {
                      maxWidth: 600,
                  });
                continue; 
            }
            const dataToExport = values.map((item, index) => ({
                key: `${MonthArray[item.month - 1]}`,
                value: item.count,
            }));

            await excelService.generateSheet(dataToExport, key, key, {
                maxWidth: 600,
            });
        }

        setLoading(false);
        excelService.export("reservation-stats");
    };

    return (
        <div style={{ backgroundColor: "#fff" }}>
            <div style={styles.container}>
                <ReservationCancel data={data} setData={setData} />
                <RefundBookin data={data} setData={setData} />
                <BlockBooking data={data} setData={setData} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleExport} className="export-button">
                    <FaDownload size={20} color="#9B74F3" /> Exporter les
                    résultats
                </button>
            </div>
        </div>
    );
};

export default ReservationChart;
// 🎨 Styles CSS en objet
const styles = {
    container: {
        backgroundColor: "white",
        display: "flex",
        gap: 10,
        padding: "20px",
        borderRadius: "12px",

        flexWrap: "wrap",
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
    percentage: {
        fontSize: "18px",
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
        color: "#333",
        background: "#F1F1F1",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
    },
    datePickerButtonHover: {
        background: "#E6E6E6",
    },
    calendarIcon: {
        fontSize: "16px",
    },
    chartWrapper: {
        height: "160px",
    },
};
