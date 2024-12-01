import { useEffect, useRef, useState } from "react";
import DataTable, {
    currencySign,
    FormatDate,
    renderColor,
    renderIcon,
} from "../components/DataTable";
import * as XLSX from "xlsx";
// impor useTranslation from 'react-i18next';
import { useTranslation } from "react-i18next";
import {  RangeSlider, Row, Col, InputGroup } from 'rsuite';
import Header from "../components/Header";
import {
    Avatar,
    Button,
    Carousel,
    Divider,
    Drawer,
    Space,
    Tag,
    notification,
    Spin,
    Modal,
    Slider,
    Input,
    InputNumber,
    Image,
    Select,
    Radio,
    DatePicker,
    Checkbox,
    Collapse,
    
    
} from "antd";
import { PictureOutlined,UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "../components/Map";
import {
    API_URL,
    deleteResidence,
    getResidence,
    getResidencePriceRange,
    updateResidence,
} from "../feature/API";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterBoxe from "../components/FilterBoxe";
import { Icon } from "../constant/Icon";
import { ImgModal } from "./Reservation";
const { RangePicker } = DatePicker;
const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
function convertToISO(dateString) {
    const dateObject = new Date(dateString);
    const ISOString = dateObject.toISOString();
    return ISOString;
}
const Residence = () => {
    const { t, i18n } = useTranslation();
    const [selectResi, setSelecteResi] = useState(null);
    const [selectSpace, setSPaceIndex] = useState(null);
    const [loading, setLoading] = useOutletContext();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filtertext, setFilterText] = useState("");
    const [residence, setResidence] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [spin, setSpin] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
    const [reason, setReason] = useState({
        deletReason: "",
        rejectReason: "",
        acceptReason: "",
    });
    const [showModal, setShowModal] = useState({
        deletModal: false,
        filterModal: false,
        addModal: false,
        loading: false,
        rejectModal: false,
    });
    const handleResiClick = (index) => {
    setSelecteResi(index);
    };
    const handleSpaceClick = (index) => {
    setSPaceIndex(index);
    };
     const rangPicker = (value) => {
        console.log(value);

        const [start, end] = value;
        setStartDate(start);
        setEndDate(end);
        if (start == null) {
            selectRange([null, null]);
            return;
        }
        if (end == null) {
            return;
        }
        
                console.log(end);

        const startISO = convertToISO(start);
        const endISO = convertToISO(end);
        
                console.log(dateRange);

        selectRange([startISO, endISO]);
    };
    const [priceRange, setPriceRange] = useState({ min: 1, max: 1111111 });

    const [filterValue, setFilterValue] = useState({
        minPrice: priceRange?.min,
        maxPrice: priceRange.max,
        numPeople: "",
        status: "",
        roomIds: [
            {
                roomId: 1,
                quantity: 0,
            },
            {
                roomId: 5,
                quantity: 0,
            },
            {
                roomId: 2,
                quantity: 0,
            },
        ],
        occupation: "",
        typeResi: [],
        activitiesIds: [],
        fromDate: "",
        toDate: "",
        reset:false
    });
    const [open, setOpen] = useState(false);
    const [modalAray, setModalAray] = useState([]);
    const [imageModal, setImageModal] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
 const toggleTypeResi = (type) => {
    setFilterValue((prevState) => {
      const newTypeResi = prevState.typeResi.includes(type)
        ? prevState.typeResi.filter((item) => item !== type)
        : [...prevState.typeResi, type];
      return { ...prevState, typeResi: newTypeResi };
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
      activitiesIds: checkedValues
    });
  };
  const exportToCSV = (data, fileName) => {
        console.log("dattt",data)
        const formattedData = data.map((item) => ({
            "Nom de la residence": item.name,
            "Nom de l'Hôte": item.host.firstname + " " + item.host.lastname,
            "Prix": item.price,
            "Document Hôte": `${API_URL}/assets/uploads/docs/${item.host.identityDoc}`,
            "Date d'ajout": new Date(item.createdAt).toLocaleDateString(),
            "Statut": item.status,
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
    const onCancel = (data) => {
        setSelectItem(data);
        setShowModal({
            ...showModal,
            rejectModal: true,
        });
    };
    const onConfirme = async (data) => {
        setSpin(true);
        setSelectItem(data);
        console.log(data);
        await updateResidences(data.id, "accepted");
        setSpin(false);
    };
    const onHide = async (id, status) => {
        setSpin(true);
        const data = {
            status,
        };
        const res = await updateResidence(id, data, headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setSpin(false);
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = res.data.status;
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + res.data.status
        );
    };
    const HandleDeletResidence =async (id) => {
        setSpin(true);
        const data = {
            reason:reason.deletReason
        };
        const res = await deleteResidence(id, data, headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setSpin(false);
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = "Désactivé";
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + res.data.status
        );
    };
    const updateResidences = async (id, status) => {
        setShowModal({ ...showModal, loading: true });
        const formeData = {
            status,
        };

        const res = await updateResidence(id, formeData, headers);
        setShowModal({ ...showModal, loading: false });
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = res?.data?.status;
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + res?.data?.status
        );

        // setShowModal({ ...showModal, addModal: false, rejectModal: false });
        setReason({
            ...reason,
            acceptReason: "",
            rejectReason: "",
        });
    };
    const showDrawer = async (data) => {
        setModalAray(data.medias);
        setSelectItem(data);

        let loc = {
            address: data.address,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng),
        };
        setLocation(loc);
        console.log(selectItem);
        console.log(location);
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: pagination.current,
        minPrice: filterValue.minPrice,
        maxPrice: filterValue.maxPrice,
        numPeople: filterValue.numPeople,
        limit: 7,
        status: filterValue.status,
        admin_search: filtertext,
        ...filterValue.roomIds
        .filter(room => room.quantity > 0)
        .reduce((acc, room, index) => {
            acc[`roomIds[${index}][roomId]`] = room.roomId;
            acc[`roomIds[${index}][quantity]`] = room.quantity;
            return acc;
        }, {}),
        occupation: filterValue.occupation,
        typeIds: filterValue.typeResi,
        activitiesIds: filterValue.activitiesIds,
        fromDate: filterValue.fromDate,
        toDate:filterValue.toDate
    
    };
    const getPriceRange = async() => {
        const res = await getResidencePriceRange(headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
               t("error.401"),
                t("error.retry1")
            );
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        console.log(res.data);
        setPriceRange({
            min: res.data.min,
            max: res.data.max
       })
    //    await setFilterValue({
    //         ...filterValue,
    //         minPrice: res.data.min,
    //         maxPrice: res.data.max
    //     })
        
}
  
    const filtResidence = async () => {
        setShowModal({
            ...showModal,
            filterModal: false,
        });
       
       
        fetchResidence();
    };
    const exportResidence =async () => {
            setLoading(true);
        console.log(params)
        let para = {
        minPrice: filterValue.minPrice,
        maxPrice: filterValue.maxPrice,
        numPeople: filterValue.numPeople,
       
        status: filterValue.status,
        admin_search: filtertext,
        ...filterValue.roomIds
        .filter(room => room.quantity > 0)
        .reduce((acc, room, index) => {
            acc[`roomIds[${index}][roomId]`] = room.roomId;
            acc[`roomIds[${index}][quantity]`] = room.quantity;
            return acc;
        }, {}),
        occupation: filterValue.occupation,
        typeIds: filterValue.typeResi,
        activitiesIds: filterValue.activitiesIds,
        fromDate: filterValue.fromDate,
            toDate: filterValue.toDate,
        all:true
    
    };
        const res = await getResidence(para, headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                "merci de reesayer"
            );
          
            setLoading(false);
            return;
        }
        setLoading(false);
        return res.data.residences
}
    const fetchResidence = async () => {
        
        setLoading(true);
        console.log(params)
        const res = await getResidence(params, headers);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
               t("error.401"),
                t("error.retry1")
            );
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setLoading(false);
        setPagination({ ...pagination, total: res.data.totalResidences });
        setResidence(res.data.residences);
        console.log(residence);
    };
    useEffect(() => {
        fetchResidence({
            limit: 7,
            page: pagination.current,
            status: filterValue.status,
        });
        getPriceRange()
    }, [pagination.current, filterValue.status, filtertext, filterValue.reset ]);

    return (
        <main>
            <>
                <>
                  
                    <Header
                        title={t("menu.residence")}
                        path={t("menu.residence")}
                        
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
                                    padding: "4px 12px",
                                    height: "40px",
                                    fontWeight:"bold"
                                }}
                                onClick={async() => {
                                    const data = await exportResidence();
                                    const fileName = "residence";
                                    if (!data || data.length <0 ) return;
                                    exportToCSV(data, fileName);
                                }}
                            >
                                {t("other.export")}
                            </Button>
                                  <FilterBoxe
                                handleSearch={setFilterText}
                                filtertext={filtertext}
                                onClick={() => {
                                    setShowModal({
                                        ...showModal,
                                        filterModal: true,
                                    });
                                }}
                                placeHolder={t("filter.residence")}
                                children={
                                    <img
                                        onClick={() => {
                                            setShowModal({
                                                ...showModal,
                                                filterModal: true,
                                            });
                                        }}
                                        src={Icon.filter}
                                        alt="filter icon"
                                    />
                                }
                            />
                          </Space>
                        }
                    />
                </>
                {contextHolder}

                <Drawer
                    placement="right"
                    onClose={onClose}
                    destroyOnClose={true}
                    open={open}
                >
                    <div
                        style={{
                            position: "relative",
                        }}
                        className="top"
                    >
                        <Carousel autoplay>
                            {selectItem && (
                                <Image.PreviewGroup>
                                    <Image
                                        src={`${API_URL}/assets/uploads/residences/${selectItem?.medias[0]?.filename}`}
                                        alt=""
                                        width={352}
                                        style={{
                                            height: "160px",
                                            objectFit: "cover",
                                        }}
                                        className="carouselImg"
                                        id="carouselImgs"
                                    />
                                    {selectItem.medias.map((item, index) => {
                                        return index == 0 ? null : (
                                            <div
                                                style={{
                                                    display: "none",
                                                }}
                                                key={index}
                                            >
                                                <Image
                                                    style={{
                                                        height: "160px",
                                                        objectFit: "cover",
                                                        display: "none",
                                                    }}
                                                    src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                                                    alt=""
                                                    width={352}
                                                />
                                            </div>
                                        );
                                    })}
                                </Image.PreviewGroup>
                            )}
                        </Carousel>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "20px",
                                right: "20px",
                                color: "#000",
                                padding: "10px 18px ",
                                backgroundColor: "#fff",
                                borderRadius: "100px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                document.getElementById("carouselImgs").click();
                            }}
                        >
                            <span>
                                <PictureOutlined /> +
                                {selectItem && selectItem?.medias.length} photos
                            </span>
                        </div>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h4>{t("residence.number")}</h4>
                        <h4
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {selectItem && selectItem?.serial_number}
                        </h4>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h4>{t("table.methode")}</h4>
                        <h4
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {(selectItem &&
                                selectItem.host?.payment_method?.label) ||
                                "--"}
                        </h4>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectItem && selectItem?.name}
                    </h2>
                    <span>{selectItem && selectItem?.address}</span>
                    <Divider />
                    <div className="price">
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {selectItem &&
                                selectItem.price
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                            { currencySign()}/ {t("other.nuits")}
                        </h2>
                        <p>{t("other.price")}</p>
                    </div>
                    <Divider />
                    <h3
                        style={{
                            color: "#1B2559",
                            margin: "10px 0",
                        }}
                    >
                        {t("other.infoHote")}
                    </h3>
                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",
                        }}
                        className="user"
                    >
                        <Avatar
                            src={`${API_URL}/assets/uploads/avatars/${selectItem?.host?.avatar}`}
                            size={64}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "10px",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#1B2559",
                                }}
                            >
                                {selectItem && selectItem.host?.firstname}{" "}
                                {selectItem && selectItem.host?.lastname}
                            </h3>
                            <p>{selectItem && selectItem?.host?.email}</p>
                            <p>{selectItem && selectItem?.host?.contact}</p>
                        </div>
                    </div>
                    <Divider />
                    <h3
                        style={{
                            color: "#1B2559",
                            margin: "10px 0",
                        }}
                    >
                        {t("other.description")}
                    </h3>
                    {selectItem?.description?.map((item, index) => {
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: "10px",
                                }}
                                key={index}
                            >
                                <h4
                                    style={{
                                        color: "#1B2559",
                                    }}
                                >
                                    {item?.title}
                                </h4>
                                <p>{item?.text}</p>
                            </div>
                        );
                    })}

                    <Divider />
                    <div orientation="vertical">
                        <h2>{t("other.comodite")}</h2>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "5px",
                                marginTop: "10px",
                            }}
                        >
                            {selectItem?.assets?.map((item, index) => {
                                return (
                                    <Space className="comodite" key={index}>
                                        <img
                                            src={`${API_URL}/assets/icons/assets/${item?.asset?.icon}`}
                                        />
                                        {item?.asset?.name}
                                    </Space>
                                );
                            })}
                        </div>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {t("other.apercu")}
                    </h2>
                    <div
                        style={{
                            display: "flex",

                            gap: "10px",
                            marginTop: "10px",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                alignItems: "flex-start",
                                paddingLeft: "5px",
                            }}
                            className="left"
                        >
                            <div style={subtitleSryle} className="subti">
                                <img src={Icon.check} alt="" />
                                <p>{t("other.rules")}</p>
                            </div>
                            {selectItem?.rules?.map((item, index) => {
                                return (
                                    <span key={index}>{item.rule?.title}</span>
                                );
                            })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                alignItems: "flex-start",
                            }}
                            className="rigth"
                        >
                            <div style={subtitleSryle} className="subti">
                                <img src={Icon.check} alt="" />
                                <p>{t("other.activities")}</p>
                            </div>
                            {selectItem?.activities?.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.activity?.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                   

                    <Divider />
                     <Space style={info} direction="vertical">
<Space>
                    <img style={{
                        width:"20px", height:"20px"
                    }} src={selectItem?.occupation == "Full" ? "/maison.png": "/chambre1.png"} alt="" />
                   <h4> {
                        selectItem?.occupation == "Full" ? "Residence complète": "Residence Partiel"
                    }</h4>
                 </Space>
                <Space style={info}>
                    <img style={{
                        width:"20px", height:"20px"
                    }} src={Icon.users} alt="" />
                    <h4>Personne max: { selectItem?.maxPeople}</h4>
                 </Space>
                    <Space style={info}>
                        <img style={{
                        width:"20px", height:"20px"
                    }} src="/chambre1.png" alt="" />
                     {selectItem?.rooms.map(
                                        (item, index) => {
                                            if (item?.room.id === 1) {
                                                return (

                                                    <h4>
                                                            {t("other.room")}
                                                            {item?.count > 1
                                                                ? "s"
                                                                : ""} : {item?.count} 
                                                        </h4>
                                                );
                                            }
                                        }
                        )}
                        <div></div>
                        <img style={{
                        width:"20px", height:"20px"
                    }} src="/chambre1.png" alt="" />
                        {selectItem?.rooms.map(
                                        (item, index) => {
                                            if (item?.room.id === 2) {
                                                return (

                                                    <h4>
                                                            {t("other.salon")}
                                                            {item?.count > 1
                                                                ? "s"
                                                                : ""} : {item?.count} 
                                                        </h4>
                                                );
                                            }
                                        }
                                    )}
                 </Space>
                    <Space style={info}>
                        <img style={{
                        width:"20px", height:"20px"
                    }} src="/chambre1.png" alt="" />
                     {selectItem?.rooms.map(
                                        (item, index) => {
                                            if (item?.room.id === 5) {
                                                return (

                                                    <h4>
                                                            {t("other.bathroom")}
                                                            {item?.count > 1
                                                                ? "s"
                                                                : ""} : {item?.count} 
                                                        </h4>
                                                );
                                            }
                                        }
                                    )}
                 </Space>
                <Divider />
                </Space>
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {t("other.grille")}
                    </h2>
                    <div>
                        <ul>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    {t("other.entre1mois_3mois")}
                                </li>
                                <span>
                                    {selectItem?.refundGrid[
                                        "Entre 1 mois et 3 mois avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    {t("other.entre1semaine_1mois")}
                                </li>
                                <span>
                                    {" "}
                                    {selectItem?.refundGrid[
                                        "Entre 1 semaine et 1 mois avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    {t("other.entre48h_1semaine")}
                                </li>
                                <span>
                                    {" "}
                                    {selectItem?.refundGrid[
                                        "Entre 48h et 1 semaine avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    {t("other.moins48heures_1jour")}
                                </li>
                                <span>
                                    {" "}
                                    {selectItem?.refundGrid[
                                        "Moins de 48 heures avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    {t("other.plus3mois_1jour")}
                                </li>
                                <span>
                                    {" "}
                                    {selectItem?.refundGrid[
                                        "Plus de 3 mois avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                        </ul>
                    </div>
                    <Divider />
                    <Map location={location} />
                </Drawer>
                <div style={{
                    width: "100%",
                    height:"100%"
                }}>
                    <FilterModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    min={filterValue.minPrice}
                    max={filterValue.maxPrice}
                    numPeople={filterValue.numPeople}
                    filterValue={filterValue}
                    onConfirme={filtResidence}
                        filtResidence={filtResidence}
                        rangPicker={rangPicker}
                        startDate={startDate}
                        endDate={endDate}
                        toggleTypeResi={toggleTypeResi}
                        toggleActivitiesIds={toggleActivitiesIds}
                        togleDate={togleDate}
                        priceRange={priceRange}
                />
                </div>
                <DeletModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    min={filterValue.min}
                    max={filterValue.max}
                    loading={showModal.loading}
                    onConfirme={() => {
                        console.log(selectItem);
                        HandleDeletResidence(selectItem.id);
                        setShowModal({
                            ...showModal,
                            deletModal: false,
                        })
                    }}
                    reason={reason}
                    setReason={setReason}
                />

                <RejectModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    loading={showModal.loading}
                    reason={reason}
                    setReason={setReason}
                    onConfirme={() => {
                        updateResidences(
                            selectItem.id,
                            "rejected",
                            reason.rejectReason
                        );
                    }}
                />
                <DataTable
                    data={residence}
                    size={7}
                    onChange={(page) => {
                        console.log(page);
                        setPagination({ ...pagination, current: page.current });
                    }}
                    onHide={onHide}
                    onConfirm={onConfirme}
                    onCancel={onCancel}
                    onDelet={(data) => {
                        setSelectItem(data);
                        setShowModal({ ...showModal, deletModal: true });
                    }}
                    showDrawer={showDrawer}
                    pagination={{
                        total: pagination.total,
                    }}
                    spin={spin}
                    children={
                        <Select
                            placeholder="Filtrer par status"
                            style={{ width: 180, marginRight: "13px" }}
                            allowClear
                            onChange={(value) => {
                                setFilterValue({
                                    ...filterValue,
                                    status: value,
                                });
                                console.log("ok", value);
                                console.log("filter", filterValue);
                            }}
                            size="large"
                            options={[
                                {
                                    value: "waiting",
                                    label: t("status.waiting"),
                                },
                                {
                                    value: "active",
                                    label: t("status.active"),
                                },
                                {
                                    value: "rejected",
                                    label: t("status.rejected"),
                                },
                                {
                                    value: "deleted",
                                    label: t("status.deleted"),
                                },
                            ]}
                        />
                    }
                />
            </>
        </main>
    );
};
const info={
                    display: "flex",
                    alignItems: "start",
                    justifyContent:"center"
                }
export default Residence;
export const FilterModal = ({
    min,
    max,
    setFilterValue,
    showModal,
    setShowModal,
    onConfirme,
    filterValue,
    filtResidence,
    numPeople,
    rangPicker,
    startDate,
    endDate,
    toggleTypeResi,
    toggleActivitiesIds,
    togleDate,
    priceRange
}) => {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        setFilterValue((prevState) => ({
            ...prevState,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
        }));
    }, [priceRange, setFilterValue]);
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
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    numPeople: "",
    roomIds: [
        { roomId: 1, quantity: 0 },
        { roomId: 2, quantity: 0 },
        { roomId: 5, quantity: 0 },
    ],
    typeResi: [],
    occupation: "",
    activitiesIds: [],
                                    status: "",
    reset: !filterValue.reset
};
                                  setFilterValue(prevState => ({
        ...prevState,
        ...resetFilterValues
    }));
                                
                                console.log("reset value ::::",filterValue);
                                // setShowModal({
                                //     ...showModal,
                                //     filterModal: false,
                                // });
                                filtResidence();

                                
                            }}
                            danger
                            type="text"
                        >
                            {t("button.clean")}
                        </Button>
                        <Button onClick={onConfirme} type="primary">
                            {t("button.search")}
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
               

                <h3>{t("filter.priceRange")}</h3>
              
                <Slider
                    onChange={(value) => {
                        console.log(value);
                        setFilterValue(prevState => {
                            return {
                                ...prevState,
                                minPrice: value[0],
                                maxPrice: value[1]
                            }
                        
                        });
                    }}
                    min={priceRange.min}
                    max={priceRange.max}
                    range
                    defaultValue={[priceRange.min, priceRange.max]}
                    value={[filterValue.minPrice, filterValue.maxPrice]}
                    step={1}
                    tooltip={false}
                    style={{
                        width: '100%',
                    }}
                />
                <Space style={spaceStyle}>
                    <InputNumber
                       
                       formatter={(value) => {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('fr-FR').format(value);
    }}
                        value={min}
                        stringMode
                       suffix={currencySign()}
                        placeholder="Outlined"
                        min={0}
                          onBlur={(e) => {
                            console.log(e)
                            if (e.target.value == null || e.target.value == undefined || e.target.value == "" || e.target.value == "0") {
                                setFilterValue(prevState => {
                                return {
                                    ...prevState,
                                    minPrice: priceRange.min 
                                }
                            
                            
                            });
                            }
                        }}
                        onChange={(e) => {
                            console.log(e);
                            
                            const newValue = e === null || e === '' ? 0 : parseInt(e, 10);
                            setFilterValue(prevState => {
                                return {
                                    ...prevState,
                                    minPrice: newValue
                                }
                            
                            
                            });
                            console.log(e);
                        }}
                        style={{
                            width: 135,
                        }}
                    />
                    -
                    <InputNumber
                        min={0}
                        placeholder="Outlined"
                        suffix={currencySign()}
                        style={{
                            width: 135,
                        }}
                         formatter={(value) => {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('fr-FR').format(value);
    }}
                        value={max}
                        
                        onChange={(e) => {
                            const newValue = e === null || e === '' ? 0 : parseInt(e, 10);

                            setFilterValue(prevState => {
                                return {
                                    ...prevState,
                                    maxPrice: newValue 
                                }
                            
                            
                            });
                        }}
                        onBlur={(e) => {
                            console.log(e)
                            if (e.target.value == null || e.target.value == undefined || e.target.value == "" || e.target.value == "0") {
                                setFilterValue(prevState => {
                                return {
                                    ...prevState,
                                    maxPrice: priceRange.max 
                                }
                            
                            
                            });
                            }
                        }}
                       
                        
                    />
                </Space>
                <Divider />
                <h3>{t("filter.roomNumber")}</h3>
                <Space style={spaceStyle}>
                    <span>{t("filter.room")}</span>
                    <InputNumber
                        min={1}
                        max={15}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                            width: "125px",
                        }}
                        value={filterValue.roomIds[0].quantity}
                        onChange={(e) => {
                            setFilterValue({
                                ...filterValue,
                                roomIds: [
                                    {
                                        roomId: 1,
                                        quantity: e,
                                    },
                                    {
                                        roomId: 5,
                                        quantity:
                                            filterValue.roomIds[1].quantity,
                                    },
                                    {
                                        roomId: 2,
                                        quantity:
                                            filterValue.roomIds[2].quantity,
                                    },
                                ],
                            });
                        }}
                    />
                </Space>

                <Space style={spaceStyle}>
                    <span>{t("filter.bain")}</span>
                    <InputNumber
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                            width: "125px",
                            marginTop: "3px",
                            marginBottom:"3px"
                        }}
                        value={filterValue.roomIds[1].quantity}
                        onChange={(e) => {
                            setFilterValue({
                                ...filterValue,
                                roomIds: [
                                    {
                                        roomId: 1,
                                        quantity:
                                            filterValue.roomIds[0].quantity,
                                    },
                                    {
                                        roomId: 2,
                                        quantity:
                                            filterValue.roomIds[2].quantity,
                                    },
                                    {
                                        roomId: 5,
                                        quantity: e,
                                    },
                                ],
                            });
                        }}
                    />
                </Space>
                
                <Space style={spaceStyle}>
                    <span>{t("filter.salon")}</span>
                    <InputNumber
                        min={1}
                        max={10}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                            width: "125px",
                        }}
                        value={filterValue.roomIds[2].quantity}
                        onChange={(e) => {
                            setFilterValue({
                                ...filterValue,
                                roomIds: [
                                    {
                                        roomId: 1,
                                        quantity:
                                            filterValue.roomIds[0].quantity,
                                    },
                                    {
                                        roomId: 5,
                                        quantity:
                                            filterValue.roomIds[1].quantity,
                                    },
                                    {
                                        roomId: 2,
                                        quantity: e,
                                    },
                                ],
                            });
                        }}
                    />
                </Space>
                <Divider />
                <h3>{t("filter.numPeople")}</h3>
                <Space style={spaceStyle}>
                    <span>{t("filter.numPeople")}</span>
                    <InputNumber
                        min={1}
                        max={10}
                        placeholder="00"
                        value={numPeople}
                        style={{
                            textAlign: "center",
                            width: "125px",
                        }}
                        onChange={(e) => {
                            console.log(e);
                            setFilterValue({
                                ...filterValue,
                                numPeople: e,
                            });
                        }}
                    />
                </Space>
                <Divider />
                <div style={{
                    width: "auto",
                    display:"flex",
                    flexDirection:"column",
                    gap:"10px"
                }}>
                    <h3>{t("filter.date")}</h3>
                    <RangePicker onChange={togleDate} />
                </div>
                <Divider/>
                    <h3>{t("filter.type")}</h3>
                <div  style={{
                    display:"flex",
                    gap: "10px",
                    cursor:"pointer",
                }}>
                    <div onClick={() => {
                   toggleTypeResi(1)
                }} style={{...typeResi, backgroundColor: filterValue.typeResi.includes(1)? "#DAC7FF" : "transparent"}}>
                        <img style={resiImg} src="/maison.png" alt="" />
                        <p>{t("filter.maison")}</p>
                    </div>
                    <div onClick={() => {
                   toggleTypeResi(2)
                }} style={{...typeResi, backgroundColor: filterValue.typeResi.includes(2) ? "#DAC7FF" : "transparent"}}>
                        <img style={resiImg} src="/building.png" alt="" />
                        <p>{t("filter.appartement")}</p>
                    </div>
                    <div onClick={() => {
                    toggleTypeResi(3)
                }} style={{...typeResi, backgroundColor: filterValue.typeResi.includes(3) ? "#DAC7FF" : "transparent"}}>
                        <img style={resiImg} src="/chalet.png" alt="" />
                        <p>{t("filter.chalet")}</p>
                    </div>
                   
                </div>
                <Divider />
                <h3 style={{marginBottom:"10px"}}>{t("other.activities")}</h3>
                <Checkbox.Group  onChange={toggleActivitiesIds}
      value={filterValue.activitiesIds}>
      <Space direction="vertical">
        <Checkbox value={1}>{t("activite.baptisms")}</Checkbox>
        <Checkbox value={4}>{t("activite.parties_with_alcohol")} </Checkbox>
        <Checkbox value={5}>{t("activite.bachelor_parties")}</Checkbox>
         <Checkbox value={6}>{t("activite.seminars")}</Checkbox>
        
         <Collapse  >
        <Collapse.Panel header="Afficher  plus">
             <Space direction="vertical">
               <Checkbox value={2}>{t("activite.weddings")} </Checkbox>
        <Checkbox value={3}>{t("activite.birthdays")}</Checkbox>
        <Checkbox value={7}>{t("activite.conferences")}</Checkbox>
        <Checkbox value={11}>{t("activite.painting_workshops")}</Checkbox>
        <Checkbox value={12}>{t("activite.dance")}</Checkbox>
        <Checkbox value={13}>{t("activite.art_creation_sessions")}</Checkbox>
        <Checkbox value={14}>{t("activite.local_craft_making")}</Checkbox>
        
         </Space>
        </Collapse.Panel>
                            
        </Collapse>
        
      </Space>
    </Checkbox.Group>
            </div>
            <Divider/>
            <h3>Espaces accessibles</h3>
            <div style={{
                display:"flex",
                gap:"10px",
                alignItems: "center",
                justifyContent: "space-between",
                border:"1px solid #DAC7FF",
                padding: "6px",
                borderRadius: "5px",
                marginTop: "10px",
                marginBottom: "6px",
                cursor: "pointer",
                backgroundColor: filterValue.occupation === "Full" ? "#DAC7FF" : "transparent"
            }}>
                <div onClick={() => {
                     setFilterValue({
        ...filterValue,
        occupation: filterValue.occupation === "Full" ? "" : "Full"
    });
                }} style={{
                    display:"flex",
                    flexDirection:"column",
                    gap: "1px",
                    width:"80%"
                }}>
                    <h4>
                        {t("filter.rom1")}
                    </h4>
                    <span style={{
                        fontSize:"10px"
                    }}>
                        {t("filter.room1Detail")}
                    </span>
                </div>
                <img src="/chambre1.png" alt="" />
            </div>
            <div style={{
                display:"flex",
                gap:"10px",
                alignItems: "center",
                justifyContent: "space-between",
                border:"1px solid #DAC7FF",
                padding: "6px",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: filterValue.occupation === "Partial" ? "#DAC7FF" : "transparent"

            }}>
                <div onClick={() => {
                    setFilterValue({
        ...filterValue,
        occupation: filterValue.occupation === "Partial" ? "" : "Partial"
    });
                }} style={{
                    display:"flex",
                    flexDirection:"column",
                    gap: "1px",
                    width:"80%"
                }}>
                    <h4>
                        {t("filter.partialResidence")}
                    </h4>
                    <span style={{
                        fontSize:"10px"
                    }}>
                        {t("filter.allResidenceDetail")}
                    </span>
                </div>
                <img src="/maison.png" alt="" />
            </div>
        </Drawer>
    );
};
export const DeletModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    reason,
    setReason,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal
            width={300}
            onCancel={() => {
                setShowModal({ ...showModal, deletModal: false });
                setReason({
                    ...reason,
                    deletReason: "",
                });
            }}
            centered
            maskClosable={false}
            destroyOnClose={true}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setShowModal({
                                    ...showModal,
                                    deletModal: false,
                                });
                                setReason({
                                    ...reason,
                                    deletReason: "",
                                });
                            }}
                            style={{
                                borderRadius: "25px",
                            }}
                            type="primary"
                        >
                            {t("button.keep")}
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#FEF2F2 !important",
                                color: "#fff",
                                borderRadius: "25px",
                            }}
                            danger
                            onClick={onConfirme}
                            type="primary"
                            loading={loading}
                        >
                            {t("button.delete")}
                        </Button>
                    </div>
                </>
            }
            open={showModal.deletModal}
        >
            <div className="top">
                <h3>{t("residence.confirmDelete")}</h3>
                <Input.TextArea
                    value={reason.deletReason}
                    onChange={(e) => {
                        setReason({ ...reason, deletReason: e.target.value });
                    }}
                    style={{
                        marginTop: "10px",
                    }}
                    placeholder={t("residence.deleteReason")}
                />
            </div>
        </Modal>
    );
};
export const ConfrimeModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    setReason,
    reason,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal
            width={300}
            onCancel={() => {
                setShowModal({ ...showModal, addModal: false });
                setReason({
                    ...reason,
                    acceptReason: "",
                });
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
                                    addModal: false,
                                });
                                setReason({
                                    ...reason,
                                    acceptReason: "",
                                });
                            }}
                            style={{
                                backgroundColor: "#FEF2F2 !important",
                                color: "#EF4444",
                                borderRadius: "25px",
                            }}
                            danger
                        >
                            {t("button.cancel")}
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={onConfirme}
                            type="primary"
                            loading={loading}
                        >
                            {t("button.confirm")}
                        </Button>
                    </div>
                </>
            }
            open={showModal.addModal}
        >
            <div className="top">
                <h3>{t("residence.keep")}</h3>
                <span>
                    {t("residence.acceptDescription")}
                </span>
                <Input.TextArea
                    style={{
                        marginTop: "10px",
                    }}
                    placeholder="Raison de la validation"
                    onChange={(e) => {
                        setReason({ ...reason, acceptReason: e.target.value });
                        console.log(reason);
                    }}
                    value={reason.acceptReason}
                />
            </div>
        </Modal>
    );
};
export const RejectModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    setReason,
    reason,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal
            width={300}
            onCancel={() => {
                setShowModal({ ...showModal, rejectModal: false });
                setReason({
                    ...reason,
                    rejectReason: "",
                });
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
                                    rejectModal: false,
                                });

                                setReason({
                                    ...reason,
                                    rejectReason: "",
                                });
                            }}
                            style={{
                                backgroundColor: "#FEF2F2 !important",
                                color: "#EF4444",
                                borderRadius: "25px",
                            }}
                            danger
                        >
                            {t("button.cancel")}
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={onConfirme}
                            type="primary"
                            loading={loading}
                        >
                            {t("button.confirm")}
                        </Button>
                    </div>
                </>
            }
            open={showModal.rejectModal}
        >
            <div className="top">
                <h3>{t("residence.cancel")}</h3>
                <span>
                    {t("residence.refuseDescription")}
                </span>
                <Input.TextArea
                    style={{
                        marginTop: "10px",
                    }}
                    placeholder="Raison du refus"
                    onChange={(e) => {
                        console.log(e);
                        setReason({ ...reason, rejectReason: e.target.value });
                    }}
                    value={reason.rejectReason}
                />
            </div>
        </Modal>
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
const resiImg={
              width:"30px",
              height:"30px"
                        }
const typeResi = {
       display:"flex",
                     
      gap: "5px",
     padding: "10px",
   border:"1px solid #DAC7FF",
     borderRadius: "5px",
    width: "30%",
    flexDirection: "column",
       height:"60px"
  }