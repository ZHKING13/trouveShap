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
    Select,
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "../components/Map";
import {
    API_URL,
    deleteResidence,
    getResidence,
    updateResidence,
} from "../feature/API";

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
const Residence = () => {
    const [loading, setLoading] = useOutletContext();
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
    const [filterValue, setFilterValue] = useState({
        minPrice: 0,
        maxPrice: 0,
        numPeople: "",
        status: "",
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
        admin_search:filtertext

    };

    const deletResidence = async (id) => {
        setShowModal({ ...showModal, loading: true });
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
        const res = await deleteResidence(id, formdata, header);

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
        setShowModal({ ...showModal, loading: false });
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été desactivé"
        );
        setResidence((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = "Désactivé";
                }
                return item;
            });
        });
        setShowModal({ ...showModal, deletModal: false });
        setReason({
            ...reason,
            deletReason: "",
        });
        // setResidence(res.data.residences);
    };
    const filtResidence = async () => {
        setShowModal({
            ...showModal,
            filterModal: false,
        });
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
        fetchResidence();
    };
    const fetchResidence = async () => {
        const filteredObject = Object.fromEntries(
            Object.entries(params).filter(
                ([key, value]) =>
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    value !== 0
            )
        );
        setLoading(true);
        const res = await getResidence(filteredObject, headers);
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
    }, [pagination.current, filterValue.status,filtertext]);

    return (
        <main>
            <>
                <Header
                    title={"RESIDENCES"}
                    path={"Résidences"}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            filtertext={filtertext}
                            onClick={() => {
                                setShowModal({
                                    ...showModal,
                                    filterModal: true,
                                });
                            }}
                            placeHolder={"Rechercher une résidence"}
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
                    }
                />
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
                        >
                            <span>
                                <PictureOutlined /> +
                                {selectItem && selectItem.medias.length} photos
                            </span>
                        </div>
                    </div>
                    <Divider />
                    <div  style={spaceStyle}>
                    <h2>
                            Numero de Serie
                        </h2>
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectItem && selectItem.serial_number}
                    </h2>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectItem && selectItem.name}
                    </h2>
                    <span>{selectItem && selectItem.address}</span>
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
                                {selectItem && selectItem.host.firstname}{" "}
                                {selectItem && selectItem.host.lastname}
                            </h3>
                            <p>{selectItem && selectItem?.host?.email}</p>
                            <p>{selectItem && selectItem?.host?.contact}</p>
                        </div>
                    </div>
                    <Divider />
                    <div orientation="vertical">
                        <h2>Comodités</h2>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "5px",
                                marginTop: "10px",
                            }}
                        >
                            <Space className="comodite">
                                <img src={Icon.clim} /> Climatisation
                            </Space>
                            <Space className="comodite">
                                <img src={Icon.tv} /> Télévision
                            </Space>
                            <Space className="comodite">
                                <img src={Icon.wash} /> Lave linge
                            </Space>
                            <Space className="comodite">
                                <img src={Icon.wifi} /> Wifi
                            </Space>
                            <Space className="comodite">
                                <img src={Icon.refri} /> Réfrigérateur
                            </Space>
                            <Space className="comodite">
                                <img src={Icon.fan} /> Ventilateur
                            </Space>
                        </div>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        Aperçu
                    </h2>
                    <div
                        style={{
                            display: "flex",

                            gap: "5px",
                            marginTop: "10px",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                            className="left"
                        >
                            <div style={subtitleSryle} className="subti">
                                <img src={Icon.check} alt="" />
                                <p>Règlement interieur</p>
                            </div>
                            {selectItem?.rules?.map((item) => {
                                return <span>{item.rule?.title}</span>;
                            })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                            }}
                            className="rigth"
                        >
                            <div style={subtitleSryle} className="subti">
                                <img src={Icon.check} alt="" />
                                <p>Type d’activités sociales</p>
                            </div>
                            <span>Baptêmes</span>
                            <span>Mariages</span>
                            <span>Anniversaires</span>
                        </div>
                    </div>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        Grille de remboursement
                    </h2>
                    <div>
                        <ul>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    Entre 1 et 3 mois avant le jour J
                                </li>
                                <span>
                                    {selectItem?.refundGrid[
                                        "Entre 1 mois et 3 mois avant le jour J"
                                    ] + "%"}
                                </span>
                            </div>
                            <div style={spaceStyle}>
                                <li style={listStyle}>
                                    Entre 1 semaine et 1 mois avant le jour J
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
                                    Entre 48h et 1 semaine avant le jour J
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
                                    Moins de 48 heures avant le jour J
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
                                    Plus de 3 mois avant le jour J
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
                />
                <DeletModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    min={filterValue.min}
                    max={filterValue.max}
                    loading={showModal.loading}
                    onConfirme={() => {
                        console.log(selectItem);
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
                        updateResidences(
                            selectItem.id,
                            "rejected",
                            reason.rejectReason
                        );
                    }}
                />
                <DataTable
                    data={residence}
                    size={12}
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
                        showSizeChanger: false,
                        pageSize: 12,
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
                                    label: "En Attente",
                                },
                                {
                                    value: "active",
                                    label: "Activé",
                                },
                                {
                                    value: "rejected",
                                    label: "Rejeté",
                                },
                                {
                                    value: "deleted",
                                    label: "Désactivé",
                                },
                            ]}
                        />
                    }
                />
            </>
        </main>
    );
};
export default Residence;
const FilterModal = ({
    min,
    max,
    setFilterValue,
    showModal,
    setShowModal,
    onConfirme,
    filterValue,
    filtResidence,
    numPeople,
}) => {
    return (
        <Modal
            onCancel={() => {
                setShowModal({ ...showModal, filterModal: false });
            }}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setFilterValue({
                                    ...filterValue,
                                    minPrice: 0,
                                    maxPrice: 0,
                                    numPeople: "",
                                });
                                console.log(filterValue);
                                setShowModal({
                                    ...showModal,
                                    filterModal: false,
                                });

                                filtResidence();
                            }}
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
                            ...filterValue,
                            minPrice: value[0],
                            maxPrice: value[1],
                        });
                    }}
                    min={10000}
                    max={500000}
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
            </div>
        </Modal>
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
                            Garder
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
                            Desactivé
                        </Button>
                    </div>
                </>
            }
            open={showModal.deletModal}
        >
            <div className="top">
                <h3>Confirmer la desactivation</h3>
                <Input.TextArea
                    value={reason.deletReason}
                    onChange={(e) => {
                        setReason({ ...reason, deletReason: e.target.value });
                    }}
                    style={{
                        marginTop: "10px",
                    }}
                    placeholder="Raison de la desactivation"
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
                            Confirmer
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
                <h3>Valider le refus</h3>
                <span>
                    Voulez vous vraiment refuser l’ajout de cette résidence ?
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
