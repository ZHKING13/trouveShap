import React from "react";
import { Space, Table, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

const dataSource = [
    {
        key: "1",
        name: "Danubius regent hotel park",
        age: "Validé",
        date: "18 Fev 2023",
    },
    {
        key: "2",
        name: "Horizon UI Free",
        age: "En attente",
        date: "18 Jan 2023",
    },
    {
        key: "3",
        name: "Marketplace",
        age: "Refusé",
        date: "20 Sep 2022",
    },
    {
        key: "4",
        name: "Horizon UI Free",
        age: "Validé",
        date: "12 Août 2022",
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

const columns = [
    {
        title: "NOM",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "STATUS",
        dataIndex: "age",
        key: "age",
        render: (age) => (
            <Tag icon={renderIcon(age)} color={renderColor(age)} key={age}>
                {age}
            </Tag>
        ),
    },
    {
        title: "DATE",
        dataIndex: "date",
        key: "date",
        responsive: ["md"],
    },
];

const TableComponent = () => {
    return (
        <Table
            style={{
                backgroundColor: "#fff",
                
            }}
            size="small"
            bordered={false}
            columns={columns}
            pagination={false}
            dataSource={dataSource}
        />
    );
};

export default TableComponent;
