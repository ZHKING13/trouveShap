// creer la page d'accueil

import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Tag } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    FileDoneOutlined,
    UserOutlined,
    DashOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo_sm.png";
import icon from "../assets/build.png";
import build from "../assets/build1.png";
import check from "../assets/check.png";
import user from "../assets/users.png";
import wallet from "../assets/wallet.png";
import note from "../assets/note.png";
import Stats from "../components/Stats";
import LineChart from "../components/chart/Line";
import LineCharts from "../components/chart/Line";
import TableComponent from "../components/Table";
import BarCharts from "../components/chart/Bar";
import AreaCharts from "../components/chart/AreaChart";
import ChartHeader from "../components/CharteHeader";
import Header from "../components/Header";
import DataTable from "../components/DataTable";
const Home = () => {
    return (
        <main>
            <Header title={"ACCUEIL"} />
            <div className="stats">
                <Stats
                    title="Gains mensuel"
                    subtitle="245.3K"
                    children="XOF"
                    icon={note}
                />
                <Stats
                    title="Résidences totales"
                    subtitle={2935}
                    icon={build}
                />
                <Stats
                    title="Réservations totales"
                    subtitle={1857}
                    icon={check}
                />
                <Stats
                    title="Nombre de visiteurs"
                    subtitle={1255}
                    icon={user}
                />
                <Stats
                    title="Portefeuille"
                    subtitle="320K"
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
                        <p>250.5K</p>
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
                            <Tag color="#A" style={{ color: "white" }}></Tag>
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
            <DataTable />
        </main>
    );
}
export default Home;