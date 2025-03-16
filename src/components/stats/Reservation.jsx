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

const ReservationChart = ({   }) => {
    // 📆 État pour stocker l'année sélectionnée
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // 🛠️ Fonction pour récupérer les dates de début et fin d'année
    const getYearRange = (year) => {
        return {
            startDate: `${year}-01-01`,
            endDate: `${year}-12-31`,
        };
    };

    const handleYearChange = (date) => {
        const year = date.getFullYear();
        setSelectedYear(year);
        const { startDate, endDate } = getYearRange(year);
        console.log("Année sélectionnée :", year);
        console.log("Début :", startDate, "Fin :", endDate);
    };



    return (
        <div style={styles.container}>
            <ReservationCancel />
            <RefundBookin />
            {/* <RejectedResidence/> */}
        </div>
    );
};

// 📅 Composant personnalisé pour le bouton du DatePicker
const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year}
        <span style={styles.calendarIcon}>📅</span>
    </button>
));
export default ReservationChart
// 🎨 Styles CSS en objet
const styles = {
    container: {
        backgroundColor: "white",
        display: "flex",
        gap:10,
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        flexWrap:"wrap"
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
