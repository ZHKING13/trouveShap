import { Button, Space, Spin, notification, DatePicker, Drawer, Divider, Checkbox } from "antd";
import DataTable, { FormatDate } from "../components/DataTable";
import Header from "../components/Header";
import { DATA3 } from "../data";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { getNewsletter,getAdminLogs, API_URL, getActionLogs, getAllAdmins } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FilterBoxe from "../components/FilterBoxe";
import { filterNullUndefinedValues } from "./Reservation";
import exportFromJSON from "export-from-json";
const { RangePicker } = DatePicker;
import * as XLSX from "xlsx";
import { all } from "axios";
import { Icon } from "../constant/Icon";

const filterEmptyValues = (obj) => {
    const filteredObject = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (Array.isArray(value) && value.length > 0) {
                filteredObject[key] = value;
            } else if (typeof value === 'string' && value.trim() !== '') {
                filteredObject[key] = value;
            } else if (typeof value === 'boolean') {
                filteredObject[key] = value;
            }
        }
    }
    return filteredObject;
};
function Logs() {
    const [loading, setLoading] = useOutletContext();
     const [showModal, setShowModal] = useState({
        deletModal: false,
        filterModal: false,
       
    });
    const [logs, setLogs] = useState([]);
    const [action,setAction]= useState([])
    const [admin,setAdmin ]= useState([])
    const [filtertext, setFilterText] = useState("");
    const [dateRange, setDateRange] = useState({
        fromDate: null,
        toDate: null,
    });
    const [filterValue, setFilterValue] = useState({
        status: "",
        actions: [],
        admins: [],
        fromDate: "",
        toDate: "",
        reset:false
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
    const togleDate =(dates) => {
                        console.log("result", dates)
                         if (dates && dates.length === 2) {
      const [start, end] = dates;
      setFilterValue({
        ...filterValue,
        fromDate: start.toISOString(),
        toDate: end.toISOString()
    });
    } else {
      console.log("No dates selected");
    }
    }
    const toggleActivitiesIds = (checkedValues) => {
    setFilterValue({
      ...filterValue,
      actions: checkedValues
    });
  };
    const toggleType = (checkedValues) => {
    setFilterValue({
      ...filterValue,
      admins: checkedValues
    });
  };
    const exportToCSV = (data, fileName) => {
        console.log("dattt",data)
        const formattedData = data.logs.map((log) => ({
            "Action": log?.action,
            "Details": log?.details,
            "Membre Depuis": new Date(log.createdAt).toLocaleDateString(),
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
            title: "Nom et prénoms de l’admin",
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
                        src={`${API_URL}/assets/uploads/avatar/${record?.user?.avatar}`}
                        alt=""
                        
                    />
                    <div>
                       
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record?.user?.firstname}  {record?.user?.lastname}
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
            title: "Type d’actions",
            key: "action",
            dataIndex: "action",
            render: (text) => <span>{text}</span>,
            responsive: ["lg"],
        },
        {
            title: "Details",
            key: "details",
            dataIndex: "details",
          render: (text) => <span style={{
              maxWidth:"60px"
            }}>{text}</span>,
            responsive: ["lg"],
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
        fromDate: filterValue.fromDate,
        toDate: filterValue.toDate,
        actions: filterValue.actions,
        admins: filterValue.admins
    };
    
    const getLogs = async () => {
        setLoading(true);
      
        const filteredObject = filterEmptyValues(params);
        const res = await getAdminLogs(headers, filteredObject);
        console.log("body",filterValue)
        console.log(res);

        if (res.status !== 201) {
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
    const fetchLogs = async () => {
        setLoading(true);
        
        const filteredObject =await filterEmptyValues(params);
               console.log("log params",filteredObject);

        let action = getActionLogs(headers)
        let admin = getAllAdmins(headers)
        const log =  getAdminLogs(headers, filteredObject);
         const [ret, res,rest] = await Promise.all([action, log,admin]);
        console.log(res);
        console.log("action type", filteredObject);
        setAction(ret.data)
        setAdmin(rest?.data)

        if (res.status !== 201) {
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
        setLogs(res.data.logs);
        setPagination({
            ...pagination,
            total: res.data.totalLogs,
        });
        setLoading(false);
    };
    useEffect(() => {
        fetchLogs();
    }, [pagination.page,filterValue.reset]);
    return (
        <main>
            <>
                {contextHolder}
                <Header
                    title={"LOGS"}
                    path={"logs"}
                    children={
                        <Space size={"large"}>
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                style={{
                                    backgroundColor: "#ECE3FF",
                                    border: "none",
                                    color: "rgba(162, 115, 255, 1)",
                                    borderRadius: "100px",
                                    padding: "4px 12px",
                                    height: "40px",
                                    fontWeight:"bold"
                                }}
                                onClick={async() => {
                                    const data = await getLogs();
                                    const fileName = "logs";
                                    if (!data || data.length <0 ) return;
                                    exportToCSV(data, fileName);
                                }}
                            >
                                Exporter
                            </Button>
                            <Button
                                onClick={async() => {
                                   setShowModal({
                                            ...showModal,
                                            filterModal: true,
                                        });
                                }}
                                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 12px",
                 height: "40px",
                 fontWeight:"bold",
                                    
                borderRadius: "31px",
                boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
                background: "#fff",
                gap: "10px",
            }}
            
            >
                                
                            <img
                                
                                   
                                    src={Icon.filter}
                                    alt="filter icon"
                                />
                                <span>Filtres</span>
                           </Button>
                        </Space>
                    }
               /> 
                <FilterModal
                    action={action}
                    admin={admin}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                 toggleType={toggleType}
                    
                    filterValue={filterValue}
                    onConfirme={fetchLogs}
                       
                       
                       
                        toggleActivitiesIds={toggleActivitiesIds}
                        togleDate={togleDate}
                       
                />
                <DataTable
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                        pageSize: 12,
                    }}
                    column={columns}
                    data={logs}
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
}

export default Logs
export const FilterModal = ({
   
    setFilterValue,
    showModal,
    setShowModal,
    onConfirme,
    filterValue,
    filtResidence,
    toggleActivitiesIds,
    togleDate,
    action,
    toggleType,
    admin
}) => {
    return (
        <Drawer
            // onCancel={() => {
            //     setShowModal({ ...showModal, filterModal: false });
            // }}
            onClose={() => {
                setShowModal({ ...showModal, filterModal: false });
            }}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                const resetFilterValues = {
    
                                    status: "",
                                   
                                    fromDate: "",
                                    toDate: null,
                                    actions:[],
                                    admins: [],
                                    reset:!filterValue.reset
    
    
};
                                  setFilterValue(prevState => ({
        ...prevState,
        ...resetFilterValues
    }));
                                
                                console.log("reset value ::::",filterValue);
                                setShowModal({
                                    ...showModal,
                                    filterModal: false,
                                });
                                // onConfirme();

                                
                            }}
                            danger
                            type="text"
                        >
                            Tout effacer
                        </Button>
                        <Button onClick={() => {
                            setShowModal({
                                    ...showModal,
                                    filterModal: false,
                                });
                            onConfirme()
                        }} type="primary">
                            Chercher
                        </Button>
                    </div>
                </>
            }
            open={showModal.filterModal}
            style={{
                top: "20px",
                right:"10px"
            }}
        >
            <div className="top">
               
              
                <h3 style={{marginBottom:"10px"}}>Admin</h3>
                <Checkbox.Group  onChange={toggleType}
      value={filterValue.admins}>
      <Space direction="vertical">
                        {
                          admin &&  admin.map((item,id)=>{
                                return         <Checkbox key={id} value={item.id}>{item?.firstname} {item?.lastname} </Checkbox>

                            })
        }
      
        
      </Space>
           <Divider />
          </Checkbox.Group>
                <h3 style={{marginBottom:"10px"}}>Types d'actions</h3>
                <Checkbox.Group  onChange={toggleActivitiesIds}
      value={filterValue.actions}>
      <Space direction="vertical">
                        {
                            action.map((item,id) => {
                                return (<Checkbox key={id} value={item}>{item}</Checkbox>)
                            })
       }
        
      
        
      </Space>
          </Checkbox.Group>
           <Divider />
          <div style={{
                    width: "auto",
                    display:"flex",
                    flexDirection:"column",
                    gap:"10px"
                }}>
                    <h3>Date du log</h3>
                    <RangePicker onChange={togleDate} />
                </div>
            </div>
          
          
        </Drawer>
    );
};

const spaceStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
};
const subtitleSryle = {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    justifyContent: "space-around",
    fontSize: "12px",
    color: "#1B2559",
    fontWeight: "bold",
};
const listStyle = {
    fontWeight: "bold",
};