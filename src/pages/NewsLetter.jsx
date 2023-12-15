import { Button, Space, Spin, notification, DatePicker } from "antd";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
import { DATA3 } from "../data";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { getNewsletter } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FilterBoxe from "../components/FilterBoxe";
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
const NewsLetter = ({ test }) => {
    console.log(test);
    const [loading, setLoading] = useOutletContext();
    const [newsletter, setNewsletter] = useState([]);
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
    const fetchNewsletter = async () => {
        setLoading(true);
        const res = await getNewsletter(headers);
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
        setLoading(false);
    };
    useEffect(() => {
        fetchNewsletter();
    }, []);
    return (
        <main>
            < >
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
                               <FilterBoxe/>
                            </Space>
                        }
                    ></Header>
                    <DataTable column={columns} data={DATA3} />
                </>
            </>
        </main>
    );
};
export default NewsLetter;
