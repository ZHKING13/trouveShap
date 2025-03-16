import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notification } from "antd";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { getBlockedRateStats } from "../../feature/API";

const BlockBooking = () => {
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
            const response = await getBlockedRateStats(headers, {
                year: selectedYear,
            });

            if (response.status !== 200)
                throw new Error(response?.data?.message || "Erreur inconnue");
            setStats(response.data);
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const pieData = [
        {
            name: "Total Résidences",
            value: stats?.totalResidences || 0,
            color: "#FFD580",
        },
        {
            name: "Résidences Bloquées",
            value: stats?.totalBlockedResidences || 0,
            color: "#5CB85C",
        },
       
    ];

    return (
        <div style={styles.container}>
            {contextHolder}
            <div style={styles.header}>
               
                <StatBlock
                    title="Taux de blockage"
                    value={stats?.blockedRate}
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
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={1}
                            outerRadius={80}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                        <Legend
                            verticalAlign="bottom"
                            height={50}
                            formatter={(value, entry) => {
                                const item = pieData.find(
                                    (data) => data.name === value
                                );
                                return `${value}: ${item?.value || 0}`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

const StatBlock = ({ title, value, loading }) => (
    <div>
        <p style={styles.subtitle}>{title}</p>
        <p style={styles.mainValue}>{loading ? "..." : value + "%" || "0%"}</p>
    </div>
);

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

const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));

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

export default BlockBooking;
