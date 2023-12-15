// creer la page d'accueil

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Menu, Spin, Tag, notification } from "antd";

import logo from "../assets/logo_sm.png";
import icon from "../assets/build.png";
import build from "../assets/build1.png";
import check from "../assets/check.png";
import user from "../assets/users.png";
import wallet from "../assets/wallet.png";
import note from "../assets/note.png";
import Stats from "../components/Stats";
import LineCharts from "../components/chart/Line";
import TableComponent from "../components/Table";
import BarCharts from "../components/chart/Bar";
import AreaCharts from "../components/chart/AreaChart";
import ChartHeader from "../components/CharteHeader";
import Header from "../components/Header";
import DataTable from "../components/DataTable";
import { getResidence, getStats } from "../feature/API";
export function formatAmount(number) {
    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(3).replace(/\.?0+$/, "") + "K";
    } else {
        return (number / 1000000).toFixed(3).replace(/\.?0+$/, "") + "M";
    }
}
const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useOutletContext();
    const [residence, setResidence] = useState([]);
    const [stats, setStats] = useState({
        getVisits: 0,
        getResidence: 0,
        getBooking: 0,
        getCompanyMoneyMonth: 0,
        getCompanyMoney: 0,
    });
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: 1,
        limit: 10,
    }
    const fetchSats = async () => {
        setLoading(true);
        const res = await getStats(headers);
        const resi = await getResidence(params,headers);
        console.log(resi);
        if (res.status !== 200 || resi.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            // localStorage.clear();
            // setTimeout(() => {
            //     navigate("/login");
            // }, 1500);
            return;
        }
        setStats(res.data);
        setResidence(resi.data.residences);
        setLoading(false);
        console.log(stats);
    };

    useEffect(() => {
        fetchSats();
    }, []);
    return (
        <>
            <main>
                <Header title={"ACCUEIL"} />
                {contextHolder}
                <div className="stats">
                    <Stats
                        title="Gains mensuel"
                        subtitle={formatAmount(stats.getCompanyMoneyMonth)}
                        children="XOF"
                        icon={note}
                    />
                    <Stats
                        title="Résidences totales"
                        subtitle={stats.getResidence}
                        icon={build}
                    />
                    <Stats
                        title="Réservations totales"
                        subtitle={stats.getBooking}
                        icon={check}
                    />
                    <Stats
                        title="Nombre de visiteurs"
                        subtitle={stats.getVisits}
                        icon={user}
                    />
                    <Stats
                        title="Portefeuille"
                        subtitle={formatAmount(stats.getCompanyMoney)}
                        icon={wallet}
                        children="XOF"
                    />
                </div>
                <div className="chartContainer">
                    <div className="left">
                        <div className="leftTitle">
                            <select
                                style={{
                                    height: "30px",
                                    borderRadius: "5px",
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "#F6F1FF",
                                    width: "100%",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    padding: "0 5px",
                                }}
                                name="periode"
                                id=""
                            >
                                <option value="">ce mois</option>
                                <option value="">cette semaine</option>
                                <option value="">cette année</option>
                            </select>
                        </div>
                        <div className="detail">
                            <p>{formatAmount(stats.getCompanyMoneyMonth)}</p>
                            <p className="gain">
                                Gain<span> +2,45%</span>
                            </p>
                        </div>
                    </div>
                    <div className="chart">
                        <LineCharts />
                    </div>
                </div>
                <div className="multipleTable">
                    <div className="leftTable">
                        <div className="legendTab">
                            <div className="title">
                                Historique de validation des résidences
                            </div>
                        </div>
                        <TableComponent />
                    </div>
                    <div className="midleChart">
                        <ChartHeader
                            subtitle={"Nombre de réservation"}
                            title={230}
                            span={<Tag color="#22C55E">+20</Tag>}
                            children={
                                <Tag
                                    color="#A"
                                    style={{ color: "white" }}
                                ></Tag>
                            }
                        />
                        <AreaCharts />
                    </div>
                    <div className="barChart">
                        <ChartHeader
                            subtitle={"Résumé du trafic"}
                            title={"1.243"}
                            span={"visiteur"}
                            children={<Tag color="#22C55E">+2,45%</Tag>}
                        />
                        <BarCharts />
                    </div>
                </div>
                <DataTable data={residence} />
            </main>
        </>
    );
};
export default Home;
