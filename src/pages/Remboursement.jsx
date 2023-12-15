import { useEffect, useState } from "react";
import DataTable, {
    FormatDate,
    renderColor,
    renderIcon,
} from "../components/DataTable";
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

import Map from "../components/Map";
import { getResidence } from "../feature/API";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterBoxe from "../components/FilterBoxe";
import { Icon } from "../constant/Icon";

const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
const Remboursement = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useOutletContext();
    const [filtertext, setFilterText] = useState("");
    const [residence, setResidence] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [current, setCurrent] = useState(1);
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
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
                        onClick={() => {
                            showDrawer(record);
                        }}
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
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.email}
                    </p>
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
            render: (_, record) => {
                return <img src={Icon.trash} alt="delet icon" />;
            },
            responsive: ["lg"],
        },
    ];
    const showDrawer = async (data) => {
        setSelectItem(data);
        let loc = {
            address: data.address,
            lat: parseInt(data.lat),
            lng: parseInt(data.lng),
        };
        setLocation(loc);
        console.log(selectItem);
        console.log(location);
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: current,
        fromDate: "2023-11-11T00:00:00.000Z",
        toDate: "2023-12-20T00:00:00.000Z",
    };
    const fetchResidence = async () => {
        setLoading(true);
        const res = await getResidence(params, headers);
        if (res.status !== 200) {
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
        setLoading(false);
        setResidence(res.data.residences);
    };
    useEffect(() => {
        fetchResidence();
    }, [current]);

    return (
        <main>
            <>
                <Header
                    title={"RESIDENCES"}
                    path={"Résidences"}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            filtertext={filtertext}
                        />
                    }
                />
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
                    <Map location={location} />
                </Drawer>
                <DataTable
                    data={residence.filter((item) => {
                        return item.name
                            .toLowerCase()
                            .includes(filtertext.toLowerCase());
                    })}
                    size={7}
                    onChange={({ current }) => {
                        setCurrent(current);
                    }}
                    column={columns}
                />
            </>
        </main>
    );
};
export default Remboursement;
