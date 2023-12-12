import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
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
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wifi from "../assets/wifi.svg";
import clim from "../assets/clim.svg";
import tv from "../assets/tv.svg";
import wash from "../assets/wash.svg";
import refri from "../assets/refri.svg";
import trash from "../assets/trash.svg";
import fan from "../assets/fan.svg";
import Map from "../components/Map";
import { getResidence } from "../feature/API";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const renderIcon = (status) => {
    switch (status) {
        case "Validé":
            return <CheckCircleOutlined color="#fff" />;
        case "Refusé":
            return <CloseCircleOutlined color="#fff" />;
        case "En attente":
            return <ExclamationCircleOutlined color="#fff" />;
        default:
            return null;
    }
};

const renderColor = (status) => {
    switch (status) {
        case "Validé":
            return "#22C55E";
        case "Refusé":
            return "#EF4444";
        case "En attente":
            return "#F59F0B";
        default:
            return null;
    }
};
function FormatDate(dateStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", options);
}
const columns = [
    {
        title: "Résidences",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <img
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10%",
                    }}
                    src={`https://api.trouvechap.com/assets/uploads/residences/${record.medias[0].filename}`}
                    alt=""
                />
                <div>
                    <p>{text}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.address}
                    </p>
                </div>
            </div>
        ),
    },
    {
        title: "Hôte",
        dataIndex: "owner",
        key: "owner",
        render: (text, record) => (
            <div>
                <p>
                    {record.host.firstname} {record.host.lastname}
                </p>
                <p style={{ fontSize: 12, color: "#888" }}>{record.email}</p>
            </div>
        ),
        responsive: ["md"],
    },
    {
        title: "Prix / nuits",
        dataIndex: "price",
        key: "price",
        render: (text) => <span>{text} fcfa </span>,
        responsive: ["md"],
    },
    {
        title: "Moyen de paiement",
        key: "payment",
        dataIndex: "payment",
        render: (text) => <span>{text} </span>,
        responsive: ["md"],
    },
    {
        title: "Date d'ajout",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (text) => <span>{FormatDate(text)}</span>,
        responsive: ["lg"],
    },
    {
        title: "Status",
        key: "status",
        render: (_, record) => (
            <Tag
                icon={renderIcon(record.status)}
                color={renderColor(record.status)}
                key={record.status}
            >
                {record.status}
            </Tag>
        ),
        responsive: ["md"],
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => <img src={trash} alt="delet icon" />,
        responsive: ["lg"],
    },
];
const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
const Residence = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [residence, setResidence] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const showDrawer = async(data) => {
        setSelectItem(data);
        let loc = {
            address: data.address,
            lat: parseInt(data.lat),
            lng: parseInt(data.lng),
        }
        setLocation(loc);
        console.log(selectItem)
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const fetchResidence = async () => {
        setLoading(true);
        const res = await getResidence(headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 4000);
            return;
        }
        setLoading(false);
        setResidence(res.data.residences);
    };
    useEffect(() => {
        fetchResidence();
    }, []);
    return (
        <main>
            <Spin spinning={loading} size="large" tip="Chargement...">
                <>
                    <Header title={"RESIDENCES"} path={"Résidences"} />
                    {contextHolder}
                    <Drawer placement="right" onClose={onClose} open={open}>
                        <div
                            style={{
                                position: "relative",
                            }}
                            className="top"
                        >
                            <Carousel autoplay>
                                {selectItem &&
                                    selectItem.medias.map((item) => (
                                        <div>
                                            <img
                                                style={{
                                                    width: "100%",
                                                    height: "156px",
                                                    objectFit: "cover",
                                                    resizeMode: "cover",
                                                }}
                                                src={`https://api.trouvechap.com/assets/uploads/residences/${item.filename}`}
                                                alt=""
                                            />
                                        </div>
                                    ))}
                            </Carousel>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    right: "20px",
                                    color: "#000",
                                    padding: "10px 18px ",
                                    backgroundColor: "#fff",
                                    borderRadius: "100px",
                                }}
                            >
                                <span>
                                    <PictureOutlined /> +
                                    {selectItem && selectItem.medias.length}{" "}
                                    photos
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
                            <Avatar size={64} />
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
                                    <img src={clim} /> Climatisation
                                </Space>
                                <Space className="comodite">
                                    <img src={tv} /> Télévision
                                </Space>
                                <Space className="comodite">
                                    <img src={wash} /> Lave linge
                                </Space>
                                <Space className="comodite">
                                    <img src={wifi} /> Wifi
                                </Space>
                                <Space className="comodite">
                                    <img src={refri} /> Réfrigérateur
                                </Space>
                                <Space className="comodite">
                                    <img src={fan} /> Ventilateur
                                </Space>
                            </div>
                        </div>
                        <Divider />
                        <Map location={location} />
                    </Drawer>
                    <DataTable
                        onclick={(data) => {
                            showDrawer(data);
                        }}
                        columns={columns}
                        data={residence}
                        size={7}
                    />
                </>
            </Spin>
        </main>
    );
};
export default Residence;
