// creer la page d'accueil

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
    Avatar,
    Button,
    Carousel,
    Divider,
    Drawer,
    Space,
    Tag,
    notification,
    Spin,
    Modal,
    Slider,
    Input,
    InputNumber,
    Image,
} from "antd";import { PictureOutlined } from "@ant-design/icons";

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
import { API_URL, getResidence, getStats, updateResidence } from "../feature/API";
import { ConfrimeModal, DeletModal, RejectModal } from "./Residence";
import { ImgModal } from "./Reservation";
import { Icon } from "../constant/Icon";
import Map from "../components/Map";

export function formatAmount(number) {
    if (number < 1000) {
        return number?.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(3).replace(/\.?0+$/, "") + "K";
    } else {
        return (number / 1000000).toFixed(3).replace(/\.?0+$/, "") + "M";
    }
}
const spaceStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
};
const subtitleSryle = {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    justifyContent: "space-around",
    fontSize: "12px",
    color: "#1B2559",
    fontWeight: "bold",
};
const listStyle = {
    fontWeight: "bold",
};
const Home = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [modalAray, setModalAray] = useState([]);
    const [imgModal, setImgModal] = useState(false);
    const [location, setLocation] = useState({})
    const [loading, setLoading] = useOutletContext();
    const [residence, setResidence] = useState([]);
    const [spin,setSpin]=useState(false)
    const [stats, setStats] = useState({
        getVisits: 0,
        getResidence: 0,
        getBooking: 0,
        getCompanyMoneyMonth: 0,
        getCompanyMoney: 0,
    });
    const [selectItem, setSelectItem] = useState(null);

    const [reason, setReason] = useState({
        rejectReason: "",
        acceptReason: "",
    });
    const [showModal, setShowModal] = useState({
        addModal: false,
        loading: false,
        rejectModal: false,
        deletModal: false,
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
        limit: 20,
    };
    const onConfirme = (data) => {
        setSelectItem(data);
        setShowModal({
            ...showModal,
            addModal: true,
        });
    };
    const showDrawer = async (data) => {
        setModalAray(data?.medias);
        setSelectItem(data);

        let loc = {
            address: data.address,
            lat: parseInt(data?.lat),
            lng: parseInt(data?.lng),
        };
        setLocation(loc);
        console.log(selectItem);
        console.log(location);
        setOpen(true);
    };
    const onHide = async(id,status) => {
        setSpin(true)
        const data = {
            status
        }
        const res = await updateResidence(id, data, headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
       
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = res.data.status
                }
                return item;
            });
        });
                setSpin(false)

        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + res.data.status
        );
        console.log(id);
    }
    const deletResidence = async (id) => {
        setShowModal({ ...showModal, loading: true });
        const header = {
            Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
            "refresh-token": localStorage.getItem("refreshToken"),
            "Content-Type": "application/json",
        };
        const formdata = new FormData();
        const { deletReason } = reason;
        formdata.append("reason", deletReason);
        let deleteReason = formdata.get("reason");

        console.log(formdata);

        if (deleteReason == "") {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                "merci de remplir le champ raison"
            );
            setShowModal({ ...showModal, loading: false });
            return;
        }
        const res = await deleteResidence(id, formdata, header);

        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            setShowModal({ ...showModal, loading: false });
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setShowModal({ ...showModal, loading: false });
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été desactivé"
        );
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = "Désactivé";
                }
                return item;
            });
        });
        setShowModal({ ...showModal, deletModal: false });
        setReason({
            ...reason,
            deletReason: "",
        });
        // setResidence(res.data.residences);
    };
    const onCancel = (data) => {
        setSelectItem(data);
        setShowModal({
            ...showModal,
            rejectModal: true,
        });
    };
    const updateResidences = async (id, status, reason) => {
        setShowModal({ ...showModal, loading: true });
        const formeData = {
            status,
            reason,
        };
        console.log(selectItem);
        console.log(formeData);
        if (reason == "") {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                "merci de remplir le champ raison"
            );
            setShowModal({ ...showModal, loading: false });
            return;
        }
        const res = await updateResidence(id, formeData, headers);
        setShowModal({ ...showModal, loading: false });
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
             localStorage.clear();
             setTimeout(() => {
                 navigate("/login");
             }, 1500);
            return;
        }
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = res.data.status;
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + res.data.status
        );

        setShowModal({ ...showModal, addModal: false, rejectModal: false });
        setReason({
            ...reason,
            acceptReason: "",
            rejectReason: "",
        });
    };
    const fetchSats = async () => {
        setLoading(true);
        const res = await getStats(headers);
        const resi = await getResidence(params, headers);
        console.log(resi);
        if (res.status !== 200 || resi.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
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
                        subtitle={formatAmount(stats?.getCompanyMoneyMonth)}
                        children="XOF"
                        icon={note}
                    />
                    <Stats
                        title="Résidences totales"
                        subtitle={stats?.getResidence}
                        icon={build}
                    />
                    <Stats
                        title="Réservations totales"
                        subtitle={stats?.getBooking}
                        icon={check}
                    />
                    <Stats
                        title="Nombre de visiteurs"
                        subtitle={stats?.getVisits}
                        icon={user}
                    />
                    <Stats
                        title="Portefeuille"
                        subtitle={formatAmount(stats?.getCompanyMoney)}
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
                            title={stats?.getBooking}
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
                            title={stats?.getVisits}
                            span={"visiteur"}
                            children={<Tag color="#22C55E">+2,45%</Tag>}
                        />
                        <BarCharts />
                    </div>
                </div>
                <DeletModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    loading={showModal.loading}
                    onConfirme={() => {
                        console.log(selectItem);
                        deletResidence(selectItem.id);
                    }}
                    reason={reason}
                    setReason={setReason}
                />
                <DrawerComponent
                    showDrawer={showDrawer}
                    selectItem={selectItem}
                    onClose={() => setOpen(false)}
                    setImageModal={setImgModal}
                    open={open}
                />
                <ImgModal
                    setOpen={setImgModal}
                    open={imgModal}
                    tab={modalAray}
                />
                <RejectModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    loading={showModal.loading}
                    reason={reason}
                    setReason={setReason}
                    onConfirme={() => {
                        updateResidences(
                            selectItem.id,
                            "rejected",
                            reason.rejectReason
                        );
                    }}
                />
                <ConfrimeModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    loading={showModal.loading}
                    onConfirme={() => {
                        updateResidences(
                            selectItem.id,
                            "accepted",
                            reason.acceptReason
                        );
                    }}
                    reason={reason}
                    setReason={setReason}
                />
                <DataTable
                    onConfirm={onConfirme}
                    onCancel={onCancel}
                    data={residence}
                    onHide={onHide}
                    spin={spin}
                    showDrawer={showDrawer}
                    onDelet={(data) => {
                        setSelectItem(data);
                        setShowModal({ ...showModal, deletModal: true });
                    }}
                />
            </main>
        </>
    );
};
export default Home;
const DrawerComponent = ({ open, selectItem, setImageModal, onClose }) => {
    return (
        <Drawer
            onClose={onClose}
            placement="right"
            destroyOnClose={true}
            open={open}
        >
            <div
                style={{
                    position: "relative",
                }}
                className="top"
            >
                <Carousel autoplay>
                    {selectItem &&
                        selectItem.medias.map((item) => (
                            <div key={item.filename}>
                                <Image
                                    style={{
                                        height: "156px",
                                        objectFit: "cover",
                                        resizeMode: "cover",
                                    }}
                                    width={320}
                                    src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                                    alt=""
                                    className="carouselImg"
                                />
                            </div>
                        ))}
                </Carousel>
                <div
                    onClick={() => setImageModal(true)}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        color: "#000",
                        padding: "10px 18px ",
                        backgroundColor: "#fff",
                        borderRadius: "100px",
                        cursor: "pointer",
                    }}
                >
                    <span>
                        <PictureOutlined /> +
                        {selectItem && selectItem.medias.length} photos
                    </span>
                </div>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {selectItem && selectItem.name}
            </h2>
            <span>{selectItem && selectItem.address}</span>
            <Divider />
            <div className="price">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectItem && selectItem.price} fcfa / nuits
                </h2>
                <p>Prix</p>
            </div>
            <Divider />
            <div
                style={{
                    display: "flex",

                    alignItems: "center",
                }}
                className="user"
            >
                <Avatar
                    src={`${API_URL}/assets/uploads/avatars/${selectItem?.host?.avatar}`}
                    size={64}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                    }}
                >
                    <p>Hôte</p>
                    <h3
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectItem && selectItem.host.firstname}{" "}
                        {selectItem && selectItem.host.lastname}
                    </h3>
                </div>
            </div>
            <Divider />
            <div orientation="vertical">
                <h2>Comodités</h2>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                        marginTop: "10px",
                    }}
                >
                    <Space className="comodite">
                        <img src={Icon.clim} /> Climatisation
                    </Space>
                    <Space className="comodite">
                        <img src={Icon.tv} /> Télévision
                    </Space>
                    <Space className="comodite">
                        <img src={Icon.wash} /> Lave linge
                    </Space>
                    <Space className="comodite">
                        <img src={Icon.wifi} /> Wifi
                    </Space>
                    <Space className="comodite">
                        <img src={Icon.refri} /> Réfrigérateur
                    </Space>
                    <Space className="comodite">
                        <img src={Icon.fan} /> Ventilateur
                    </Space>
                </div>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Aperçu
            </h2>
            <div
                style={{
                    display: "flex",

                    gap: "5px",
                    marginTop: "10px",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                    className="left"
                >
                    <div style={subtitleSryle} className="subti">
                        <img src={Icon.check} alt="" />
                        <p>Règlement interieur</p>
                    </div>
                    {selectItem?.rules?.map((item) => {
                        return <span>{item.rule?.title}</span>;
                    })}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                    className="rigth"
                >
                    <div style={subtitleSryle} className="subti">
                        <img src={Icon.check} alt="" />
                        <p>Type d’activités sociales</p>
                    </div>
                    <span>Baptêmes</span>
                    <span>Mariages</span>
                    <span>Anniversaires</span>
                </div>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Grille de remboursement
            </h2>
            <div>
                <ul>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Entre 1 et 3 mois avant le jour J
                        </li>
                        <span>
                            {selectItem?.refundGrid[
                                "Entre 1 mois et 3 mois avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Entre 1 semaine et 1 mois avant le jour J
                        </li>
                        <span>
                            {" "}
                            {selectItem?.refundGrid[
                                "Entre 1 semaine et 1 mois avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Entre 48h et 1 semaine avant le jour J
                        </li>
                        <span>
                            {" "}
                            {selectItem?.refundGrid[
                                "Entre 48h et 1 semaine avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Moins de 48 heures avant le jour J
                        </li>
                        <span>
                            {" "}
                            {selectItem?.refundGrid[
                                "Moins de 48 heures avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>
                            Plus de 3 mois avant le jour J
                        </li>
                        <span>
                            {" "}
                            {selectItem?.refundGrid[
                                "Plus de 3 mois avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                </ul>
            </div>
            <Divider />
            <Map location={location} />
        </Drawer>
    );
};
