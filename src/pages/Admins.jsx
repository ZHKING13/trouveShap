import { Button, Space, Spin, notification, DatePicker, Switch, Modal, Divider, Form,
  Input,
  Upload,
  Select, } from "antd";
import DataTable, { FormatDate } from "../components/DataTable";
import Header from "../components/Header";
import { DATA3 } from "../data";
import { DownloadOutlined, UploadOutlined,PlusOutlined,EditOutlined,RedoOutlined } from "@ant-design/icons";
import { getNewsletter,getAdmins, API_URL,togleAdmin, addAdmin, getAllAdmins, getActionLogs, editAdmin, resetAdminPwd } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FilterBoxe from "../components/FilterBoxe";
import { filterNullUndefinedValues } from "./Reservation";
import exportFromJSON from "export-from-json";
const { RangePicker } = DatePicker;
import * as XLSX from "xlsx";
import axios, { all } from "axios";
import { Icon } from "../constant/Icon";
import Uploads from "../components/Upload";
const {Option} = Select
function Admins() {
    const initialFormData = {
    firstname: '',
    lastname: '',
    email: '',
    file: null,
    profile:"",
    reset:false
};
    const [loading, setLoading] = useOutletContext();
    const [id,setId]=useState(null)
    const [showModal, setShowModal] = useState({
        confirmModal: false,
        formModal: false,
        editModal: false,
        editConfirm: false,
        refresh:false
    })
    const [admins, setAdmins] = useState([]);
    const [filtertext, setFilterText] = useState("");
    const [dateRange, setDateRange] = useState({
        fromDate: null,
        toDate: null,
    });
    const [formData, setFormData] = useState(initialFormData);
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
 const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const exportToCSV = (data, fileName) => {
        const formattedData = data.map((user) => ({
            "Nom et Prenom": user.firstname + " " + user.lastname,
            "Adresse Email": user.email,
            "Numéro de telephone":user.contact,
            "Membre Depuis": new Date(user.createdAt).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Admin");

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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (info) => {
        console.log(info)
        // if (info.file.status === 'done') {
        // }
        setFormData({ ...formData, file: info.file.originFileObj });
    };
    const handleSubmit = async () => {
        setShowModal({
                                    ...showModal,
                                    confirmModal: false,
                                })
        setLoading(true)
  console.log("formData avant FormData::", formData);

    const form = new FormData();
    form.append('firstname', formData.firstname);
    form.append('email', formData.email);
    form.append('lastname', formData.lastname);
    form.append("profile", formData.profile);
    if (formData.file) {
        form.append('file', formData.file);
    }
        
    // Vérifier le contenu de form après ajout des données
    for (let pair of form.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
console.log("formdata::",form)
       let headers= {
                    'Content-Type': 'multipart/form-data',
                     Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
        }
        let res = await addAdmin(form, headers)
        console.log(res)
        if (res.status !== 201) {
            openNotificationWithIcon(
                "error",
                "Opps ",
                res?.data?.message
            );
            setLoading(false)
            return
        }
        setAdmins((prev) => {
            return [res.data, ...prev]
        })
        setLoading(false)
        openNotificationWithIcon(
                "success",
                "Success ",
                res?.data?.message
            );
    };
    const handlEdit = async () => {
        setLoading(true)
         let res = await editAdmin(id,formData, headers)
        console.log(res)
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Opps ",
                res?.data?.message
            );
            setLoading(false)
            return
        }
         let updateAdmin =  admins.map((item) => {
            if (item.id === id) {
               return res.data
            }
            return updateAdmin;
            })
            setAdmins(updateAdmin);
        setLoading(false)
        openNotificationWithIcon(
                "success",
                "Success ",
                res?.data?.message
            );
        
    }
    const resetPwd = async () => {
        setShowModal((prev) => {
            return {
                ...prev,
                refresh:false
            }
        })
        setLoading(true)
         let res = await resetAdminPwd(id, headers)
        console.log(res)
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Opps ",
                res?.data?.message
            );
            setLoading(false)
            return
        }
        setLoading(false)
        setFormData( initialFormData)
        openNotificationWithIcon(
                "success",
                "Success ",
                res?.data?.message
            );
        
    }
    const changeStatut =async(id,value) => {
           setLoading(true);
        let body = {
            enableAdmin:value
        };
        const res = await togleAdmin(id,headers);
        console.log("toggle admin body",body);
        console.log(res);

        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                res?.data.message
            );
            // localStorage.clear();
            // setTimeout(() => {
            //     navigate("/login");
            // }, 1500);
         let updateAdmin =  admins.map((item) => {
            if (item.id === id) {
               return { ...item, enableAdmin: value }
            }
            return updateAdmin;
            })
            setAdmins(updateAdmin);
            setLoading(false);
            return;
        }
        //    setFormData( initialFormData)
         let updateAdmin = admins.map((log) => {
    if (log.id === id) {
        return { ...log, enableAdmin: value }; // Met à jour la propriété `enableAdmin`
    }
    return log; // Retourne l'élément inchangé
});

setAdmins(updateAdmin);
        setLoading(false);
    }
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
                        src={record?.avatar}
                        alt=""
                        
                    />
                    <div>
                        {/* <p>{text}</p> */}
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record?.firstname} {record?.lastname}
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
            title: "Numéro de téléphone",
            key: "contact",
            dataIndex: "contact",
            render: (text) => <span>{text}</span>,
            responsive: ["lg"],
        },
        {
            title: "Localisation",
            key: "location",
            dataIndex: "location",
            render: (text) => <span>{text}</span>,
            responsive: ["lg"],
        },
        {
            title: "Date d'ajout",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["lg"],
        },
        {
            title: "Statut",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text, record) => <Switch defaultChecked={record?.enableAdmin} onChange={() => {
                changeStatut(record.id, !record.enableAdmin)
            }} />,
            responsive: ["lg"],
        },
        {
            title: "Action",
            key: "",
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <Space
                          size={"large"}  
                        >
                        <EditOutlined onClick={() => {
                            let data = {
                                firstname:record.firstname,
                                lastname:record.lastname,
                                email: record.email,
                                profile:record.profile
                            }
                            setId(record.id)
                            setFormData(data)
                            setShowModal({
                                ...showModal,
                                editModal:true 
                            })
                        }} style={{
                                cursor:"pointer"
                            }} />
                            <RedoOutlined onClick={() => {
                          
                            setId(record.id)
                            
                            setShowModal({
                                ...showModal,
                                refresh:true 
                            })
                        }} style={{
                                cursor:"pointer"
                            }}  />
                        </Space>
                ) 
            },
            responsive: ["lg"],
        },
    ];
   
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
        fetchAdmin();
    };
    

    const fetchAdmin = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log(filteredObject);
               let ret = await getAllAdmins(headers)
                    console.log("allADmin",ret);
        const res = await getAdmins(filteredObject,headers);
        console.log(res);
 

        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Session expiré",
                "merci de vous reconnecter"
            );
            // localStorage.clear();
            // setTimeout(() => {
            //     navigate("/login");
            // }, 1500);
            return;
        }
        setAdmins(res.data.users);
        setPagination({
            ...pagination,
            total: res.data.totalUsers,
        });
        setLoading(false);
        return res.data.users
    };
    useEffect(() => {
        fetchAdmin();
    }, [pagination.page,formData.reset]);
    return (
        <main>
            <>
                {contextHolder}
                <Header
                    title={"ADMIN"}
                    path={"admin"}
                    children={
                        <Space size={"large"} style={{
                            width:"100%"
                        }}>
                             <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{
                                    backgroundColor: "rgba(162, 115, 255, 1)",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "100px",
                                   padding: "4px 12px",
                                    height: "40px",
                                    fontWeight:"bold"
                                    
                                }}
                                onClick={async() => {
                                   setShowModal({
                                            ...showModal,
                                            formModal: true,
                                        });
                                }}
                            >
                                Ajouter
                            </Button>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
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
                                    const data = await fetchAdmin();
                                    setLoading(true)
                                    const fileName = "admin";
                                    if (!data || data.length <0 ) return;
                                   await exportToCSV(data, fileName);
                                    setLoading(false)
                                }}
                            >
                                Exporter
                            </Button>
                            <Button style={{
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
                > </Header>
        <ConfirmModal handleSubmit={handleSubmit} showModal={ showModal} setShowModal={setShowModal} />

                <FormModal setFormData={setFormData} openNotificationWithIcon={openNotificationWithIcon} formData={formData} handleFileChange={handleFileChange} handleInputChange={handleInputChange} showModal={ showModal} setShowModal={setShowModal} />
                <EditModal edit setFormData={setFormData} handleSubmit={handlEdit} openNotificationWithIcon={openNotificationWithIcon} formData={formData} handleFileChange={handleFileChange} handleInputChange={handleInputChange} showModal={showModal} setShowModal={setShowModal} />
                <Modal
            width={300}
            destroyOnClose
            onCancel={() => {
                setShowModal({ ...showModal, confirmtModal: false });
                
            }}
            centered
            maskClosable={false}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setShowModal({
                                    ...showModal,
                                    refresh: false,
                                });

                              
                            }}
                            style={{
                                backgroundColor: "#FDE8E8 !important",
                                color: "#EF4444",
                                borderRadius: "25px",
                            }}
                            danger
                        >
                            Annuler
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={resetPwd}
                            type="primary"
                            
                        >
                            Confirmer
                        </Button>
                    </div>
                </>
            }
            open={showModal.refresh}
        >
            <div className="top">
                <h4>voulez vous confirmer cette action ?</h4>
                <span>cette action est irréversible</span>
            </div>
        </Modal>
                <DataTable
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                        pageSize: 12,
                    }}
                    column={columns}
                    data={admins}
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

export default Admins

export const ConfirmModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    handleSubmit,
   edit
   
}) => {
    return (
        <Modal
            width={300}
            destroyOnClose
            onCancel={() => {
                setShowModal({ ...showModal, confirmtModal: false });
                
            }}
            centered
            maskClosable={false}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setShowModal({
                                    ...showModal,
                                    confirmModal: false,
                                });

                              
                            }}
                            style={{
                                backgroundColor: "#FDE8E8 !important",
                                color: "#EF4444",
                                borderRadius: "25px",
                            }}
                            danger
                        >
                            Annuler
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={handleSubmit}
                            type="primary"
                            
                        >
                            Confirmer
                        </Button>
                    </div>
                </>
            }
            open={edit ? showModal.editConfifirm:showModal.confirmModal}
        >
            <div className="top">
                <h4>voulez vous Valider la transaction ?</h4>
                <span>cette action est irréversible</span>
            </div>
        </Modal>
    );
};
export const FormModal = ({
    setShowModal,
    showModal,
    handleFileChange,
    handleInputChange,
    formData,
    openNotificationWithIcon,
    handleSubmit,
    setFormData
   
}) => {
   
    
    return (
        <Modal
            width={400}
            onCancel={() => {

                setShowModal({ ...showModal, formModal: false });
                
            }}
            centered
            maskClosable={false}
            destroyOnClose
           footer={false}
            open={showModal.formModal}
        >
            <div className="top">
                <h2>Nouvelle admin</h2>

                <Form
                    preserve={false}
                    style={{
              width: "100%",
          }}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item style={{
              width: "100%",
          }}  valuePropName="fileList"  getValueFromEvent={e => e.fileList}>
                        <Upload accept=".png,.jpeg,.jpg" name="file"  onChange={handleFileChange}  listType="picture-card">
            <button
              style={{
                border: 0,
                background: 'none',
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                                        marginTop: 8,
                    width: '100%',
                }}
              >
                cliquez ici pour ajouter une image
              </div>
            </button>
          </Upload>
        </Form.Item>
                    <Form.Item >
          <Input name="firstname" value={formData.firstname}
                            onChange={handleInputChange} placeholder="Nom " />
        </Form.Item>
        <Form.Item  >
                        <Input placeholder="Prenom"
                            name="lastname" 
                            value={formData.lastname}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
        <Form.Item >
          <Input   name="email" 
                            value={formData.email}
                            onChange={handleInputChange} placeholder="Adresse Email" />
                    </Form.Item>
                    <Form.Item
          name="profile"
          noStyle
          rules={[
            {
              required: true,
              message: 'veuillez selectionner un rôle',
            },
          ]}
        >
                        <Select onChange={(e) => {
                            setFormData({
                                ...formData,
                                profile:e
                            })
          }} placeholder="Selectionner un rôle">
            <Option value="Admin">Admin</Option>
            <Option value="SuperAdmin">SuperAdmin</Option>
          </Select>
        </Form.Item>
                    <Form.Item style={{
              width: "100%",
          }}>
                         <Button
                            style={{
                                borderRadius: "25px",
                                width: "100%",
                                marginTop: "5px"
                            }}
                            onClick={() => {
                                console.log("dataaa",formData)
                                if (!formData.firstname || !formData.email || !formData.profile || !formData.lastname) {
      openNotificationWithIcon(
                "error",
                "INVALIDE ",
                "veuillez remplir tout les champs"
            );
            return
}
                                setShowModal((prev) => {
                                    return {
                                        ...prev,
                                        confirmModal: true,
                                        formModal: false
                                    }

                                })
                            }}
                            type="primary"
                            
                        >
                            Confirmer
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};
export const EditModal = ({
    setShowModal,
    showModal,
    handleFileChange,
    handleInputChange,
    formData,
    openNotificationWithIcon,
    setFormData,
    handleSubmit
   
}) => {
    const [modal, setModal] = useState({
        confirmModal: false,
        reset:false
   })
   const [form] = Form.useForm();
    
    const handlconfirm =(e)=>{
        setModal({...modal,
            confirmModal: false
        })
        handleSubmit()
    }
    return (
        <div>
            <Modal
            width={300}
            destroyOnClose
            onCancel={() => {
                setShowModal({ ...showModal, confirmtModal: false });
                
            }}
            centered
            maskClosable={false}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setModal({
                                    ...modal,
                                    confirmModal: false,
                                });

                              
                            }}
                            style={{
                                backgroundColor: "#FDE8E8 !important",
                                color: "#EF4444",
                                borderRadius: "25px",
                            }}
                            danger
                        >
                            Annuler
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={handlconfirm}
                            type="primary"
                            
                        >
                            Confirmer
                        </Button>
                    </div>
                </>
            }
            open={modal.confirmModal}
        >
            <div className="top">
                <h4>voulez vous confirmer cette action ?</h4>
                <span>cette action est irréversible</span>
            </div>
        </Modal>
            <Modal
                width={400}
                onCancel={() => {
                    setShowModal({ ...showModal, editModal: false });
            
                }}
                centerededitModal
                maskClosable={false}
                destroyOnClose
               footer={false}
                open={showModal.editModal}
            >
                <div className="top">
                    <h2>Edit admin</h2>
                    <Form
                        preserve={false}
                        style={{
                  width: "100%",
              }}
                        layout="vertical"
                        size="large"
                    >
                        {/* <Form.Item style={{
                  width: "100%",
              }}  valuePropName="fileList"  getValueFromEvent={e => e.fileList}>
                            <Upload accept=".png,.jpeg,.jpg" name="file"  onChange={handleFileChange}  listType="picture-card">
                <button
                  style={{
                    border: 0,
                    background: 'none',
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div
                    style={{
                                            marginTop: 8,
                        width: '100%',
                    }}
                  >
                    cliquez ici pour ajouter une image
                  </div>
                </button>
              </Upload>
            </Form.Item> */}
                        <Form.Item >
              <Input name="firstname" value={formData.firstname}
                                onChange={handleInputChange} placeholder="Nom " />
            </Form.Item>
            <Form.Item  >
                            <Input placeholder="Prenom"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
            <Form.Item >
              <Input   name="email"
                                value={formData.email}
                                onChange={handleInputChange} placeholder="Adresse Email" />
                        </Form.Item>
                        <Form.Item
              name="profile"
              noStyle
              rules={[
                {
                  required: true,
                  message: 'veuillez selectionner un rôle',
                },
              ]}
            >
              <Select   onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    profile:e
                                })
              }} placeholder="Selectionner un rôle">
                <Option value="Admin">Admin</Option>
                <Option value="SuperAdmin">SuperAdmin</Option>
              </Select>
            </Form.Item>
                        <Form.Item style={{
                  width: "100%",
              }}>
                             <Button
                                style={{
                                    borderRadius: "25px",
                                    width: "100%",
                                    marginTop: "5px"
                                }}
                                onClick={() => {
                                    console.log("dataaa",formData)
                                    if (!formData.firstname || !formData.email || !formData.profile || !formData.lastname) {
                  openNotificationWithIcon(
                    "error",
                    "INVALIDE ",
                    "veuillez remplir tout les champs"
                );
                return
            }
                                    setShowModal((prev) => {
                                        return {
                                            ...prev,
                                            editModal: false,
                                            editConfirm:true
                                        }
                                    })
                                    setModal({...modal,
                confirmModal: true
            })
                                }}
                                type="primary"
            
                            >
                                Confirmer
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
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