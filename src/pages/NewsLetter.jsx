import { Button, Space, Spin, notification, DatePicker } from "antd";
import DataTable, { FormatDate } from "../components/DataTable";
import Header from "../components/Header";
import { DATA3 } from "../data";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { getNewsletter } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FilterBoxe from "../components/FilterBoxe";
import { filterNullUndefinedValues } from "./Reservation";
const { RangePicker } = DatePicker;
const columns = [
    {
        title: "Adresse email",
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
                <div>
                    <p>{text}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.email}
                    </p>
                </div>
            </div>
        ),
    },

    {
        title: "Date d'ajout",
        key: "date",
        dataIndex: "date",
        render: (text) => <span>{text}</span>,
    },
];
const NewsLetter = () => {
    const [loading, setLoading] = useOutletContext();
    const [newsletter, setNewsletter] = useState([]);
    const [filtertext, setFilterText] = useState("");
    const [dateRange, setDateRange] = useState({
        fromDate: null,
        toDate: null,
    });
     const [pagination, setPagination] = useState({
         page: 1,
         total: 7,
     });
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const columns = [
        {
            title: "Adresse email",
            dataIndex: "email",
            key: "email",
            render: (text, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    {text}
                </div>
            ),
        },

        {
            title: "Date d'ajout",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["lg"],
        },
    ];
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: pagination.page,
        limit: 12,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
    };
    const fetchNewsletter = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
console.log(filteredObject)
        const res = await getNewsletter(filteredObject, headers);
        console.log(res);

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
        setNewsletter(res.data);
        setPagination({
            ...pagination,total: res.data.length
        })
        setLoading(false);
    };
    useEffect(() => {
        fetchNewsletter();
    }, [pagination.page]);
    return (
        <main>
            <>
                {contextHolder}
                <Header
                    title={"NEWSLETTER"}
                    path={"Newsletter"}
                    children={
                        <Space>
                            <Button
                                icon={<DownloadOutlined />}
                                style={{
                                    backgroundColor: "#A273FF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "100px",
                                    padding: "4px 8px",
                                }}
                            >
                                Importer
                            </Button>
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
                            >
                                Exporter
                            </Button>
                            <FilterBoxe
                                handleSearch={setFilterText}
                                filtertext={filtertext}
                            />
                        </Space>
                    }
                ></Header>
                <DataTable
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                        pageSize: 12,
                    }}
                    column={columns}
                    data={newsletter.filter((item) => {
                        return item?.email
                            .toLowerCase()
                            .includes(filtertext.toLowerCase());
                    })}
                    size={12}
                    onChange={({ current }) => {
                        setPagination({
                            ...pagination,
                            page: current,
                        });
                    }}
                />
            </>
        </main>
    );
};
export default NewsLetter;
