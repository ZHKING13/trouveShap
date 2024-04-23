import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import FilterBoxe from "../components/FilterBoxe";
import DataTable, { renderColor, renderIcon } from "../components/DataTable";
import { Select, notification, Tag, Button } from "antd";
import { filterNullUndefinedValues, FormatDate } from "./Reservation";
import { API_URL, getUsers, getUsersStats } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    DownloadOutlined,
    UploadOutlined,
    LineChartOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import Stats from "../components/Stats";
import { Icon } from "../constant/Icon";
import { all } from "axios";
import userAvatarNotFound from "../assets/user_avatar_not_found.png";

export default function Users() {
    const [filtertext, setFilterText] = useState("");
    const [reservation, setReservation] = useState([]);
    const [spin, setSpin] = useState(false);
    const [loading, setLoading] = useOutletContext();
    const [usersStats, setUsersStats] = useState({
        hosts: 0,
        travelers: 0,
        weekEvolutionPercent: 0,
        monthEvolutionPercent: 0,
        yearEvolutionPercent: 0,
    });
    const [status, setStatus] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        total: 7,
    });
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const columns = [
        {
            title: "Nom d'utilisateur",
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
                    {record.avatar != null ? (
                        <img
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                            }}
                            src={`${API_URL}/assets/uploads/avatars/${record?.avatar}`}
                            alt="user avatar"
                        />
                    ) : (
                        <img
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                            }}
                            src={userAvatarNotFound}
                            alt="user avatar"
                        />
                    )}

                    <div>
                        <p>
                            {" "}
                            {record.firstname} {record.lastname}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Adresse email",
            dataIndex: "email",
            key: "email",
            render: (text, record) => (
                <div>
                    <p>{record.email}</p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Numero de telephone",
            dataIndex: "phone",
            key: "phone",
            render: (text, record) => (
                <div>
                    <p>{record.contact}</p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Document",
            key: "docs",
            dataIndex: "docs",
            render: (text, record) =>
                record?.avatar == null ? (
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
                        href={`${API_URL}/assets/uploads/avatars/${record.avatar}`}
                        download={record?.avatar}
                        target="_blank"
                    >
                        <img src={Icon.doc} /> {record?.avatar}
                    </a>
                ),
            responsive: ["md"],
        },
        {
            title: "Membre depuis",
            dataIndex: "date",
            key: "createdAt",
            render: (text, record) => (
                <span>{FormatDate(record.createdAt)}</span>
            ),
            responsive: ["md"],
        },

        {
            title: "Statut",
            key: "status",
            render: (_, record) => (
                <Tag
                    icon={renderIcon(record.enableHost ? "Hote" : "Client")}
                    color={record.enableHost ? "#FFFBEB" : "#ECE3FF"}
                    key={record.profile}
                >
                    <p
                        style={{
                            color: record.enableHost ? "#F59E0B" : "#A273FF",
                        }}
                    >
                        {!record.enableHost ? "Voyageur" : "Hôte"}
                    </p>
                </Tag>
            ),
            responsive: ["md"],
        },
    ];
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    let params = {
        page: pagination.page,
        limit: 7,

        type: status,
        admin_search: filtertext,
    };
    const fetchUsers = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log("params: ", filteredObject);
        const res = await getUsers(filteredObject, headers);
        console.log(res);
        if (res.status === 500) {
            openNotificationWithIcon(
                "error",
                res.data?.message || "Erreur serveur",
                "merci de reessayer plus tard"
            );
            setLoading(false);
            return;
        }
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            setLoading(false);
            return;
        }
        console.log(res.data?.users);
        setReservation(res.data?.users);
        setPagination({
            ...pagination,
            total: res.data?.totalUsers,
        });
        setLoading(false);
    };

    const fetchStats = async () => {
        const res = await getUsersStats(headers);
        console.log(res);
        if (res.status === 500) {
            openNotificationWithIcon(
                "error",
                res.data?.message || "Erreur serveur",
                "merci de reessayer plus tard"
            );
            return;
        }
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            return;
        }
        console.log(res?.data);
        setUsersStats({
            hosts: res?.data?.hosts,
            travelers: res?.data?.travelers,
            weekEvolutionPercent: res?.data?.weekEvolutionPercent,
            monthEvolutionPercent: res?.data?.monthEvolutionPercent,
            yearEvolutionPercent: res?.data?.yearEvolutionPercent,
        });
    };
    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, [pagination.page, status, filtertext]);
    return (
        <main>
            <>
                {contextHolder}
                <Header title={"Utilisateurs"} path={"Utilisateurs"} />
                <div className="stats">
                    <Stats
                        title="Nombre de voyageurs"
                        subtitle={usersStats.travelers}
                        icon={Icon.users}
                    />
                    <Stats
                        title="Nombre d'hôtes"
                        icon={Icon.user2}
                        subtitle={usersStats.hosts}
                    />
                    <Stats
                        title="Taux d'évolution de la semaine"
                        subtitle={usersStats.weekEvolutionPercent + "%"}
                        icon={Icon.user2}
                    />
                    <Stats
                        title="Taux d'évolution du mois"
                        subtitle={usersStats.monthEvolutionPercent + "%"}
                        icon={Icon.user2}
                    />
                    <Stats
                        title="Taux d'évolution de l'année"
                        subtitle={usersStats.yearEvolutionPercent + "%"}
                        icon={Icon.user2} />
                </div>
                <DataTable
                    column={columns}
                    data={reservation}
                    size={7}
                    onChange={({ current }) => {
                        setPagination({
                            ...pagination,
                            page: current,
                        });
                    }}
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                    }}
                    children={
                        <TableHeader
                            data={reservation}
                            page={pagination.page}
                            setStatus={setStatus}
                            filtertext={filtertext}
                            setFilterText={setFilterText}
                            setLoading={setLoading}
                            status={status}
                        />
                    }
                    header={() => {
                        return (
                            <p style={{ color: "#A273FF", fontWeight: "bold" }}>
                                Liste des utilisateurs
                            </p>
                        );
                    }}
                />
            </>
        </main>
    );
}
const TableHeader = ({
    data,
    page,
    setStatus,
    filtertext,
    setFilterText,
    setLoading,
    status,
   
}) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    let params = {
        type: status,
        admin_search: filtertext,
        all : true
    };
    const fetchUsers = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log("params export: ", filteredObject)
        const res = await getUsers(filteredObject, headers);
        console.log(res);
        if (res.status === 500) {
            openNotificationWithIcon(
                "error",
                res.data?.message || "Erreur serveur",
                "merci de reessayer plus tard"
            );
            setLoading(false);
            return;
        }
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            setLoading(false);
            return;
        }
        console.log(res.data?.users);

        setLoading(false);
        return res.data?.users;
    };
    const exportData = async () => {
        const data = await fetchUsers();
        const formattedData = data.map((user) => ({
            "Nom d'utilisateur": `${user.firstname} ${user.lastname}`,
            "Adresse Email": user.email,
            "Numéro de Téléphone": user.contact,
            "Membre Depuis": new Date(user.createdAt).toLocaleDateString(),
            "Type de compte": !user.enableHost ? "Voyageur" : "Hôte",
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        const link = document.createElement("a");
        const url = URL.createObjectURL(dataBlob);
        link.href = url;
        link.download = "utilisateurs" + ".xlsx";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    return (
        <div
            style={{
                display: "flex",
                alignItem: "center",
                padding: "7px",
                width: "100%",
                justifyContent: "space-between",
                paddingRight: "29px",
                alignContent: "center",
            }}
        >
            <>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minHeight: "50px",
                        borderRadius: "31px",
                        boxShadow:
                            "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",

                        gap: "10px",
                    }}
                    className="table-header"
                >
                    <input
                        type="text"
                        placeholder="chercher par nom"
                        value={filtertext}
                        onChange={(e) => {
                            setFilterText(e.target.value);
                        }}
                        style={{
                            border: "none",
                            outline: "none",
                            marginLeft: "6px",
                            background: "#F4F7FE",
                            borderRadius: "31px",
                            padding: "4px 16px",
                            minHeight: "30px",
                        }}
                    />
                    <Select
                        placeholder="Filtrer par rôle"
                        style={{ width: 180, marginRight: "13px" }}
                        allowClear
                        onChange={(value) => {
                            setStatus(value);
                            console.log("ok", value);
                        }}
                        size="large"
                        options={[
                            {
                                value: "Host",
                                label: "Hôte",
                            },

                            {
                                value: "Traveler",
                                label: "Voyageur",
                            },
                        ]}
                    />
                </div>
            </>

            <div
                style={{
                    marginTop: "10px",
                }}
            >
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    style={{
                        backgroundColor: "#ECE3FF",
                        border: "none",
                        color: "rgba(162, 115, 255, 1)",
                        borderRadius: "100px",
                        padding: "4px 8px",
                    }}
                    onClick={() => {
                        data.length > 0
                            ? exportData(data, `utilisateur_page${page}`)
                            : null;
                    }}
                >
                    Exporter
                </Button>
            </div>
        </div>
    );
};
