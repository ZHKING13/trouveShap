import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification } from "antd";
import AreaCharts from "../chart/AreaChart";
import { getRefungBooking } from "../../feature/API";

const RefundBooking = ({data,setData}) => {
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState(null);
    const [api, contextHolder] = notification.useNotification();

    const notifyError = (message) => {
        api.error({ message: "Erreur", description: message });
    };

    const handleYearChange = (date) => {
        setSelectedYear(date.getFullYear());
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
                "refresh-token": localStorage.getItem("refreshToken"),
            };
            const response = await getRefungBooking(headers, {
                year: selectedYear,
            });

            if (response.status !== 200)
                throw new Error(response?.data?.message || "Erreur inconnue");

            setStats(response.data);
            setData((prev) => {
                return {
                    ...prev,
                    "reservation-remboursé": response.data.refundedBookingsPerMonth
                }
            })
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    return (
        <div id="reservation-remboursé" style={styles.container}>
            {contextHolder}
            <div style={styles.header}>
                <StatBlock
                    title="Réservations remboursées"
                    value={stats?.totalRefundedBookings}
                    loading={loading}
                />
                <StatBlock
                    title="Taux de remboursement"
                    value={stats?.refundRate + "%"}
                    loading={loading}
                />
                <DatePickerSelector
                    year={selectedYear}
                    onChange={handleYearChange}
                    loading={loading}
                />
            </div>
            {loading ? (
                <p style={styles.loader}>Chargement...</p>
            ) : (
                <AreaCharts data={stats?.refundedBookingsPerMonth} />
            )}
        </div>
    );
};

// **Composant Réutilisable pour les Stats**
const StatBlock = ({ title, value, loading }) => (
    <div>
        <p style={styles.subtitle}>{title}</p>
        <p style={styles.mainValue}>{loading ? "..." : value || "0"}</p>
    </div>
);

// **Sélecteur d'année personnalisé**
const DatePickerSelector = ({ year, onChange, loading }) => (
    <DatePicker
        selected={new Date(year, 0, 1)}
        onChange={onChange}
        showYearPicker
        dateFormat="yyyy"
        disabled={loading}
        minDate={new Date(2024, 0, 1)}
        maxDate={new Date()}
        customInput={<CustomDatePickerButton year={year} />}
    />
);

// **Bouton du DatePicker**
const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));

export default RefundBooking;

// **Styles**
const styles = {
    container: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        minWidth: "450px",
        height: "300px",
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
};
