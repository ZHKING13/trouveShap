import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification } from "antd";
import AreaCharts from "../chart/AreaChart";
import {
   
    getResidenceRejected,
} from "../../feature/API";
import BarCharts from "../chart/Bar";

const RejectedResidence = () => {
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [cancel1Rate, setCancel1Rate] = useState(null);
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
              const query = {
                  year: selectedYear,
              };
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
                "refresh-token": localStorage.getItem("refreshToken"),
            };

            const res = await getResidenceRejected(headers, query);
            console.log(res);

            if (res.status !== 200) {
                throw new Error(res?.data?.message || "Erreur inconnue");
            }
            setCancel1Rate(res.data);
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
                    <p style={styles.subtitle}>Réservations annulées</p>
                    <p style={styles.mainValue}>
                        {loading
                            ? "..."
                            : cancel1Rate?.totalResidences || "N/A"}
                    </p>
                </div>
                <div>
                    <p style={styles.subtitle}>Taux d'annulation</p>
                    <p style={styles.mainValue}>
                        {loading ? "..." : cancel1Rate?.rejectionRate || "N/A"}
                    </p>
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
                            <CustomDatePickerButton year={selectedYear} />
                        }
                    />
                </div>
            </div>
            {loading ? (
                <div style={styles.loader}>Chargement...</div>
            ) : (
                <div style={styles.chartWrapper}>
                    <BarCharts data={cancel1Rate?.cancelledBookingsPerMonth} />
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

export default RejectedResidence;

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
