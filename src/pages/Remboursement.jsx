import { useEffect, useState } from "react";
import DataTable, {
    FormatDate,
    renderColor,
    renderIcon,
} from "../components/DataTable";
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
    Popover,
    Select,
} from "antd";
import { PictureOutlined, DashOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "../components/Map";
import {
    deleteResidence,
    getResidence,
    updateResidence,
    getReimbusment,
    AccepteReimbursment,
    RejectReimbursment,
    PayReimbursment,
    API_URL,
} from "../feature/API";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterBoxe from "../components/FilterBoxe";
import { Icon } from "../constant/Icon";
import { ImgModal } from "./Reservation";

const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
const Remboursement = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useOutletContext();
    const [filtertext, setFilterText] = useState("");
    const [residence, setResidence] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
    const [modalAray, setModalAray] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 7 });
    const [reason, setReason] = useState({
        deletReason: "",
        rejectReason: "",
        acceptReason: "",
    });
    const [dateRange, setDateRange] = useState({
        fromDate: null,
        toDate: null,
    });
    const [showModal, setShowModal] = useState({
        deletModal: false,
        filterModal: false,
        addModal: false,
        loading: false,
        rejectModal: false,
        spin: false,
    });
    const [filterValue, setFilterValue] = useState({
        minPrice: 20000,
        maxPrice: 55000,
        numPeople: "",
        status: "",
    });
    const [imageModal, setImageModal] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [pophover, setPophover] = useState(false);
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const columns = [
        {
            title: "Résidences",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                    onClick={() => {
                        showDrawer(record);
                        setModalAray(record.booking?.residence?.medias);
                    }}
                >
                    <img
                        onClick={() => {
                            showDrawer(record);
                            setModalAray(record.booking?.residence?.medias);
                        }}
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10%",
                        }}
                        src={
                            record?.booking?.residence?.medias &&
                            `${API_URL}/assets/uploads/residences/${record?.booking?.residence?.medias[0]?.filename}`
                        }
                        alt=""
                    />
                    <div>
                        <p>{text}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record?.booking?.residence?.address}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Hôte",
            dataIndex: "owner",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>
                        {record?.booking?.residence?.host?.firstname}{" "}
                        {record?.booking?.residence?.host?.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record?.booking?.residence?.host?.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Client",
            key: "clien",
            dataIndex: "client",
            render: (text, record) => (
                <div>
                    <p>{record?.booking?.user?.firstname}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record?.booking?.user?.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Montant remboursement",
            dataIndex: "price",
            key: "price",
            render: (text, record) => (
                <span>
                    {record?.refundedAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                    XOF
                </span>
            ),
            responsive: ["md"],
        },

        {
            title: "Date de demande",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["lg"],
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag
                    icon={renderIcon(record?.status)}
                    color={renderColor(record?.status)}
                    key={record.status}
                >
                    {record.status}
                </Tag>
            ),
            responsive: ["md"],
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                return record.status == "En Attente" ? (
                    <Popover
                        trigger="click"
                        open={selectItem?.id == record?.id ? pophover : null}
                        content={
                            <Spin
                                spinning={
                                    selectItem?.id == record.id
                                        ? showModal.spin
                                        : null
                                }
                            >
                                <img
                                    onClick={() => {
                                        setSelectItem(record);
                                        updateResidences(record.id);
                                    }}
                                    src={Icon.valid}
                                    alt="accept icon"
                                />
                                <img
                                    onClick={() => {
                                        setSelectItem(record);
                                        setShowModal({
                                            ...showModal,
                                            deletModal: true,
                                        });
                                    }}
                                    src={Icon.cancel}
                                    alt="reject icon"
                                />
                            </Spin>
                        }
                    >
                        <DashOutlined
                            onClick={() => {
                                setSelectItem(record);
                                setPophover(true);
                            }}
                        />
                    </Popover>
                ) : record.status == "Acceptée" ? (
                    <Spin
                        spinning={
                            selectItem?.id == record.id ? showModal.spin : null
                        }
                    >
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                setShowModal({
                                    ...showModal,
                                    rejectModal: true,
                                });
                            }}
                            src={Icon.bank}
                            alt="paye icon"
                        />
                    </Spin>
                ) : null;
            },
            responsive: ["lg"],
        },
    ];
    const updateResidences = async (id) => {
        setShowModal({ ...showModal, spin: true });

        const header = {
            Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
            "refresh-token": localStorage.getItem("refreshToken"),
            "Content-Type": "application/json",
        };

        const res = await AccepteReimbursment(id, header);

        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            setPophover(false);
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setShowModal({ ...showModal, spin: false });

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
            "la demande de remboursement a été" + " " + res.data.status
        );
        setPophover(false);
        setShowModal({ ...showModal, addModal: false });
        setReason({
            ...reason,
            acceptReason: "",
            rejectReason: "",
        });
    };
    const showDrawer = async (data) => {
        setSelectItem(data);
        let loc = {
            address: data.address,
            lat: parseInt(data.lat),
            lng: parseInt(data.lng),
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
        // "refresh-token": localStorage.getItem("refreshToken"),
    };
    let params = {
        page: pagination.current,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 7,
        status: filterValue.status,
        admin_search: filtertext,
    };

    const deletResidence = async (id) => {
        setShowModal({ ...showModal, spin: true });
        const header = {
            Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
            "refresh-token": localStorage.getItem("refreshToken"),
            "Content-Type": "application/json",
        };
        const formdata = new FormData();
        const { deletReason } = reason;
        formdata.append("reason", deletReason);
        let deleteReason = formdata.get("reason");

        console.log(formdata);

        if (deleteReason == "") {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                "merci de remplir le champ raison"
            );
            setShowModal({ ...showModal, loading: false });
            return;
        }
        const res = await RejectReimbursment(id, formdata, header);

        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            setShowModal({ ...showModal, loading: false });
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setShowModal({ ...showModal, spin: false });
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la demande de remboursement  a été refusée"
        );
        setResidence((prev) => {
            return prev.map((item) =>
                item.id == id ? { ...item, status: "Refusée" } : item
            );
        });
        setShowModal({ ...showModal, deletModal: false });
        setReason({
            ...reason,
            deletReason: "",
        });
        // setResidence(res.data.residences);
    };
    const filtResidence = async (data) => {
        setDateRange({
            ...dateRange,
            fromDate: data[0],
            toDate: data[1],
        });
        params = {
            ...params,
            fromDate: data[0],
            toDate: data[1],
        };
        fetReimbursment();
    };
    const refund = async (id) => {
        setShowModal({ ...showModal, spin: true });
        setShowModal({ ...showModal, loading: true });
        const header = {
            Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        };
        const res = await PayReimbursment(id, header);
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : "Session expiré",
                res.data.message
            );
            setPophover(false);
            if (res.status == 400) {
                return;
            }
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setShowModal({ ...showModal, spin: false,loading:false,rejectModal:false });
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = "Payée";
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la remboursement a été" + " " + res.data.status
        );
    };
    const fetReimbursment = async () => {
        const filteredObject = Object.fromEntries(
            Object.entries(params).filter(
                ([key, value]) =>
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    value !== 0
            )
        );
        console.log(filteredObject);
        setLoading(true);
        const res = await getReimbusment(filteredObject, headers);
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
        setPagination({ ...pagination, total: res.data.totalRequests });
        setResidence(res.data.requests);
        console.log(residence);
    };
    useEffect(() => {
        fetReimbursment();
    }, [pagination.current, filterValue.status, filtertext]);

    return (
        <main>
            <>
                <Header
                    title={"REMBOURSEMENTS"}
                    path={"Remboursement"}
                    children={
                        <FilterBoxe
                            setDateRange={setDateRange}
                            handleSearch={setFilterText}
                            dateRange={dateRange}
                            selectRange={filtResidence}
                            filtertext={filtertext}
                            placeHolder="Rechercher une demande"
                        />
                    }
                />
                {contextHolder}
                <ImgModal
                    tab={modalAray}
                    open={imageModal}
                    setOpen={setImageModal}
                />

                <Drawer
                    destroyOnClose={true}
                    placement="right"
                    onClose={onClose}
                    open={open}
                >
                    <div
                        style={{
                            position: "relative",
                        }}
                        className="top"
                    >
                        <Carousel autoplay>
                            {selectItem?.booking?.residence?.medias && (
                                <Image.PreviewGroup>
                                    <Image
                                        src={`${API_URL}/assets/uploads/residences/${selectItem?.booking?.residence?.medias[0]?.filename}`}
                                        alt=""
                                        width={352}
                                        className="carouselImg"
                                        style={{
                                            height: "160px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    {selectItem.booking?.residence?.medias.map(
                                        (item, index) => {
                                            return index == 0 ? null : (
                                                <div
                                                    style={{
                                                        display: "none",
                                                    }}
                                                    key={index}
                                                >
                                                    <Image
                                                        style={{
                                                            height: "300px",
                                                            objectFit: "cover",
                                                            display: "none",
                                                        }}
                                                        src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                                                        alt=""
                                                        width={352}
                                                    />
                                                </div>
                                            );
                                        }
                                    )}
                                </Image.PreviewGroup>
                            )}
                        </Carousel>
                        <div
                            onClick={() => setImageModal(true)}
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
                        >
                            <span>
                                <PictureOutlined /> +
                                {selectItem &&
                                    selectItem.booking?.residence?.medias
                                        ?.length}{" "}
                                photos
                            </span>
                        </div>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h4>Numéro de demande</h4>
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
                        <h4>Methode de versement hôte</h4>
                        <h4
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {(selectItem &&
                                selectItem.booking?.residence?.host
                                    ?.payment_method?.label) ||
                                "--"}
                        </h4>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectItem && selectItem.booking?.residence?.name}
                    </h2>
                    <span>
                        {selectItem && selectItem.booking?.residence?.address}
                    </span>
                    <Divider />
                    <div className="price">
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {selectItem &&
                                selectItem?.booking?.residence?.price
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                            XOF / nuits
                        </h2>
                        <p>Prix</p>
                    </div>
                    <Divider />
                    <h3
                        style={{
                            color: "#1B2559",
                            margin: "10px 0",
                        }}
                    >
                        Info Hôte
                    </h3>
                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",
                        }}
                        className="user"
                    >
                        <Avatar
                            src={`${API_URL}/assets/uploads/avatars/${selectItem?.booking?.residence?.host?.avatar}`}
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
                                {selectItem &&
                                    selectItem?.booking?.residence?.host
                                        ?.firstname}{" "}
                                {selectItem &&
                                    selectItem?.booking?.residence?.host
                                        ?.lastname}
                            </h3>
                            <p>
                                {selectItem &&
                                    selectItem?.booking?.residence?.host.email}
                            </p>
                            <p>
                                {selectItem &&
                                    selectItem?.booking?.residence?.host
                                        .contact}
                            </p>
                        </div>
                    </div>
                    <Divider />
                    <h3
                        style={{
                            color: "#1B2559",
                            margin: "10px 0",
                        }}
                    >
                        Info Client
                    </h3>
                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",
                        }}
                        className="user"
                    >
                        <Avatar
                            src={
                                selectItem &&
                                selectItem?.booking?.user?.avatar &&
                                `${API_URL}/assets/uploads/avatars/${selectItem?.booking?.user?.avatar}`
                            }
                            size={64}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "10px",
                            }}
                        >
                            <h3>
                                {selectItem &&
                                    selectItem?.booking?.user?.firstname}{" "}
                                {selectItem &&
                                    selectItem?.booking?.user?.lastname}
                            </h3>
                            <p>
                                {selectItem && selectItem?.booking?.user?.email}
                            </p>
                            <p>
                                {selectItem &&
                                    selectItem?.booking?.user?.contact}
                            </p>
                        </div>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h3
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Montant du remboursement
                        </h3>
                        <h3 style={{ color: "#A273FF" }}>
                            {selectItem?.refundedAmount} fcfa
                        </h3>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h3
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Date de la demande
                        </h3>
                        <h3>{FormatDate(selectItem?.createdAt)}</h3>
                    </div>
                    <Divider />
                    <div style={spaceStyle}>
                        <h3
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Statut de la demande
                        </h3>
                        <Tag
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                justifyContent: "center",
                                fontSize: "12px",
                                height: "18px",
                                padding: " 10px",
                            }}
                            color={renderColor(selectItem?.status)}
                        >
                            {selectItem?.status}
                        </Tag>
                    </div>
                    <Divider />
                    {selectItem && (
                        <>
                            <div>
                                <h3
                                    style={{
                                        color: "#1B2559",
                                    }}
                                >
                                    Motif de la demande
                                </h3>
                                <h4> {selectItem?.requestReason} </h4>
                            </div>
                        </>
                    )}

                    <Divider />
                </Drawer>

                <DeletModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    min={filterValue.min}
                    max={filterValue.max}
                    loading={showModal.loading}
                    onConfirme={() => {
                        deletResidence(selectItem.id);
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
                        refund(selectItem.id);
                    }}
                />
                <DataTable
                    data={residence}
                    size={12}
                    onChange={(page) => {
                        console.log(page);
                        setPagination({ ...pagination, current: page.current });
                    }}
                    column={columns}
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                        pageSize: 12,
                    }}
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
                            }}
                            size="large"
                            options={[
                                {
                                    value: "waiting",
                                    label: "En Attente",
                                },
                                {
                                    value: "accepted",
                                    label: "Acceptée",
                                },
                                {
                                    value: "rejected",
                                    label: "Rejetée",
                                },
                                {
                                    value: "cancelled",
                                    label: "Annulée",
                                },
                                {
                                    value: "paid",
                                    label: "Payée",
                                },
                            ]}
                        />
                    }
                />
            </>
        </main>
    );
};
export default Remboursement;
const FilterModal = ({
    min,
    max,
    setFilterValue,
    showModal,
    setShowModal,
    onConfirme,
    filterValue,
}) => {
    return (
        <Modal
            onCancel={() => setShowModal({ ...showModal, filterModal: false })}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() =>
                                setShowModal({
                                    ...showModal,
                                    filterModal: false,
                                })
                            }
                            danger
                            type="text"
                        >
                            Tout effacer
                        </Button>
                        <Button onClick={onConfirme} type="primary">
                            Chercher
                        </Button>
                    </div>
                </>
            }
            open={showModal.filterModal}
        >
            <div className="top">
                <h3>Fourchette de prix</h3>
                <Slider
                    onChange={(value) => {
                        console.log(value);
                        setFilterValue({
                            minPrice: value[0],
                            maxPrice: value[1],
                        });
                    }}
                    min={10000}
                    max={200000}
                    range
                    defaultValue={[min, max]}
                    step={1000}
                    tooltip={false}
                />
                <Space style={spaceStyle}>
                    <Input value={min + " " + "fcfa"} placeholder="min" />
                    -
                    <Input value={max + " " + "fcfa"} placeholder="max" />
                </Space>
                <Divider />
                <h3>Nombre de pièces</h3>
                <Space style={spaceStyle}>
                    <span>chambre</span>
                    <InputNumber
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                            width: "125px",
                        }}
                    />
                </Space>
                <Divider />

                <Space style={spaceStyle}>
                    <span>Salles de bain</span>
                    <InputNumber
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                            width: "125px",
                        }}
                    />
                </Space>
                <Divider />
                <h3>Nombre de personnes</h3>
                <Space style={spaceStyle}>
                    <span>Nombre de personnes</span>
                    <InputNumber
                        min={1}
                        max={7}
                        placeholder="00"
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
            </div>
        </Modal>
    );
};
const DeletModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    reason,
    setReason,
}) => {
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
                            Annuler
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
                            Confirmer
                        </Button>
                    </div>
                </>
            }
            open={showModal.deletModal}
        >
            <div className="top">
                <h3>Pourquoi est ce que vous refusez le paiement?</h3>
                <Input.TextArea
                    value={reason.deletReason}
                    onChange={(e) => {
                        setReason({ ...reason, deletReason: e.target.value });
                    }}
                    style={{
                        marginTop: "10px",
                    }}
                    placeholder="Raison de la suppression"
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
                            Annuler
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={onConfirme}
                            type="primary"
                            loading={loading}
                        >
                            Garder
                        </Button>
                    </div>
                </>
            }
            open={showModal.addModal}
        >
            <div className="top">
                <h3>Valider l’ajout</h3>
                <span>
                    Voulez vous vraiment valider l’ajout de cette résidence ?
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
                            Annuler
                        </Button>
                        <Button
                            style={{
                                borderRadius: "25px",
                            }}
                            onClick={onConfirme}
                            type="primary"
                            loading={loading}
                        >
                            Confirmer
                        </Button>
                    </div>
                </>
            }
            open={showModal.rejectModal}
        >
            <div className="top">
                <h4>voulez vous Valider la transaction ?</h4>
                <span>cette action est irréversible</span>
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
