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
import { all } from "axios";

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
        const formattedData = data.map((user) => ({
            "Adresse Email": user.email,
            "Membre Depuis": new Date(user.createdAt).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Newsletter");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        const link = document.createElement("a");
        const url = URL.createObjectURL(dataBlob);
        link.href = url;
        link.download = fileName + ".xlsx";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
    let params = {
        page: pagination.page,
        limit: 12,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
    };
    const filtreByDate = (data) => {
        params = {
            ...params,
            fromDate: data[0],
            toDate: data[1],
        };
        fetchNewsletter();
    };
    const getNewsletters = async () => {
        setLoading(true);
        let params = {
            all: true,
            admin_search:filtertext,
        };
        const filteredObject = filterNullUndefinedValues(params);
        const res = await getNewsletter(filteredObject, headers);
        console.log("newletter params",params);
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
      
        setLoading(false);
        return res.data;
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
                                onClick={async() => {
                                    const data = await getNewsletters();
                                    const fileName = "newsletter";
                                    if (!data || data.length <0 ) return;
                                    exportToCSV(data, fileName);
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
                > </Header>
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
