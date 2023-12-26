import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FormatDate, renderColor, renderIcon } from "./DataTable";
import { getStatusHistory } from "../feature/API";

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



const TableComponent = ({Data}) => {
    const columns = [
        {
            title: "NOM",
            dataIndex: "residence.name",
            key: "residence.name",
            render: (text, record) => <span>{record?.residence?.name}</span>,
        },
        {
            title: "STATUS",
            dataIndex: "newStatus",
            key: "newStatus",
            render: (text, record) => (
                <Tag
                    icon={renderIcon(text)}
                    color={renderColor(text)}
                    key={text}
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: "DATE",
            dataIndex: "createdAt",
            key: "createdAt",
            responsive: ["md"],
            render: (text) => <span>{FormatDate(text)}</span>,
        },
    ];
   
    return (
        <Table
            style={{
                backgroundColor: "#fff",
            }}
            size="small"
            bordered={false}
            columns={columns}
            pagination={false}
            dataSource={Data}
        />
    );
};

export default TableComponent;
