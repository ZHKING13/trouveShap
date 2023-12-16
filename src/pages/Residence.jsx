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
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Map from "../components/Map";
import { deleteResidence, getResidence, updateResidence } from "../feature/API";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import FilterBoxe from "../components/FilterBoxe";
import { Icon } from "../constant/Icon";

const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
const Residence = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useOutletContext();
    const [filtertext, setFilterText] = useState("");
    const [residence, setResidence] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectItem, setSelectItem] = useState(null);
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
                >
                    <img
                        onClick={() => {
                            showDrawer(record);
                        }}
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10%",
                        }}
                        src={`https://api.trouvechap.com/assets/uploads/residences/${record.medias[0].filename}`}
                        alt=""
                    />
                    <div>
                        <p>{text}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record.address}
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
                        {record.host.firstname} {record.host.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Prix / nuits",
            dataIndex: "price",
            key: "price",
            render: (text) => <span>{text} fcfa </span>,
            responsive: ["md"],
        },
        {
            title: "Moyen de paiement",
            key: "payment",
            dataIndex: "payment",
            render: (text) => <span>{text} </span>,
            responsive: ["md"],
        },
        {
            title: "Date d'ajout",
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
                    icon={renderIcon(record.status)}
                    color={renderColor(record.status)}
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
                    <Space>
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                setShowModal({
                                    ...showModal,
                                    addModal: true,
                                });
                            }}
                            src={Icon.valid}
                            alt="accept icon"
                        />
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                setShowModal({
                                    ...showModal,
                                    rejectModal: true,
                                });
                            }}
                            src={Icon.cancel}
                            alt="reject icon"
                        />
                    </Space>
                ) : (
                    <img
                        onClick={() => {
                            setSelectItem(record);
                            setShowModal({ ...showModal, deletModal: true });
                        }}
                        src={Icon.trash}
                        alt="delet icon"
                    />
                );
            },
            responsive: ["lg"],
        },
    ];
    const updateResidences = async (id, status, reason) => {
        setShowModal({ ...showModal, loading: true });
        const formeData = new FormData();
        formeData.append("status", status);
        formeData.append("reason", reason);
        if (reason == "") {
            openNotificationWithIcon(
                "error",
                "ERREUR",
                "merci de remplir le champ raison"
            );
            setShowModal({ ...showModal, loading: false });
            return;
        }
        const res = await updateResidence(id, formeData, headers);
        setShowModal({ ...showModal, loading: false });
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
                    item.status = status;
                }
                return item;
            });
        });
        console.log(res);
        openNotificationWithIcon(
            "success",
            "SUCCES",
            "la résidence a été" + " " + status
        );

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
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        page: pagination.current,
        fromDate: "2023-11-11T00:00:00.000Z",
        toDate: "2023-12-20T00:00:00.000Z",
        limit: 7,
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
            "la résidence a été supprimé"
        );
        setResidence((prev) => {
            return prev.filter((item) => item.id !== id);
        });
        setShowModal({ ...showModal, deletModal: false });
        setReason({
            ...reason,
            deletReason: "",
        });
        // setResidence(res.data.residences);
    };
    const fetchResidence = async (page) => {
        setLoading(true);
        const res = await getResidence(
            {
                ...params,
                page,
                // minPrice: filterValue.minPrice,
                // maxPrice: filterValue.maxPrice,
            },
            headers
        );
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
        fetchResidence(1);
    }, [pagination.current]);

    return (
        <main
          
        >
            <>
                <Header
                    title={"RESIDENCES"}
                    path={"Résidences"}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            filtertext={filtertext}
                            children={
                                <img onClick={() => {
                                    setShowModal({...showModal,filterModal:true})
                                }} src={Icon.filter} alt="filter icon" />
                            }
                        />
                    }
                />
                {contextHolder}
                <Drawer placement="right" onClose={onClose} open={open}>
                    <div
                        style={{
                            position: "relative",
                        }}
                        className="top"
                    >
                        <Carousel autoplay>
                            {selectItem &&
                                selectItem.medias.map((item) => (
                                    <div>
                                        <img
                                            style={{
                                                width: "100%",
                                                height: "156px",
                                                objectFit: "cover",
                                                resizeMode: "cover",
                                            }}
                                            src={`https://api.trouvechap.com/assets/uploads/residences/${item.filename}`}
                                            alt=""
                                        />
                                    </div>
                                ))}
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
                            }}
                        >
                            <span>
                                <PictureOutlined /> +
                                {selectItem && selectItem.medias.length} photos
                            </span>
                        </div>
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
                            {selectItem && selectItem.price} fcfa / nuits
                        </h2>
                        <p>Prix</p>
                    </div>
                    <Divider />
                    <div
                        style={{
                            display: "flex",

                            alignItems: "center",
                        }}
                        className="user"
                    >
                        <Avatar size={64} />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: "10px",
                            }}
                        >
                            <p>Hôte</p>
                            <h3
                                style={{
                                    color: "#1B2559",
                                }}
                            >
                                {selectItem && selectItem.host.firstname}{" "}
                                {selectItem && selectItem.host.lastname}
                            </h3>
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
                            <span>Animaux autorisé </span>
                            <span> Interdiction de fumer</span>
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
                            <li style={listStyle}>
                                Annulation entre 48h et 1 semaine
                            </li>
                            <span>
                                Montant à rembourser : 25% du montant total
                            </span>
                            <li style={listStyle}>
                                Annulation entre 1 semaine 1 mois
                            </li>
                            <span>
                                Montant à rembourser : 25% du montant total
                            </span>
                            <li style={listStyle}>
                                Annulation entre 1 mois et 3 mois
                            </li>
                            <span>
                                Montant à rembourser : 25% du montant total
                            </span>
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
                />
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
                <ConfrimeModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    loading={showModal.loading}
                    onConfirme={() => {
                        updateResidences(
                            selectItem.id,
                            "Accepté",
                            reason.acceptReason
                        );
                    }}
                />
                <RejectModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setFilterValue={setFilterValue}
                    loading={showModal.loading}
                    onConfirme={() => {
                        updateResidences(
                            selectItem.id,
                            "Refusé",
                            reason.rejectReason
                        );
                    }}
                />
                <DataTable
                    data={residence?.filter((item) => {
                        return item?.name
                            ?.toLowerCase()
                            .includes(filtertext?.toLowerCase());
                    })}
                    size={12}
                    onChange={(page) => {
                        fetchResidence(page)
                    }}
                    column={columns}
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                        pageSize: 12,
                    }}
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
                        <Button
                            onClick={() =>
                                setShowModal({
                                    ...showModal,
                                    filterModal: false,
                                })
                            }
                            type="primary"
                        >
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
                    defaultValue={[15000, 75000]}
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
                        addonAfter={<span style={{ fontSize: "12px" }}>+</span>}
                        addonBefore={
                            <span style={{ fontSize: "12px" }}>-</span>
                        }
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                        }}
                    />
                </Space>
                <Divider />

                <Space style={spaceStyle}>
                    <span>Salles de bain</span>
                    <InputNumber
                        addonAfter={<span style={{ fontSize: "12px" }}>+</span>}
                        addonBefore={
                            <span style={{ fontSize: "12px" }}>-</span>
                        }
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
                        }}
                    />
                </Space>
                <Divider />
                <h3>Nombre de personnes</h3>
                <Space style={spaceStyle}>
                    <span>Nombre de personnes</span>
                    <InputNumber
                        addonAfter={<span style={{ fontSize: "12px" }}>+</span>}
                        addonBefore={
                            <span style={{ fontSize: "12px" }}>-</span>
                        }
                        min={1}
                        max={7}
                        placeholder="00"
                        style={{
                            textAlign: "center",
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
                            Supprimer
                        </Button>
                    </div>
                </>
            }
            open={showModal.deletModal}
        >
            <div className="top">
                <h3>Confirmer la suppression</h3>
                <span>Voulez vous vraiment supprimer ces données ?</span>
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
const ConfrimeModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    setReason,
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
                    }}
                />
            </div>
        </Modal>
    );
};
const RejectModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
    setReason,
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
                                    addModal: false,
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
                        setReason({ ...reason, rejectReason: e.target.value });
                    }}
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
