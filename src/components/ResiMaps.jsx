import GoogleMapReact from "google-map-react";
import tv from "../assets/loca.svg";
import { Children, useEffect, useRef, useState } from "react";
import GoogleMap from "google-maps-react-markers";
import Marker from "./Marker";
import mapOption from "./mapOption.json";
import { Swiper, SwiperSlide } from "swiper/react";
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
import {
    LeftOutlined,
    MinusOutlined,
    PlusOutlined,
    SendOutlined,
    StarOutlined,
    LoadingOutlined,
    PictureOutlined,
    CaretDownOutlined,
    RightOutlined,
    LeftCircleOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../feature/API";
import Map from "./Map";
import { Icon } from "../constant/Icon";
import AdminMarker from "./AdminMarker";

const Maps = ({
    location,
    Children,
    arrayMap,
    mapPosition,
    setMapPosition,
    mapBounds,
    setMapBounds,
    loading,
}) => {
    const [rerenderTrigger, setRerenderTrigger] = useState(0);
    const [selectResidence, setSelectResidence] = useState(null);
    const [showMarkers, setShowMarkers] = useState(true);
    const [userPosition, setUserPosition] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const mapRef = useRef(null);
        const [open, setOpen] = useState(false);

    const [mapReady, setMapReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapsInstance, setMapsInstance] = useState(null);
        const [locations, setLocation] = useState(null);
    const [modalAray, setModalAray] = useState([]);
const [clickedMarkerIndex, setClickedMarkerIndex] = useState(null);
    const onGoogleApiLoaded = ({ map, maps }) => {
        setMapInstance(map);
        setMapsInstance(maps);
        updateBounds(map); // Mise à jour initiale des limites
    };
    const navigate = useNavigate();

    const updateBounds = (map) => {
        const bounds = map.getBounds();
        console.log("get bounds", bounds);
        if (bounds) {
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            setMapBounds({
                northeast: {
                    lat: northEast.lat(),
                    lng: northEast.lng(),
                },
                southwest: {
                    lat: southWest.lat(),
                    lng: southWest.lng(),
                },
            });
        }
    };
 const showDrawer = async (data) => {
     setModalAray(data.medias);
    //  setSelectItem(data);

     let loc = {
         address: data.address,
         lat: parseFloat(data.lat),
         lng: parseFloat(data.lng),
     };
     setLocation(loc);
    
     console.log(locations);
     setOpen(true);
 };
 const onClose = () => {
     setOpen(false);
 };
    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                                            mapInstance.setZoom(15);

                    if (mapInstance) {
                       
                        mapInstance.setCenter({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            zoom: 15,
                        });
                        
setUserPosition({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
});
                        console.log(mapInstance);
                         setMapPosition({
                            
                            zoom: 15,
                        });

                    }
                },
                (error) => {
                    console.error("Error getting user's position: ", error);
                }
            );
        }
    };

    const onMarkerClick = (e, { markerId, lat, lng, resiDetails,index }) => {
        setShowDetail(false);
        console.log("This is ->", markerId);
        console.log("This is index->", index);
        setClickedMarkerIndex(index);
        console.log("clickedMarkerIndex",clickedMarkerIndex)
        
        // mapInstance.setCenter({
        //     lat: parseFloat(lat),
        //     lng: parseFloat(lng),
        // });
        setSelectResidence(resiDetails);
        console.log(selectResidence?.medias);
        // wait for the map to move before showing the detail
        setTimeout(() => {
            setShowDetail(true);
        }, 300);
    };

    useEffect(() => {
        if (mapInstance && mapsInstance) {
            // Ajout des écouteurs d'événements après que l'instance de la carte soit définie
            const listener = mapInstance.addListener("idle", () => {
                console.log("Map moved", mapInstance);
                updateBounds(mapInstance);
            });

            // Nettoyage des écouteurs d'événements lorsqu'on démonte le composant
            return () => {
                mapsInstance.event.removeListener(listener);
            };
        }
    }, [mapsInstance,mapPosition]);
    return (
        <div
            style={{
                height: "90%",
                width: "100%",
            }}
        >
            <GoogleMap
                apiKey="AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw"
                defaultCenter={location}
                ref={mapRef}
                defaultZoom={mapPosition.zoom ? mapPosition.zoom : 14}
                options={{ ...mapOption }}
                mapMinHeight="100%"
                onGoogleApiLoaded={onGoogleApiLoaded}
                onChange={async(map) => {
                    console.log("Map moved", map);
                    setMapPosition({
                        lat: map.center[0],
                        lng: map.center[1],
                        zoom: map.zoom,
                    });
                                        console.log("mapppppBoundsss", mapBounds, map.zoom);

                }}
            >
                {arrayMap.map((items, index) => (
                    <Marker
                        style={{
                            backgroundColor: clickedMarkerIndex == index ? "#34176E" : "#A273FF",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "4px 8px",
                            color: "#fff",
                            position: "relative",
                            cursor: "pointer",
                            opacity: showMarkers ? 1 : 0,
                            transform: showMarkers ? "scale(1)" : "scale(0)",
                            transition:
                                "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                        }}
                        className="marker"
                        key={index}
                        lat={items.lat}
                        lng={items.lng}
                        markerId={items.name}
                        index={index}
                        resiDetails={items}
                        clickedMarkerIndex={clickedMarkerIndex}
                        price={items.price}
                        onClick={onMarkerClick} // you need to manage this prop on your Marker component!
                        // draggable={true}
                        // onDragStart={(e, { latLng }) => {}}
                        // onDrag={(e, { latLng }) => {}}
                        // onDragEnd={(e, { latLng }) => {}}
                    />
                ))}
                {
                    userPosition && (
                     <AdminMarker lat={userPosition.lat} lng={userPosition.lng} />
                    )   
                }
            </GoogleMap>
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "20px",
                    backgroundColor: "#fff",
                    padding: "8px 12px",
                    borderRadius: "25px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                }}
                onClick={() => {
                    navigate("/");
                }}
            >
                <p>
                    <LeftOutlined size={14} />
                </p>
                <span>Retourner a l’accueil</span>
            </div>
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: "100px",
                        left: "50%",
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                    }}
                >
                    <p>
                        <LoadingOutlined size={14} />
                    </p>
                </div>
            )}
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    right: "30px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        
                    }}
                    onClick={() => {
                        const prevZoom = mapPosition.zoom;
                        setMapPosition((prev) => {
                            return {
                                ...prev,
                                zoom: prev.zoom + 1,
                            };
                        });
                        mapInstance.setZoom(prevZoom + 1);
                    }}
                >
                    <p>
                        <PlusOutlined />
                    </p>
                </div>
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        
                    }}
                    onClick={() => {
                        const prevZoom = mapPosition.zoom;
                        setMapPosition((prev) => {
                            return {
                                ...prev,
                                zoom: prev.zoom - 1,
                            };
                        });
                        mapInstance.setZoom(prevZoom - 1);
                    }}
                >
                    <p>
                        <MinusOutlined />
                    </p>
                </div>
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        borderRadius: "25px",
                        cursor: "pointer",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        
                    }}
                    onClick={getUserPosition}
                >
                    <p>
                        <SendOutlined rotate={310} />
                    </p>
                </div>
            </div>
            {showDetail && (
                <div
                    style={{
                        width: "550px",
                        height: "150px",
                        position: "absolute",
                        bottom: "20px",
                        right: "30%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        // opacity: showDetail ? 1 : 0,
                        transform: showDetail
                            ? "translateY(0)"
                            : "translateY(100%)",
                        transition: "opacity  transform 0.5s ease 0.1s",
                        cursor: "pointer",
                    }}
                    
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                position: "absolute",
                                top: 3,
                                right: 2,
                                color: "#A273FF",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setShowDetail(false);
                            }}
                        >
                            X
                        </div>
                        <div
                            style={{
                                width: "50%",
                                height: "150px",
                            }}
                        >
                            <Carousel prevArrow={<PrevIcon  />} nextArrow={<NextIcon />} arrows={true} fade infinite={false}>
                                {selectResidence?.medias &&
                                    selectResidence?.medias.map(
                                        (item, index) => (
                                            <div key={index} onClick={() => showDrawer(selectResidence)}>
                                                <img
                                                    style={{
                                                        width: "100%",
                                                        borderRadius: "10px",
                                                        objectFit: "cover",
                                                        height: "150px",
                                                    }}
                                                    src={`${API_URL}/assets/uploads/residences/${item?.filename}`}
                                                    alt={item?.filename}
                                                />
                                                {/* go next icon */}
                                                
                                                {/* prev icon */}
                                                
                                            </div>
                                        )
                                    )}
                            </Carousel>
                        </div>
                        <div
                            style={{
                                width: "50%",
                                height: "150px",
                                display: "flex",
                                flexDirection: "column",
                                paddingTop: "20px",
                                justifyContent: "space-between",
                                paddingBottom: "20px",
                            }}
                        >
                            <div
                                onClick={() => showDrawer(selectResidence)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    paddingTop: "10px",
                                    justifyContent: "space-between",
                                    gap: "8px",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        marginBottom: "0",
                                        color: "#A273FF",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {selectResidence?.address &&
                                    selectResidence.address.length > 25
                                        ? selectResidence.address.substring(
                                              0,
                                              25
                                          ) + "..."
                                        : selectResidence?.address}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        marginBottom: "0",

                                        textTransform: "uppercase",
                                    }}
                                >
                                    {selectResidence?.name &&
                                    selectResidence.name.length > 25
                                        ? selectResidence.name.substring(
                                              0,
                                              25
                                          ) + "..."
                                        : selectResidence?.name}
                                </p>
                                <p
                                    style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                    }}
                                >
                                    {selectResidence?.price
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            " "
                                        )}{" "}
                                    FCFA Par Nuits{" "}
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {selectResidence?.qualityNote || "N/A"}{" "}
                                        <StarOutlined
                                            style={{
                                                color: "#FACC15",
                                            }}
                                        />
                                    </span>
                                </p>
                            </div>
                            <div style={{}}>
                                <p
                                    style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        marginBottom: "10px",
                                        gap: "5px",
                                    }}
                                >
                                    {selectResidence?.rooms.map(
                                        (item, index) => {
                                            if (item?.room.id === 1) {
                                                return item?.count + " Chambre";
                                            }
                                            if (item?.room.id === 5) {
                                                return (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            .
                                                        </p>
                                                        <p>
                                                            {item?.count} Salle
                                                            de Bain
                                                            {item?.count > 1
                                                                ? "s"
                                                                : ""}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        }
                                    )}
                                    {selectResidence?.rooms.map(
                                        (item, index) => {
                                            if (item?.room.id === 2) {
                                                return (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            .
                                                        </p>
                                                        <p>
                                                            {item?.count} Salon
                                                            {item?.count > 1
                                                                ? "s"
                                                                : ""}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Drawer
                placement="right"
                onClose={onClose}
                destroyOnClose={true}
                open={open}
                extra={
                    <a
                        href={`https://trouvechap.com/residence/${selectResidence?.slug}`}
                        style={{
                            backgroundColor: "#A273FF",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "10px",
                        }}
                    >
                        Visiter
                    </a>
                }
            >
                <div
                    style={{
                        position: "relative",
                    }}
                    className="top"
                >
                    <Carousel autoplay>
                        {selectResidence && (
                            <Image.PreviewGroup>
                                <Image
                                    src={`${API_URL}/assets/uploads/residences/${selectResidence?.medias[0]?.filename}`}
                                    alt=""
                                    width={352}
                                    style={{
                                        height: "160px",
                                        objectFit: "cover",
                                    }}
                                    className="carouselImg"
                                    id="carouselImgs"
                                />
                                {selectResidence.medias.map((item, index) => {
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
                            {selectResidence && selectResidence?.medias.length}{" "}
                            photos
                        </span>
                    </div>
                </div>
                <Divider />
                <div style={spaceStyle}>
                    <h4>Numéro de résidence</h4>
                    <h4
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectResidence && selectResidence?.serial_number}
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
                        {(selectResidence &&
                            selectResidence.host?.payment_method?.label) ||
                            "--"}
                    </h4>
                </div>
                <Divider />
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    {selectResidence && selectResidence?.name}
                </h2>
                <span>{selectResidence && selectResidence?.address}</span>
                <Divider />
                <div className="price">
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        {selectResidence &&
                            selectResidence.price
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
                        src={`${API_URL}/assets/uploads/avatars/${selectResidence?.host?.avatar}`}
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
                            {selectResidence && selectResidence.host?.firstname}{" "}
                            {selectResidence && selectResidence.host?.lastname}
                        </h3>
                        <p>{selectResidence && selectResidence?.host?.email}</p>
                        <p>
                            {selectResidence && selectResidence?.host?.contact}
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
                    Description
                </h3>
                {selectResidence?.description?.map((item, index) => {
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
                    <h2>Commodités</h2>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px",
                            marginTop: "10px",
                        }}
                    >
                        {selectResidence?.assets?.map((item, index) => {
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
                    Aperçu
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
                            <p>Règlement interieur</p>
                        </div>
                        {selectResidence?.rules?.map((item, index) => {
                            return <span key={index}>{item.rule?.title}</span>;
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
                            <p>Type d’activités sociales</p>
                        </div>
                        {selectResidence?.activities?.map((item, index) => {
                            return (
                                <span key={index}>{item.activity?.name}</span>
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
                    Grille de remboursement
                </h2>
                <div>
                    <ul>
                        <div style={spaceStyle}>
                            <li style={listStyle}>
                                Entre 1 et 3 mois avant le jour J
                            </li>
                            <span>
                                {selectResidence?.refundGrid[
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
                                {selectResidence?.refundGrid[
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
                                {selectResidence?.refundGrid[
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
                                {selectResidence?.refundGrid[
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
                                {selectResidence?.refundGrid[
                                    "Plus de 3 mois avant le jour J"
                                ] + "%"}
                            </span>
                        </div>
                    </ul>
                </div>
                <Divider />
                <Map location={locations} />
            </Drawer>
        </div>
    );
};

export default Maps;
const PrevIcon = ({currentSlide, slideCount, ...props}) => {
    return (
        <div className="prevIcon" onClick={props.onClick} style={{
                                                   
                                                   position: "absolute",
                                                    top: "50%",
                                                    left: "2",
                                                    transform: "translateY(-50%)",
                                                    color: "#fff",
                                                    backgroundColor: "#fff3",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    width: "20px",
                                                    height: "20px",
                                                    display: currentSlide === 0 ? "none" : "flex",
                                                    justifyContent: "center",
            alignItems: "center",
                                                   zIndex: "100",
                                                }}>
                                                    <LeftOutlined />
                                                </div>
   )
}
const NextIcon =({currentSlide, slideCount, ...props})=>{
    return (
    <div className="prevIcon" onClick={props.onClick} style={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    right: "0",
                                                    transform: "translateY(-50%)",
                                                    color: "#A273FF",
                                                    backgroundColor: "#fff3",
                                                    
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    width: "20px",
                                                    height: "20px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                    <RightOutlined />
                                                </div>
)
}
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
