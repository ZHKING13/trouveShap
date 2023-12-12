import { Spin, Tag, notification } from "antd";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
import TableComponent from "../components/Table";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservation } from "../feature/API";
function FormatDate(dateStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", options);
}
const columns = [
    {
        title: "Résidences",
        dataIndex: "nom",
        key: "nom",
        render: (text, record) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <img src={record.img} alt="" />
                <div>
                    <p> {record.residence.name}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.residence.address}
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
                <p>{text}</p>
                <p style={{ fontSize: 12, color: "#888" }}>{record.email}</p>
            </div>
        ),
        responsive: ["md"],
    },
    {
        title: "Total",
        dataIndex: "prix",
        key: "price",
        render: (text, record) => <span> {record.residence.price} fcfa </span>,
        responsive: ["md"],
    },

    {
        title: "Date d'ajout",
        key: "date",
        dataIndex: "createdAt",
        render: (text) => <span>{FormatDate(text)}</span>,
        responsive: ["lg"],
    },
    {
        title: "Statut",
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
];
const renderIcon = (status) => {
    switch (status) {
        case "Validé":
            return <CheckCircleOutlined />;
        case "Refusé":
            return <CloseCircleOutlined />;
        case "En attente":
            return <ExclamationCircleOutlined />;
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
const Reservation = () => {
    const [loading, setLoading] = useState(false);
    const [reservation, setReservation] = useState([]);
    const [selectItem, setSelectItem] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const fetchReservation = async () => {
        setLoading(true);
        const res = await getReservation(headers);
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
        console.log(res);
        setReservation(res.data);
        setLoading(false);
    };
    useEffect(() => {
        fetchReservation();
    }, []);
    return (
        <main>
            <Spin
                size="large"
                spinning={loading}
                tip="Chargement des données...."
            >
                <>
                    <Header title={"RESERVATION"} path={"Réservations"} />
                    <DataTable column={columns} data={reservation} size={7} />
                </>
            </Spin>
        </main>
    );
};
export default Reservation;
