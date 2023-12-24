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
import exportFromJSON from "export-from-json";
const { RangePicker } = DatePicker;
import * as XLSX from "xlsx";

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

    const exportToCSV = (data, fileName) => {
        exportFromJSON({ data, fileName, exportType: "csv" });
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
    const filtreByDate = () => {
        console.log("dateranded", dateRange);
        fetchNewsletter();
    };
    const fetchNewsletter = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log(filteredObject);
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
            ...pagination,
            total: res.data.length,
        });
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
                                    exportToCSV(
                                        newsletter,
                                        `newsLetter_page${pagination.page}`
                                    );
                                }}
                            >
                                Exporter
                            </Button>
                            <FilterBoxe
                                handleSearch={setFilterText}
                                filtertext={filtertext}
                                selectRange={filtreByDate}
                                placeHolder={"Rechercher par email"}
                                dateRange={dateRange}
                                setDateRange={setDateRange}
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
