import React from "react";
import { Table, Tag } from "antd";
import { DATA2 } from "../data";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

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
        render: (_, record) => <Tag color="success">delete</Tag>,
        responsive: ["lg"],
    },
];

const DataTable = () => {
    return (
        <Table
            style={{
                backgroundColor: "#fff",
                borderRadius: "18px",
                padding: "10px",
            }}
            size="small"
            bordered={false}
            columns={columns}
            dataSource={DATA2}
            pagination={{
                pageSize: 4,
                
            }}
        />
    );
};

export default DataTable;
