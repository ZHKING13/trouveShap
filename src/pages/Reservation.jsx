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
} from "antd";
import DataTable, { renderColor, renderIcon } from "../components/DataTable";
import Header from "../components/Header";
import TableComponent from "../components/Table";
import { PictureOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { API_URL, getReservation } from "../feature/API";
import FilterBoxe from "../components/FilterBoxe";
import Map from "../components/Map";
import { Icon } from "../constant/Icon";
function FormatDate(dateStr) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", options);
}
export function filterNullUndefinedValues(obj) {
    const filteredObject = {};

    for (const key in obj) {
        if (
            obj.hasOwnProperty(key) &&
            obj[key] !== null &&
            obj[key] !== undefined
        ) {
            filteredObject[key] = obj[key];
        }
    }

    return filteredObject;
}
const Reservation = () => {
    const columns = [
        {
            title: "Résidences",
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
                            {record.residence.address}
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
                    <p>{record.residence.host.firstname}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.residence.host.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Client",
            dataIndex: "user",
            key: "owner",
            render: (text, record) => (
                <div>
                    <p>
                        {record.user.firstname} {record.user.lastname}
                    </p>
                    <p style={{ fontSize: 12, color: "#888" }}>
                        {record.user.email}
                    </p>
                </div>
            ),
            responsive: ["md"],
        },
        {
            title: "Total",
            dataIndex: "prix",
            key: "price",
            render: (text, record) => (
                <span> {record.residence.price} fcfa </span>
            ),
            responsive: ["md"],
        },

        {
            title: "Date d'ajout",
            key: "date",
            dataIndex: "createdAt",
            render: (text) => <span>{FormatDate(text)}</span>,
            responsive: ["md"],
        },
        {
            title: "Date de debut",
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
            title: "Date de fin",
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
            title: "Statut",
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
    ];
    const [loading, setLoading] = useOutletContext();
    const [reservation, setReservation] = useState([]);
    const [open, setOpen] = useState(false);
    const [imgModal, setImgModal] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [modalAray, setModalAray] = useState([]);
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
        setImgModal(false);
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
    };
    const filtreByDate = (data) => {
        console.log("value", data);

        // Stocker la nouvelle valeur dans une variable locale
        params = {
            ...params,
            fromDate: data[0],
            toDate: data[1],
        };

        console.log("dateRange après la mise à jour", params);
        fetchReservation();
    };

    const fetchReservation = async () => {
        setLoading(true);
        const filteredObject = filterNullUndefinedValues(params);
        console.log("params: ", filteredObject);
        const res = await getReservation(filteredObject, headers);
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
    }, [pagination.page]);
    return (
        <main>
            <>
                <Header
                    title={"RESERVATION"}
                    path={"Réservations"}
                    children={
                        <FilterBoxe
                            handleSearch={setFilterText}
                            setDateRange={setDateRange}
                            dateRange={dateRange}
                            filtertext={filtertext}
                            selectRange={filtreByDate}
                            placeHolder={"Chercher une réservation"}
                        />
                    }
                />
                <DrawerComponent
                    showDrawer={showDrawer}
                    selectItem={selectItem}
                    onClose={onClose}
                    open={open}
                    setImgModal={setImgModal}
                    setModalAray={setModalAray}
                    imgModal={imgModal}
                    location={location}
                />
                <ImgModal
                    setOpen={setImgModal}
                    open={imgModal}
                    tab={modalAray}
                />
                <DataTable
                    column={columns}
                    data={reservation.filter((item) => {
                        return item?.residence?.name
                            .toLowerCase()
                            .includes(filtertext.toLowerCase());
                    })}
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
                        pageSize: 12,
                    }}
                />
            </>
        </main>
    );
};
export default Reservation;
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
    setModalAray,
    setImgModal,
    location,
}) => {
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
                                            style={{
                                                height: "156px",
                                                objectFit: "cover",
                                                resizeMode: "cover",
                                            }}
                                            width={320}
                                            src={`${API_URL}/assets/uploads/residences/${item.filename}`}
                                            alt=""
                                            className="carouselImg"
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
                    }}
                    onClick={() => {
                        console.log("okay clické");
                        setModalAray(selectItem?.residence?.medias);
                        setImgModal(true);
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
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                {selectItem && selectItem?.residence.name}
            </h2>
            <span>{selectItem && selectItem?.residence.address}</span>
            <Divider />
            <div className="price">
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectItem && selectItem?.residence.price} fcfa / nuits
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
                    Réservation
                </h2>
                <div>
                    <span>Nombre de personnes</span>
                    <h3>4 personnes</h3>
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
                        <p>Arrivée</p>
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
                        <p>Depart</p>
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
                Montant de réservation
            </h2>
            <div style={spaceStyle}>
                <span>Sous Total:</span>
                <h3>{selectItem?.subtotal}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Frais:</span>
                <h3>{selectItem?.fee}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Total:</span>
                <h3>{selectItem?.total}</h3>
            </div>
            <Divider />
            <h2
                style={{
                    color: "#1B2559",
                }}
            >
                Revenus
            </h2>
            <div style={spaceStyle}>
                <span>Part de l’hôte :</span>
                <h3>{selectItem?.hostMoney}</h3>
            </div>
            <div style={spaceStyle}>
                <span>Part de Trouvechap :</span>
                <h3>{selectItem?.companyMoney}</h3>
            </div>
            <Divider />
            <div style={spaceStyle}>
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    Code de validation
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
                    Statut de la demande
                </h2>
                <Tag color={renderColor(selectItem?.status)}>
                    {selectItem?.status}
                </Tag>
            </div>
            <Divider />
            {selectItem?.cancelledAt !== null && (
                <>
                    <div style={spaceStyle}>
                        <h2
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Date d'annulation
                        </h2>
                        <h3>{FormatDate(selectItem?.cancelleAt)}</h3>
                    </div>
                </>
            )}
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
                            {selectItem?.residence?.refundGrid[
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
                            {selectItem?.residence?.refundGrid[
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
                            {selectItem?.residence?.refundGrid[
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
                            {selectItem?.residence?.refundGrid[
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
                            {selectItem?.residence?.refundGrid[
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
