import React, { useEffect, useState } from "react";

import EarnStats from "./EarnStat";
import ReservationStats from "./ReservationStats";
import VisiteurStats from "./VisiteurStat";
import Portefuille from "./Portefeuill";
import { getCountStats } from "../../feature/API";
import { FaDownload } from "react-icons/fa";
import { ExcelExportService } from "../../feature/util";
import { MonthArray } from "../../data";
import { useOutletContext } from "react-router-dom";

const CroissanceStat = () => {
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [stats, setStats] = useState({});
    const [data, setData] = useState({});
    const [loading, setLoading] = useOutletContext();
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
                const stat = await getCountStats(headers, query);

                setStats(stat.data);
                setLoading(false);
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
    }, []);
    const handleExport = async () => {
        
          if (!data) return;
          setLoading(true);
    
    
          // feuille 1 : Durée moyenne de séjour
        const excelService = new ExcelExportService()
        for (const [key, values] of Object.entries(data)) {
            const dataToExport = values.map((item, index) => ({
                key: `${MonthArray[item.month -1]}`,
                value: item.count,
            }));

            await excelService.generateSheet(dataToExport, key,key,{maxWidth: 600});
        }
       
          setLoading(false);
          excelService.export("croissance-stats");
     };
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",

                backgroundColor: "#F8F9FC",
            }}
        >
            <div style={styles.container}>
                {/* Statistiques principales */}
                <div style={styles.statCards}>
                    <div style={styles.statCard}>
                        <p style={styles.statTitle}>Résidences totales</p>
                        <h2 style={styles.statValue}>
                            {" "}
                            {stats?.totalResidences || 0}{" "}
                        </h2>
                    </div>
                    <div style={styles.statCard}>
                        <p style={styles.statTitle}>Réservations totales</p>
                        <h2 style={styles.statValue}>
                            {stats?.totalBookings || 0}
                        </h2>
                    </div>
                </div>

                {/* Graphiques */}
                <div style={styles.chartsGrid}>
                    {/* Graphique des gains */}
                    <div style={styles.chartCard}>
                        <EarnStats data={data} setData={setData} />
                    </div>

                    {/* Réservations */}
                    <div style={styles.chartCard}>
                        <ReservationStats data={data} setData={setData} />
                    </div>

                    {/* Visiteurs */}
                    <div style={styles.chartCard}>
                        <VisiteurStats data={data} setData={setData} />
                    </div>

                    {/* Portefeuille */}
                    <div style={styles.chartCard}>
                        <Portefuille data={data} setData={setData} />
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={handleExport}
                    className="export-button"
                >
                    <FaDownload size={20} color="#9B74F3" /> Exporter les
                    résultats
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#F8F9FC",
        width: "100%",
    },
    statCards: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        flex: 1,
        margin: "0 10px",
    },
    statTitle: {
        fontSize: "14px",
        color: "#6B7280",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    chartsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },
    chartCard: {
        // background: "#fff",
        // padding: "10px",
        // borderRadius: "12px",
    },
    chartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    growthRate: {
        fontSize: "12px",
        color: "#6B7280",
    },
    yearSelector: {
        padding: "5px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
    },
};

export default CroissanceStat;
