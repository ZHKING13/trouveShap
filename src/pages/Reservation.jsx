import { Tag } from "antd";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
import TableComponent from "../components/Table";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
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
                    <p>{text}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.location}
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
        title: "Prix / nuits",
        dataIndex: "prix",
        key: "prix",
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
        key: "date",
        dataIndex: "date",
        render: (text) => <span>{text}</span>,
        responsive: ["lg"],
    },
    {
        title: "Réservations",
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
    return (
        <main>
            <Header title={"RESERVATION"} path={"Réservations"} />
            <DataTable column={columns} />
        </main>
    );
}
export default Reservation;