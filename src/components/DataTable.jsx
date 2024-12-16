import React, { useState } from "react";
import { Space, Table, Tag, Spin, Select } from "antd";
import { DATA2 } from "../data";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Icon } from "../constant/Icon";
import { useTranslation} from 'react-i18next';


export const renderIcon = (status) => {
    switch (status) {
        case "Validé":
            return <CheckCircleOutlined color="#fff" />;
        case "Hôte Payé":
            return <CheckCircleOutlined color="#fff" />;
        case "Acceptée":
            return <CheckCircleOutlined color="#fff" />;
        case "Activé":
            return <CheckCircleOutlined color="#fff" />;
        case "Terminée":
            return <CheckCircleOutlined color="#fff" />;
        case "Confirmée":
            return <CheckCircleOutlined color="#fff" />;
        case "Remboursée":
            return <CheckCircleOutlined color="#fff" />;
        case "Payée":
            return <CheckCircleOutlined color="#fff" />;
        case "Rejeté":
            return <CloseCircleOutlined color="#fff" />;
        case "Refusée":
            return <CloseCircleOutlined color="#fff" />;
        case "Annulée":
            return <CloseCircleOutlined color="#fff" />;
        case "Supprimé":
            return <CloseCircleOutlined color="#fff" />;
        case "Désactivé":
            return <CloseCircleOutlined color="#fff" />;
        case "En Cours":
            return <ExclamationCircleOutlined color="#fff" />;
        case "En Attente":
            return <ExclamationCircleOutlined color="#fff" />;
        default:
            return null;
    }
};
import { API_URL } from "../feature/API";
import { getStatusKeyFromValue } from "../constant/status";
import { getLanguageId } from "../App";

export const renderColor = (status) => {
    switch (status) {
        case "Validé":
            return "#22C55E";
        case "Client":
            return "#ECE3FF";
        case "Hote":
            return "#FFFBEB";

        case "Hôte Payé":
            return "#22C55E";
        case "Activé":
            return "#22C55E";
        case "Acceptée":
            return "#22C55E";
        case "Confirmée":
            return "#22C55E";
        case "Terminée":
            return "#22C55E";
        case "Rejeté":
            return "#EF4444";
        case "Rejetée":
            return "#EF4444";
        case "Refusée":
            return "#EF4444";
        case "Annulée":
            return "#EF4444";
        case "Supprimé":
            return "#EF4444";
        case "Désactivé":
            return "#EF4444";
        case "En Attente":
            return "#F59F0B";
        case "En Cours":
            return "#F59F0B";
        case "Remboursée":
            return "#A273FF";
        case "Payée":
            return "#A273FF";
        default:
            return null;
    }
};
export function FormatDate(dateStr) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    let lang = getLanguageId()
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang == "fr" ? "fr-FR": "en-US", options);
}
export const currencySign = ()=>{
        const curency = localStorage.getItem("currenciData");
    const parsedCurrency = JSON.parse(curency);
    if (parsedCurrency?.id == 4 || parsedCurrency?.id == 3) {
         return  parsedCurrency.sign + " "+ parsedCurrency.code;
    }
    return  parsedCurrency?.sign || "₣";

    }
const DataTable = ({
    column,
    data,
    size,
    onclick,
    onChange,
    pagination,
    loading,
    onConfirm,
    onCancel,
    onHide,
    spin,
    onDelet,
    showDrawer,
    children,
    header,
}) => {
    const { t, i18n } = useTranslation();
    const handleRowClick = (record) => {
        onclick && onclick(record);
    };
    const [selectItem, setSelectItem] = useState(null);

    const columns = [
        {
            title: t("menu.residence"),
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
                        src={`${API_URL}/assets/uploads/residences/${record?.medias[0]?.filename}`}
                        alt=""
                        onClick={() => (showDrawer ? showDrawer(record) : null)}
                    />
                    <div>
                        <p>{text}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record?.address}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: t("other.hote"),
            dataIndex: "owner",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>
                        {record?.host?.firstname} {record?.host?.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.price"),
            dataIndex: "price",
            key: "price",
            render: (text) => (
                <span>
                    {text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                    <span></span> { currencySign()}{" "}
                </span>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.document"),
            key: "docs",
            dataIndex: "docs",
            render: (text, record) =>
                record?.host?.identityDoc == null ? (
                    <span>non fournis</span>
                ) : (
                    <a
                        style={{
                            color: "#64748B",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                        href={`${API_URL}/assets/uploads/docs/${record.host.identityDoc}`}
                        download={record?.host?.identityDoc}
                        target="_blank"
                    >
                        <img src={Icon.doc} /> {record?.host?.identityDoc}
                    </a>
                ),
            responsive: ["md"],
        },
        {
            title: t("table.date"),
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["lg"],
        },
        {
            title: t("table.status"),
            key: "status",
            render: (_, record) => (
                <Tag
                    icon={renderIcon(record.status)}
                    color={renderColor(record.status)}
                    key={record.status}
                >
                    {t("status." + getStatusKeyFromValue(record.status))}
                </Tag>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.action"),
            key: "action",
            render: (_, record) => {
                return record.status == "Désactivé" ? (
                    <Spin spinning={selectItem?.id == record.id ? spin : null}>
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                onHide(record.id, "restored");
                            }}
                            src={Icon.eye}
                        />
                    </Spin>
                ) : record.status == "Activé" ? (
                    <Spin spinning={selectItem?.id == record.id ? spin : null}>
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                onDelet(record);
                            }}
                            src={Icon.eyeOf}
                        />
                    </Spin>
                ) : record.status == "En Attente" ? (
                    <Spin spinning={selectItem?.id == record.id ? spin : null}>
                        <Space
                            spinning={selectItem?.id == record.id ? spin : null}
                        >
                            <img
                                onClick={() => {
                                    setSelectItem(record);
                                    onConfirm(record);
                                }}
                                src={Icon.valid}
                            />
                            <img
                                onClick={() => {
                                    setSelectItem(record);
                                    onCancel(record);
                                }}
                                src={Icon.cancel}
                            />
                        </Space>
                    </Spin>
                ) : null;
            },
            responsive: ["lg"],
        },
    ];
    return (
        <div
            style={{
                backgroundColor: "#fff",
                borderRadius: "18px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItem: "center",
                    margin: "7px",
                    width: "100%",
                    justifyContent: "flex-end",
                    paddingRight: "29px",
                }}
            >
                {children}
            </div>
            {header && (
                <div
                    style={{
                        display: "flex",
                        alignItem: "center",
                        margin: "7px",
                        width: "100%",
                    }}
                >
                    {header}
                </div>
            )}

            <Table
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "18px",
                    padding: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)",
                }}
                rowKey={(record) => record.id}
                key={(record) => record.id}
                className="dataTable"
                size="small"
                bordered={false}
                columns={column ? column : columns}
                dataSource={data ? data : DATA2}
                pagination={{
                    pageSize: size ? size : 5,
                    ...pagination,
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
                onChange={onChange}
                loading={loading}
            />
        </div>
    );
};

export default DataTable;
