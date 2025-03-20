import React, { useEffect, useState, forwardRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    getCancellationBookingStatOne,
    getCancellationBookingStatTwo,
} from "../../feature/API";
import { Spin } from "antd";

const Probleme = () => {
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [cancelData, setCancelData] = useState({
        cancel1Rate: null,
        cancel2Rate: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const query = {
                year: selectedYear.getFullYear(),
            };
            console.log(query);

            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                };
                const [cancel1, cancel2] = await Promise.all([
                    getCancellationBookingStatOne(headers,query),
                    getCancellationBookingStatTwo(headers,query),
                ]);
                setCancelData({
                    cancel1Rate: cancel1.data,
                    cancel2Rate: cancel2.data,
                });
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

    if (!cancelData.cancel1Rate || !cancelData.cancel2Rate)
        return <p>Aucune donnée disponible</p>;

    const { cancellationReasonStat, cancellationRate } = cancelData.cancel1Rate;
    const { totalCancelledBookings, cancellationReasonStat: barDataStat } =
        cancelData.cancel2Rate;

    const pieData = {
        labels: cancellationReasonStat?.map((item) => item.reason),
        datasets: [
            {
                data: cancellationReasonStat?.map((item) => item.percentage),
                backgroundColor: ["#FFD580", "#5CB85C", "#FF6F61"],
                hoverOffset: 4,
            },
        ],
    };

    const barData = {
        labels: barDataStat.map((item) => item.reason),
        datasets: [
            {
                label: "Nombre de problèmes",
                data: barDataStat.map((item) => item.count),
                backgroundColor: barDataStat.map((_, index) =>
                    index % 2 === 0 ? "#FC9C66" : "#9B74F3"
                ),
                borderRadius: 8,
            },
        ],
    };

    return (
        <div style={styles.container}>
            <ChartContainer
                title="Taux d'annulation"
                value={`${cancellationRate} %`}
                handlDatePicker={(e) => setSelectedYear(e)}
                year={selectedYear}
            >
                <Pie data={pieData} options={chartOptions.pie} />
            </ChartContainer>
            <ChartContainer
                title="Nombre total de problèmes"
                value={totalCancelledBookings}
                handlDatePicker={(e) => setSelectedYear(e)}
                year={selectedYear}
            >
                <Bar data={barData} options={chartOptions.bar} />
            </ChartContainer>
        </div>
    );
};

export const ChartContainer = ({
    title,
    value,
    children,
    handlDatePicker,
    year,
}) => (
    <div style={styles.chartContainer}>
        <div style={styles.header}>
            <div>
                <p style={styles.title}>{title}</p>
                <p style={styles.mainValue}>{value}</p>
            </div>
            <DatePicker
                selected={year}
                onChange={(e) => handlDatePicker(e)}
                showYearPicker
                dateFormat="yyyy"
                customInput={<CustomDateButton />}
                minDate={new Date(2024, 0, 1)}
                maxDate={new Date()}
            />
        </div>
        <div style={styles.chartWrapper}>{children}</div>
    </div>
);

const CustomDateButton = forwardRef(({ value, onClick }, ref) => (
    <button style={styles.dateButton} onClick={onClick} ref={ref}>
        {value} 📅
    </button>
));

const chartOptions = {
    pie: {
        responsive: true,
        plugins: { legend: { display: true, position: "bottom" } },
    },
    bar: {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false } },
            y: { display: false },
        },
    },
};

const styles = {
    container: {
        display: "flex",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#F7F7FB",
    },
    chartContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        minWidth: "300px",
    },
    chartWrapper: { width: "100%", height: "250px", overflow: "hidden" },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    title: { fontSize: "16px", fontWeight: "bold", color: "#333" },
    mainValue: { fontSize: "26px", fontWeight: "bold", color: "#9B74F3" },
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

export default Probleme;
