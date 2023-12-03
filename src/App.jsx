import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Menu, Tag } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    FileDoneOutlined,
    UserOutlined,
    DashOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

import logo from "./assets/logo_sm.png";
import icon from "./assets/build.png";
import build from "./assets/build1.png";
import check from "./assets/check.png";
import user from "./assets/users.png";
import wallet from "./assets/wallet.png";
import note from "./assets/note.png";
import Stats from "./components/Stats";
import LineChart from "./components/chart/Line";
import LineCharts from "./components/chart/Line";
import TableComponent from "./components/Table";
import BarCharts from "./components/chart/Bar";
import AreaCharts from "./components/chart/AreaChart";
import ChartHeader from "./components/CharteHeader";
import DataTable from "./components/DataTable";
import TabsComponent from "./components/Tabs";
function App() {
    const [count, setCount] = useState(0);
    const [activeItem, setActiveItem] = useState("/residence");
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const items = [
        getItem("Home", "sub1", <HomeOutlined size={32} />, null),
        getItem("Residence", "/residence", <img src={icon} />),
        getItem("Reservation", "/reservation", <FileDoneOutlined />),
        getItem("Profil", "/profil", <UserOutlined />),
    ];
    const onClick = (e) => {
        console.log("click ", e);
        setActiveItem(e.key);
    };
    return (
        <>
            <div className="mainContainer">
                <div className="sideBar">
                    <div className="logoContainer">
                        <img src={logo} alt="" />
                    </div>
                    <Menu
                        style={{
                            height: "100vh",
                            width: "256px",
                        }}
                        onClick={onClick}
                        selectedKeys={[activeItem]}
                        itemActiveBg="#A273FF"
                        mode="vertical"
                        theme="light"
                        items={items}
                    />
                </div>
                <>
                    <Outlet />
                </>
            </div>
            <TabsComponent/>

        </>
    );
}

export default App;
