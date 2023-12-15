import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Menu, Spin, Tag } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    FileDoneOutlined,
    UserOutlined,
    DashOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import logo from "./assets/logo_sm.png";
import icon from "./assets/build.png";
import log from "./assets/log.png";
import check from "./assets/checkfil.png";
import user from "./assets/user.png";
import inbox from "./assets/inbox.png";
import home from "./assets/home.png";
import TabsComponent from "./components/Tabs";
function App() {
    const [count, setCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const activeKeyFromUrl = location.pathname.replace("/", "") || "/";
    const [activeItem, setActiveItem] = useState(activeKeyFromUrl);

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
        const [loading, setLoading] = useState(false);

    const items = [
        getItem("Home", "/", <img src={home} />, null),
        getItem("Residence", "residence", <img src={icon} />),
        getItem("Reservation", "reservation", <img src={check} />),
        getItem("Remboursement", "remboursement", <img src={check} />),
        getItem("Newsletter", "newsletter", <img src={inbox} />),
        getItem("Profil", "profil", <img src={user} />),
        getItem("Deconnexion", "login", <img src={log} />),
    ];
    const onClick = (e) => {
        navigate(e.key);
    };
    return (
        <Spin spinning={loading} tip="Chargement des données...">
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
                        selectedKeys={[activeKeyFromUrl]}
                        itemActiveBg="#A273FF"
                        mode="vertical"
                        theme="light"
                        items={items}
                    />
                </div>
                <section className="homRigContainer">
                    <Outlet context={[loading, setLoading]} />
                </section>
            </div>
            <div className="tabsNav">
                <TabsComponent />
            </div>
        </Spin>
    );
}

export default App;
