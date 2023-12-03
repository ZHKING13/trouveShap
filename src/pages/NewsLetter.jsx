import { Button, Space } from "antd";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
import { DATA3 } from "../data";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
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
    return (
        <main>
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
                    </Space>
                }
            ></Header>
            <DataTable column={columns} data={DATA3} />
        </main>
    );
}
export default NewsLetter