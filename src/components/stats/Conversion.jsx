import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    getCancelationRateBookings,
    getConversionStats,
} from "../../feature/API";
import { FaDownload } from "react-icons/fa";
import { MonthArray } from "../../data";
import * as XLSX from "xlsx";
import { ExcelExportService } from "../../feature/util";

const ConversionState = () => {
    const [stayStat, setStayStat] = useState(null);
    const [cancelState, setCancelState] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [loading, setLoading] = useOutletContext();
    const handleExport = async() => {
        if (!stayStat || !cancelState) return;
        setLoading(true);
       const dureeAvecMois = stayStat.meanNightsPerMonth?.map(
           (item) => ({
               ...item,
               monthName: MonthArray[item.month - 1],
           })
       );
   const dataToExport = [
       { key: "Durée Moyenne Séjour", value: stayStat.meanNights },
       ...stayStat.meanNightsPerMonth.map((item) => ({
           key: ` ${MonthArray[item.month - 1]}`,
           value: item.count,
       })),
      
        ];
        // feuille 1 : Durée moyenne de séjour
      const excelService = new ExcelExportService()
        await excelService.generateSheet(
            dataToExport,
            "Durée Moyenne Séjour",
            "sejour-stats",
            { maxWidth: 600 }
        );
        // feuille 2 : Taux d'annulation
        // convertir l'objet en tableau
        const cancelData = [
            { key: "Annulation", value: cancelState.cancellationRate },
            { key: "Réservations", value: cancelState.otherStatusBookingsRate }
        ];
        await excelService.generateSheet(
            cancelData,
            "Taux d'Annulation",
            "taux-annulaion",
            {
                maxWidth: 600,
            }
        );
        setLoading(false);
        excelService.export("conversion-stats");
   };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
const getYearRange = (year) => ({
    fromDate: `${year}-01-01`,
    toDate: `${year}-12-31`,
});
    const fetchState = async () => {
        
        
        setLoading(true);
        try {
            const query = {year:selectedYear.getFullYear()};
            const [stay, cancel] = await Promise.all([
                getConversionStats(headers,query),
                getCancelationRateBookings(headers,query),
            ]);

            if (stay.status !== 200) {
                console.error("Erreur API séjour :", stay);
                setLoading(false);
                return;
            }

            setStayStat(stay.data);
            setCancelState(cancel.data);
            
        } catch (error) {
            console.error("Erreur API:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchState();
    }, [selectedYear]);

    const monthNames = [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const staysData =
        stayStat?.meanNightsPerMonth?.map((item) => ({
            month: monthNames[item.month - 1],
            nights: item.count,
            color: item.count > 5 ? "#FC9C66" : "#9B74F3",
        })) || [];

    const cancellationData = cancelState
        ? [
              {
                  name: "Annulation",
                  value: cancelState.cancellationRate,
                  color: "#FC9C66",
              },
              {
                  name: "Réservation",
                  value: cancelState.otherStatusBookingsRate,
                  color: "#3CD278",
              },
          ]
        : [];

    return (
        <div>
            <div  style={styles.container}>
                {/* Durée moyenne des séjours */}
                <div id="sejour-stats" style={styles.card}>
                    <div style={styles.header}>
                        <h3 style={styles.title}>Durée moyenne des séjours</h3>

                        <DatePicker
                            selected={selectedYear}
                            onChange={(date) => setSelectedYear(date)}
                            showYearPicker
                            dateFormat="yyyy"
                            minDate={new Date(2024, 0, 1)}
                            maxDate={new Date()}
                            customInput={<CustomDateButton />}
                        />
                    </div>
                    <div style={styles?.detail}>
                        <h1 style={styles.bigText}>
                            {stayStat?.meanNights || 0} <span>nuitées</span>
                        </h1>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={staysData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="month" type="category" width={40} />
                            <Tooltip />
                            <Bar dataKey="nights" radius={[10, 10, 10, 10]}>
                                {staysData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Taux d'annulation */}
                <div id="taux-annulaion" style={styles.card}>
                    <div style={styles.header}>
                        <h3 style={styles.title}>Taux d'annulation</h3>
                        <DatePicker
                            selected={selectedYear}
                            onChange={(date) => setSelectedYear(date)}
                            showYearPicker
                            dateFormat="yyyy"
                            minDate={new Date(2024, 0, 1)}
                            maxDate={new Date()}
                            customInput={<CustomDateButton />}
                        />
                    </div>

                    <h1
                        style={{
                            ...styles.bigText,
                            color: "#9B74F3",
                            textAlign: "left",
                        }}
                    >
                        {cancelState?.cancellationRate || 0}%
                    </h1>

                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={cancellationData}
                                dataKey="value"
                                innerRadius={60}
                                outerRadius={80}
                            >
                                {cancellationData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                    <div style={styles.legendContainer}>
                        <span style={{ color: "#FC9C66" }}>
                            Annulation {cancelState?.cancellationRate || 0}%
                        </span>
                        <span style={{ color: "#3CD278" }}>
                            Réservation{" "}
                            {cancelState?.otherStatusBookingsRate || 0}%
                        </span>
                    </div>
                </div>
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

export default ConversionState;

// Composant personnalisé pour le bouton DatePicker
const CustomDateButton = React.forwardRef(({ value, onClick }, ref) => (
    <button style={styles.button} onClick={onClick} ref={ref}>
        {value} 📅
    </button>
));

// Styles CSS-in-JS
const styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#F5F4FF",
    },
    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        flex: 1,
        textAlign: "center",
        position: "relative",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    button: {
        background: "#F1E4FF",
        border: "none",
        borderRadius: "10px",
        padding: "5px 10px",
        fontSize: "14px",
        cursor: "pointer",
    },
    bigText: {
        fontSize: "26px",
        fontWeight: "bold",
        color: "#9B74F3",
    },
    unit: {
        fontSize: "18px",
        fontWeight: "normal",
        color: "#6F6F6F",
    },
    legendContainer: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "10px",
    },
    detail: {
        textAlign: "left",
    },
};
