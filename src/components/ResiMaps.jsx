import GoogleMapReact from "google-map-react";
import tv from "../assets/loca.svg";
import { Children, useEffect, useRef, useState } from "react";
import GoogleMap from "google-maps-react-markers";
import Marker from "./Marker";
import mapOption from "./mapOption.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Carousel, Image } from "antd";
import {
    LeftOutlined,
    MinusOutlined,
    PlusOutlined,
    SendOutlined,
    StarOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../feature/API";

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
    const [showDetail, setShowDetail] = useState(false);
    const mapRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapsInstance, setMapsInstance] = useState(null);
    const onGoogleApiLoaded = ({ map, maps }) => {
        setMapInstance(map);
        setMapsInstance(maps);
        updateBounds(map); // Mise à jour initiale des limites
    };
    const navigate = useNavigate();

    const updateBounds = (map) => {
        const bounds = map.getBounds();
        console.log("bounds", bounds);
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

    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (mapInstance) {
                        mapInstance.setCenter({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });

                        console.log(mapInstance);

                        // mapInstance.setZoom(15);
                    }
                },
                (error) => {
                    console.error("Error getting user's position: ", error);
                }
            );
        }
    };

    const onMarkerClick = (e, { markerId, lat, lng, resiDetails }) => {
        setShowDetail(false);
        console.log("This is ->", markerId);
        console.log("This is ->", resiDetails);

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
    }, [mapsInstance]);
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
                onChange={(map) => {
                    console.log("Map moved", map);
                    setMapBounds({
                        northeat: {
                            lat: map.bounds.Wh.hi,
                            lng: map.bounds.Gh.lo,
                        },
                        southwest: {
                            lat: map.bounds.Wh.lo,
                            lng: map.bounds.Gh.hi,
                        },
                    });
                    console.log("mapppppBoundsss", mapBounds, map.zoom);

                    // setMapPosition({
                    //     lat: map.center[0],
                    //     lng: map.center[1],
                    //     zoom: map.zoom,
                    // });
                    const bounds = map.bounds;
                }}
            >
                {arrayMap.map((items, index) => (
                    <Marker
                        style={{
                            backgroundColor: "#A273FF ",
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
                        resiDetails={items}
                        price={items.price}
                        onClick={onMarkerClick} // you need to manage this prop on your Marker component!
                        // draggable={true}
                        // onDragStart={(e, { latLng }) => {}}
                        // onDrag={(e, { latLng }) => {}}
                        // onDragEnd={(e, { latLng }) => {}}
                    />
                ))}
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
                            <Carousel arrows={true} fade infinite={false}>
                                {selectResidence?.medias &&
                                    selectResidence?.medias.map(
                                        (item, index) => (
                                            <div key={index}>
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
        </div>
    );
};

export default Maps;
