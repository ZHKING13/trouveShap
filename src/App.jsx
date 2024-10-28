import { useEffect, useState } from "react";
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
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import logo from "./assets/logo_sm.png";
import icon from "./assets/build.png";
import users from "./assets/Frame.png";
import log from "./assets/log.png";
import check from "./assets/checkfil.png";
import user from "./assets/user.png";
import inbox from "./assets/inbox.png";
import home from "./assets/home.png";
import TabsComponent from "./components/Tabs";
import { Icon } from "./constant/Icon";
import CurrencySelector from "./components/CurrencieModal";
import { getCurrenciesList } from "./feature/API";
export const getCurrencyId = async () => {
    const curency = localStorage.getItem("currenciData");
    const parsedCurrency = JSON.parse(curency);

    console.log(curency)
    return parsedCurrency ? parsedCurrency.id : 1;
}
function App() {
    const [count, setCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const [currencies, setCurrencies] = useState([]);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
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
  const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
const getCurrencyList = async() => {
    const res = await getCurrenciesList( headers);
    if (res.status !== 200) {
       
        return;
    }
    console.log(res);
    setCurrencies(res.data);
}
    const items = [
        {
            label: <Link href="/">Home</Link>,
            key: "/",
            icon: <img src={home} />,
        },
        {
            label: <Link to="/users">Utilisateur</Link>,
            key: "users",
            icon: <img src={users} />,
        },
        {
            label: <Link to="/residence">Residence</Link>,
            key: "residence",
            icon: <img src={icon} />,
        },
        {
            label: <Link to="/reservation">Reservation</Link>,
            key: "reservation",
            icon: <img src={check} />,
        },
        {
            label: <Link to="/remboursement">Remboursement</Link>,
            key: "remboursement",
            icon: <img src={check} />,
        },
        {
            label: <Link to="/newsletter">Newsletter</Link>,
            key: "newsletter",
            icon: <img src={inbox} />,
        },
        {
            label: <Link to="/carte">Afficher la carte</Link>,
            key: "/cartes",
            icon: <img src={Icon.map} />,
        },
        {
            label: <Link to="/profil">Profil</Link>,
            key: "profil",
            icon: <img src={user} />,
        },
        {
            label: <Link to="/admins">Admin</Link>,
            key: "admins",
            icon: <img src={Icon.admin} />,
        },
        {
            label: <Link to="/logs">Logs</Link>,
            key: "logs",
            icon: <img src={Icon.logs} />,
        },
         {
            label: <p >Devise</p>,
            key: "devise",
            icon: <img style={{
                width:"25px",
                height:"25px"
            }} src="./devise.png" />,
        },
        {
            label: <Link to="/login">Deconnexion</Link>,
            key: "login",
            icon: <img src={log} />,
        },
       
    ];
    const onClose = () => {
        setShowCurrencyModal(false);
    };
    const onConfirm = (selectedCurrency) => {
        // get currencie object from array
        const currency = currencies.find((item) => item.code === selectedCurrency);
        localStorage.setItem("currenciData", JSON.stringify(currency));
        localStorage.setItem("currency", selectedCurrency);
        setShowCurrencyModal(false);
    };
    const onClick = (e) => {
        if (e.key == "login") {
            localStorage.clear();
             navigate("/login");
            return
        }
        if (e.key == "devise") {
            setShowCurrencyModal(true);
            return
        }
        navigate(e.key);
    };
    useEffect(() => {
    getCurrencyList();
  }, []);
    return (
        <Spin spinning={loading} tip="Chargement des données...">
            <div className="mainContainer">
                <div className="sideBar">
                    <div className="logoContainer">
                        <img src={logo} alt="" />
                    </div>
                    {
                        showCurrencyModal && <CurrencySelector currencies={currencies} onClose={onClose} onConfirm={ onConfirm} />
                    }

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
