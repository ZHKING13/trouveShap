import {
    Avatar,
    Carousel,
    Divider,
    Drawer,
    Space,
    Spin,
    Tag,
    notification,
    Image,
    Modal,
    Button,
    Select,
} from "antd";
import DataTable, { currencySign, renderColor, renderIcon } from "../components/DataTable";
import Header from "../components/Header";
import TableComponent from "../components/Table";
import {
    PictureOutlined,
    InfoOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { useTranslation} from 'react-i18next';
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API_URL, getReservation, PayHost } from "../feature/API";
import FilterBoxe from "../components/FilterBoxe";
import Map from "../components/Map";
import { Icon } from "../constant/Icon";
import { getLanguageId } from "../App";
import { getStatusKeyFromValue } from "../constant/status";

export function FormatDate(dateStr) {
    let lang = getLanguageId();
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang == "fr" ? "fr-FR" : "en-US", options);
}
export function filterNullUndefinedValues(obj) {
    const filteredObject = {};

    for (const key in obj) {
        if (
            obj.hasOwnProperty(key) &&
            obj[key] !== null &&
            obj[key] !== undefined &&
            obj[key] !== ""
        ) {
            filteredObject[key] = obj[key];
        }
    }

    return filteredObject;
}

const Reservation = () => {
    const { t, i18n } = useTranslation();
    const [spin, setSpin] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [load, setLoad] = useState(false);

    const columns = [
        {
            title: t("menu.residence"),
            dataIndex: "nom",
            key: "nom",
            render: (text, record) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                    onClick={() => showDrawer(record)}
                >
                    <img
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10%",
                        }}
                        src={`${API_URL}/assets/uploads/residences/${record?.residence?.medias[0].filename}`}
                        alt="residence image"
                    />
                    <div>
                        <p> {record.residence.name}</p>
                        <p style={{ fontSize: 12, color: "#888" }}>
                            {record.residence.address.substring(0, 18)}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: t("table.hote"),
            dataIndex: "owner",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>{record.residence.host.firstname}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.residence.host.email.substring(0, 10)}...
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.client"),
            dataIndex: "user",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>
                        {record.user.firstname} {record.user.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.user.email.substring(0, 10)}...
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.total"),
            dataIndex: "prix",
            key: "price",
            render: (text, record) => (
                <span>
                    {" "}
                    {record.total
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                    {currencySign()}
                </span>
            ),
            responsive: ["md"],
        },

        {
            title: t("table.date"),
            key: "date",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["md"],
        },
        {
            title: t("table.date_debut"),
            key: "date",
            dataIndex: "fromDate",
            render: (text) => (
                <span
                    style={{
                        fontSize: 12,
                    }}
                >
                    {FormatDate(text)}
                </span>
            ),
            responsive: ["lg"],
        },
        {
            title: t("table.date_fin"),
            key: "date",
            dataIndex: "toDate",
            render: (text) => (
                <span
                    style={{
                        fontSize: 12,
                    }}
                >
                    {FormatDate(text)}
                </span>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.status"),
            key: "status",
            render: (_, record) => (
                <Tag
                    icon={renderIcon(record.status)}
                    color={renderColor(record.status)}
                    key={record.status}
                >
                    {t("status." + getStatusKeyFromValue(record.status))}
                </Tag>
            ),
            responsive: ["md"],
        },
        {
            title: t("table.action"),
            key: "action",
            render: (_, record) => {
                return (record.status == "En Cours" ||
                    record.status == "Terminée") &&
                    !record.hostPaidAt ? (
                    <Spin spinning={selectItem?.id == record.id ? spin : null}>
                        <img
                            onClick={() => {
                                setSelectItem(record);
                                setShowModal(true);
                            }}
                            src={Icon.bank}
                            alt="paye icon"
                        />
                    </Spin>
                ) : null;
            },
            responsive: ["md"],
        },
    ];
    const [loading, setLoading] = useOutletContext();
    const [reservation, setReservation] = useState([]);
    const [open, setOpen] = useState(false);
    const [payementModal, setPayementModal] = useState(false);
    const [modalAray, setModalAray] = useState([]);
    const [status, setStatus] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        total: 7,
    });
    const [dateRange, setDateRange] = useState({
        fromDate: "",
        toDate: "",
    });
    const [location, setLocation] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [filtertext, setFilterText] = useState("");

    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const showDrawer = async (data) => {
        setSelectItem(data);
        let loc = {
            address: data.residence.address,
            lat: parseFloat(data.residence.lat),
            lng: parseFloat(data.residence.lng),
        };
        setLocation(loc);
        console.log(selectItem);
        console.log(location);
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        // setImgModal(false);
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    let params = {
        page: pagination.page,
        limit: 7,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        status: status,
        admin_search: filtertext,
    };
    const filtreByDate = (data) => {
        console.log("value", data);

        // Stocker la nouvelle valeur dans une variable locale
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

        console.log("dateRange après la mise à jour", dateRange);
        fetchReservation();
    };
    const sendHostMoney = async (id) => {
        setSpin(true);
        setLoad(true);
        const header = {
            Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        };
        const res = await PayHost(id, header);
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                res.status == 400 ? "ERREUR" : t("error.401"),
                res.data.message
            );
            if (res.status == 400) {
                return;
            }
            setSpin(false);
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        setReservation((prev) => {
            return prev.map((item) => {
                if (item.id == id) {
                    item.status = res.data.status;
                }
                return item;
            });
        });
        setSpin(false);
        setLoad(false);
        setShowModal(false);
        console.log(res);
        openNotificationWithIcon("success",  res.data.status);
    };
    const fetchReservation = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log("params: ", filteredObject);
        const res = await getReservation(filteredObject, headers);
        if (res.status !== 200) {
            openNotificationWithIcon("error", t("error.401"), t("error.retry1"));
            localStorage.clear();
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            return;
        }
        console.log(res);
        setReservation(res.data?.bookings);
        setPagination({
            ...pagination,
            total: res.data?.totalBookings,
        });
        setLoading(false);
    };
    useEffect(() => {
        fetchReservation();
    }, [pagination.page, status, filtertext]);
    return (
        <main>
            <>
                <Header
                    title={t("menu.reservation")}
                    path={t("menu.reservation")}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            setDateRange={setDateRange}
                            dateRange={dateRange}
                            filtertext={filtertext}
                            selectRange={filtreByDate}
                            placeHolder={t("filter.reservation")}
                        />
                    }
                />
                <DrawerComponent
                    showDrawer={showDrawer}
                    selectItem={selectItem}
                    onClose={onClose}
                    open={open}
                    setModalAray={setModalAray}
                    location={location}
                    payementModal={payementModal}
                    setPayementModal={setPayementModal}
                />
                <RequestModal
                    setShowModal={setShowModal}
                    showModal={showModal}
                    loading={load}
                    onConfirme={() => sendHostMoney(selectItem.id)}
                />
                <DataTable
                    column={columns}
                    data={reservation}
                    size={7}
                    onChange={({ current }) => {
                        setPagination({
                            ...pagination,
                            page: current,
                        });
                    }}
                    pagination={{
                        total: pagination.total,
                        showSizeChanger: false,
                    }}
                    children={
                        <Select
                            placeholder={t("filter.byStatus")}
                            style={{ width: 180, marginRight: "13px" }}
                            allowClear
                            onChange={(value) => {
                                setStatus(value);
                                console.log("ok", value);
                            }}
                            size="large"
                            options={[
                                {
                                    value: "waiting",
                                    label: t("status.waiting"),
                                },
                                {
                                    value: "accepted",
                                    label: t("status.accepted"),
                                },
                                {
                                    value: "done",
                                    label: t("status.done"),
                                },
                                {
                                    value: "host_paid",
                                    label: t("status.hostPaid"),
                                },
                                {
                                    value: "progressing",
                                    label: t("status.progressing"),
                                },
                                {
                                    value: "rejected",
                                    label: t("status.rejected"),
                                },
                                {
                                    value: "cancelled",
                                    label: t("status.cancelled"),
                                },
                                {
                                    value: "refunded",
                                    label: t("status.refunded"),
                                },
                                {
                                    value: "planified",
                                    label: t("status.planified"),
                                },
                            ]}
                        />
                    }
                />
            </>
        </main>
    );
};
export default Reservation;
export const RequestModal = ({
    setShowModal,
    showModal,
    onConfirme,
    loading,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal
            width={300}
            onCancel={() => {
                setShowModal(false);
                setReason("");
            }}
            centered
            maskClosable={false}
            footer={
                <>
                    <Divider />
                    <div style={spaceStyle}>
                        <Button
                            onClick={() => {
                                setShowModal(false);

                                setReason("");
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
            open={showModal}
        >
            <div className="top">
                <h4>{t("reservaton.valide")}</h4>
                <span>{t("reservaton.valideDescription")}</span>
            </div>
        </Modal>
    );
};
const subtitleSryle = {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    justifyContent: "space-around",
    fontSize: "12px",
    fontWeight: "bold",
};
const spaceStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    justifyContent: "space-between",
};
const listStyle = {
    fontWeight: "bold",
};

export const DrawerComponent = ({
    selectItem,
    onClose,
    showDrawer,
    open,

    location,
    setPayementModal,
    payementModal,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Drawer
            style={{
                overflowX: "hidden",
            }}
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
                    {selectItem?.residence?.medias && (
                        <Image.PreviewGroup>
                            <Image
                                style={{
                                    height: "160px",
                                    objectFit: "cover",
                                }}
                                width={352}
                                id="carouselImgs"
                                className="carouselImg"
                                src={`${API_URL}/assets/uploads/residences/${selectItem?.residence?.medias[0].filename}`}
                            />
                            {selectItem?.residence?.medias?.map((item, index) =>
                                index == 0 ? null : (
                                    <div
                                        style={{
                                            display: "none",
                                        }}
                                        key={item.filename}
                                    >
                                        <Image
                                            src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                                            alt="rei"
                                        />
                                    </div>
                                )
                            )}
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
                        {selectItem && selectItem?.residence?.medias?.length}{" "}
                        photos
                    </span>
                </div>
            </div>
            <Divider />
            <div style={spaceStyle}>
                <h4>{t("reservaton.reservationNumber")}</h4>
                <h4
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectItem && selectItem?.serial_number}
                </h4>
            </div>
            {/*<Divider />
            <div style={spaceStyle}>
                <h4>Methode de versement hôte</h4>
                <h4
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {(selectItem &&
                        selectItem.residence?.host?.payment_method?.label) ||
                        "--"}
                </h4>
            </div>*/}
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {selectItem && selectItem?.residence?.name}
            </h2>
            <span>{selectItem && selectItem?.residence?.address}</span>
            <Divider />
            <div className="price">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectItem &&
                    selectItem?.preview_price_result
                        ?.averagePricePerNightWithoutFee
                        ? selectItem?.preview_price_result?.averagePricePerNightWithoutFee.toLocaleString()
                        : selectItem?.residence?.price.toLocaleString()}{" "}
                    {currencySign()} / {t("other.nuits")}
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
                    src={
                        selectItem &&
                        `${API_URL}/assets/uploads/avatars/${selectItem?.residence?.host?.avatar}`
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
                        {selectItem && selectItem?.residence?.host?.firstname}{" "}
                        {selectItem && selectItem?.residence?.host?.lastname}
                    </h3>
                    <p>{selectItem && selectItem?.residence?.host?.email}</p>
                    <p>{selectItem && selectItem?.residence?.host?.contact}</p>
                </div>
            </div>
            <Divider />
            <h3
                style={{
                    color: "#1B2559",
                    margin: "10px 0",
                }}
            >
                {t("reservaton.clientInfo")}
            </h3>
            <div
                style={{
                    display: "flex",

                    alignItems: "center",
                }}
                className="user"
            >
                <Avatar
                    src={`${API_URL}/assets/uploads/avatars/${selectItem?.user?.avatar}`}
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
                        {selectItem && selectItem?.user?.firstname}{" "}
                        {selectItem && selectItem?.user?.lastname}
                    </h3>
                    <p>{selectItem && selectItem?.user?.email}</p>
                    <p>{selectItem && selectItem?.user?.contact}</p>
                </div>
            </div>
            <Divider />
            <div orientation="vertical">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {t("menu.reservation")}
                </h2>
                <div>
                    <span></span>
                    <h3>
                        {selectItem && selectItem.adults}{" "}
                        {t("reservaton.personnes")}
                    </h3>
                </div>
            </div>
            <Divider />

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
                        <p>{t("reservaton.start")}</p>
                    </div>
                    <h3>{FormatDate(selectItem?.fromDate)} </h3>
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
                        <p>{t("reservaton.end")}</p>
                    </div>
                    <h3>{FormatDate(selectItem?.toDate)} </h3>
                </div>
            </div>

            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {t("reservaton.amount")}
            </h2>
            <div style={spaceStyle}>
                <span>{t("reservaton.subTotal")}:</span>
                <h3>
                    {selectItem?.preview_price_result?.normalSubtotal
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            <div style={spaceStyle}>
                <span>{t("reservaton.subTotal2")}:</span>
                <h3>
                    {selectItem?.subtotal
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            <div style={spaceStyle}>
                <span>{t("reservaton.fee")}:</span>
                <h3>
                    {selectItem?.fee
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            <div style={spaceStyle}>
                <span>Total:</span>
                <h3>
                    {selectItem?.total
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            {selectItem?.preview_price_result && (
                <>
                    <Divider />
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {t("reservaton.resume")}
                    </h2>

                    {selectItem?.preview_price_result?.recap.map(
                        (item, index) => {
                            return (
                                <div key={index} style={spaceStyle}>
                                    <span>{item?.label}</span>
                                    <h3>
                                        {item?.count}*{item?.price}
                                    </h3>
                                </div>
                            );
                        }
                    )}
                </>
            )}

            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {t("reservaton.Revenus")}
            </h2>
            <div style={spaceStyle}>
                <span>{t("reservaton.partHote")} :</span>
                <h3>
                    {selectItem?.hostMoney
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            <div style={spaceStyle}>
                <span>{t("reservaton.partTc")} :</span>
                <h3>
                    {selectItem?.companyMoney
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </h3>
            </div>
            <Divider />
            {selectItem?.versementInfos !== null && (
                <div
                    onClick={() => {
                        setPayementModal(true);
                    }}
                    style={{
                        cursor: "pointer",
                        backgroundColor: "#ECE3FF",
                        padding: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderRadius: "8px",
                    }}
                >
                    <h3
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {t("reservaton.payement")}
                    </h3>
                    <RightOutlined
                        color="#A273FF"
                        size={34}
                        style={{
                            backgroundColor: "#F6F1FF",
                            fontSize: "20px",
                            borderRadius: "50%",
                            padding: "8px",
                        }}
                    />
                </div>
            )}
            <PayementModal
                open={payementModal}
                versementInfos={selectItem?.versementInfos}
                paymentMethode={selectItem?.versement_method}
                setOpen={setPayementModal}
                otherPayment={selectItem?.residence?.host?.hostPaymentMethods}
                icon={
                    <InfoOutlined
                        color="#fff"
                        style={{
                            backgroundColor: "#F59F0B",
                            padding: "5px",
                            borderRadius: "50%",
                            color: "#fff",
                        }}
                    />
                }
            />
            <Divider />
            <div style={spaceStyle}>
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {t("reservaton.code")}
                </h2>
                <h3 style={{ color: "#A273FF" }}>
                    {selectItem?.clientCode || "--"}
                </h3>
            </div>
            <Divider />
            <div style={spaceStyle}>
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {t("reservaton.status")}
                </h2>
                <Tag color={renderColor(selectItem?.status)}>
                    {selectItem?.status}
                </Tag>
            </div>
            <Divider />
            {selectItem?.cancelledAt != null && (
                <>
                    <div style={spaceStyle}>
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {t("reservaton.cancelDate")}
                        </h2>
                        <h3>{FormatDate(selectItem?.cancelledAt)}</h3>
                    </div>
                    <Divider />
                    <div>
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            {t("reservaton.cancelReason")}
                        </h2>
                        <h3>
                            {getLanguageId() == "fr"
                                ? selectItem?.cancelReason
                                : selectItem?.cancelReasonEn}
                        </h3>
                    </div>
                </>
            )}
            <Divider />
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
                        <li style={listStyle}>{t("other.entre1mois_3mois")}</li>
                        <span>
                            {selectItem?.residence?.refundGrid?.[
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
                            {selectItem?.residence?.refundGrid?.[
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
                            {selectItem?.residence?.refundGrid?.[
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
                            {selectItem?.residence?.refundGrid?.[
                                "Moins de 48 heures avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                    <div style={spaceStyle}>
                        <li style={listStyle}>{t("other.plus3mois_1jour")}</li>
                        <span>
                            {" "}
                            {selectItem?.residence?.refundGrid?.[
                                "Plus de 3 mois avant le jour J"
                            ] + "%"}
                        </span>
                    </div>
                </ul>
            </div>
            <Divider />
            <Map location={location} />
        </Drawer>
    );
};
export const ImgModal = ({ tab, open, setOpen }) => {
    return (
        <Modal
            width={"90vw"}
            style={{ width: "100vw" }}
            onCancel={() => setOpen(false)}
            footer={() => {
                return (
                    <Button type="primary" onClick={() => setOpen(false)}>
                        OK
                    </Button>
                );
            }}
            open={open}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    rowGap: "16px",
                    flexWrap: "wrap",
                    // width: "100vw",
                }}
            >
                {tab?.map((item) => {
                    return (
                        <Image
                            key={item.filename}
                            style={{
                                width: "350px",
                                height: "256px",
                                objectFit: "cover",
                                resizeMode: "cover",
                            }}
                            src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                        />
                    );
                })}
            </div>
        </Modal>
    );
};
const PayementModal = ({
    open,
    setOpen,
    paymentMethode,
    versementInfos,
    icon,
    otherPayment,
}) => {
    const { t, i18n } = useTranslation();
    return (
        <Modal
            width={500}
            onCancel={() => setOpen(false)}
            footer={() => {
                return (
                    <div
                        style={{
                            width: "100%",
                            borderRadius: "25px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            marginBottom: "10px",
                            textAlign: "center",
                            backgroundColor: "#A273FF",
                            color: "#fff",
                        }}
                       
                        onClick={() => setOpen(false)}
                    >
                        {t("button.close")}
                    </div>
                );
            }}
            open={open}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                    }}
                >
                    <h3>{paymentMethode?.label}</h3>
                    {versementInfos?.tempVers == "true" && (
                        <Tag color="#22C55E">{t("reservaton.temp")}</Tag>
                    )}
                </div>
                {versementInfos?.tempVers == "true" && (
                    <div style={spaceStyle}>
                        <p
                            style={{
                                color: "#6B7280",
                            }}
                        >
                            {t("reservaton.addDate")} :
                        </p>
                        <h4 style={{ color: "#000" }}>
                            {new Date(
                                versementInfos?.tempVersDate
                            ).toLocaleDateString("fr-FR")}
                        </h4>
                    </div>
                )}
                <div style={spaceStyle}>
                    <p
                        style={{
                            color: "#6B7280",
                        }}
                    >
                        client :
                    </p>
                    <h4 style={{ color: "#000" }}>
                        {versementInfos?.fullname || "--"}
                    </h4>
                </div>
                <div style={spaceStyle}>
                    <p
                        style={{
                            color: "#6B7280",
                        }}
                    >
                        {paymentMethode?.code == "rib"
                            ? t("reservaton.bank")
                            : t("reservaton.phone")}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={`${API_URL}/assets/icons/payment_methods/${paymentMethode?.icon}`}
                            alt=""
                        />
                        <h4 style={{ color: "#000" }}>
                            {versementInfos?.indicatif || "--"}{" "}
                            {versementInfos?.contact || "--"}
                        </h4>
                    </div>
                </div>
                {paymentMethode?.code == "rib" && (
                    <div style={spaceStyle}>
                        <p
                            style={{
                                color: "#6B7280",
                            }}
                        >
                            RIB :
                        </p>
                        <h4 style={{ color: "#000" }}>
                            {item?.infos?.rib || "--"}
                        </h4>
                    </div>
                )}
                <div
                    style={{
                        backgroundColor: "#FEF5E7",
                        padding: "10px",
                        borderRadius: "8px",
                        display: "flex",
                        gap: "10px",
                        margin: "8px 0px 5px 0px",
                    }}
                >
                    {icon} <p>{t("reservaton.otherPayment")}</p>
                </div>
                {otherPayment?.map((item, index) => {
                    return (
                        <div key={index}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "15px",
                                }}
                            >
                                <h3>{item?.payment_method?.label}</h3>
                                {item?.infos?.tempVers == "true" && (
                                    <Tag color="#22C55E">{t("reservaton.temp")}</Tag>
                                )}
                            </div>
                            {item?.infos?.tempVers == "true" && (
                                <div style={spaceStyle}>
                                    <p
                                        style={{
                                            color: "#6B7280",
                                        }}
                                    >
                                        {t("reservaton.addDate")} :
                                    </p>
                                    <h4 style={{ color: "#000" }}>
                                        {new Date(
                                            versementInfos?.tempVersDate
                                        ).toLocaleDateString("fr-FR")}
                                    </h4>
                                </div>
                            )}
                            <div style={spaceStyle}>
                                <p
                                    style={{
                                        color: "#6B7280",
                                    }}
                                >
                                    client :
                                </p>
                                <h4 style={{ color: "#000" }}>
                                    {item?.infos?.fullname || "--"}
                                </h4>
                            </div>
                            <div style={spaceStyle}>
                                <p
                                    style={{
                                        color: "#6B7280",
                                    }}
                                >
                                    {item.payment_method?.code == "rib"
                                        ? "Banque :"
                                        : "numero de téléphone :"}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={`${API_URL}/assets/icons/payment_methods/${item?.payment_method?.icon}`}
                                        alt=""
                                    />
                                    <h4 style={{ color: "#000" }}>
                                        {item?.infos?.indicatif ||
                                            item?.infos?.bankname}{" "}
                                        {item?.infos?.contact || ""}
                                    </h4>
                                </div>
                            </div>
                            {item.payment_method?.code == "rib" && (
                                <div style={spaceStyle}>
                                    <p
                                        style={{
                                            color: "#6B7280",
                                        }}
                                    >
                                        RIB :
                                    </p>
                                    <h4 style={{ color: "#000" }}>
                                        {item?.infos?.rib || "--"}
                                    </h4>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};
