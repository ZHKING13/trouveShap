import React, { useEffect, useMemo, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { FaHome, FaBuilding, FaMountain, FaDownload } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { notification, Spin } from "antd";
import { getCityStats, getMapResidence } from "../../feature/API";
import Maps from "../ResiMaps";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { currencySign } from "../DataTable";
import StatsMaps from "./StatsMap";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../config/map";
import { Navigate } from "react-router-dom";

const EmplacementPage = () => {
    const [propertyType, setPropertyType] = useState("Toutes les propriétés");
    const [searchCity, setSearchCity] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isLoaded } = useGoogleMaps();
    const [stats, setStats] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [api, contextHolder] = notification.useNotification();
    const [mapBounds, setMapBounds] = useState({
        northeast: {
            lat: 5.35,
            lng: -3.967696,
        },
        southwest: {
            lat: 5.35,
            lng: -3.967696,
        },
    });
    const [residence, setResidence] = useState([]);

    const [mapPosition, setMapPosition] = useState({
        lng: -3.967696,
        lat: 5.35,
        zoom: 13,
    });
    const [filterValue, setFilterValue] = useState({
        typeResi: [],
        fromDate: "",
        toDate: "",
        reset: false,
    });
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({ message: title, description: message });
    };

    const handlePropertyChange = (type) => {
        setFilterValue((prevState) => {
            const newTypeResi = prevState.typeResi.includes(type)
                ? prevState.typeResi.filter((item) => item !== type)
                : [...prevState.typeResi, type];
            return { ...prevState, typeResi: newTypeResi };
        });
    };

    const getYearRange = (year) => ({
        fromDate: `${year}-01-01`,
        toDate: `${year}-12-31`,
    });
    const params = useMemo(
        () => ({
            limit: 7,
            admin_search: searchCity,
            zoomLevel: mapPosition.zoom,
            viewport: {
                northeast: {
                    lat: mapBounds.northeast?.lat,
                    lng: mapBounds.northeast?.lng,
                },
                southwest: {
                    lat: mapBounds.southwest?.lat,
                    lng: mapBounds.southwest?.lng,
                },
            },
            typeIds: filterValue.typeResi,
            fromDate: getYearRange(selectedYear).fromDate,
            toDate: getYearRange(selectedYear).toDate,
        }),
        [
            searchCity,
            mapPosition.zoom,
            mapBounds,
            filterValue.typeResi,
            selectedYear,
        ]
    );

    const autocompleteRef = useRef(null);
    const handlePlaceSelect = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        console.log("place", place.name);
        setSearchCity(place.name);
        if (place.geometry) {
            setMapPosition({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                zoom: 13,
            });
            if (place.geometry.viewport) {
                setMapBounds({
                    northeast: {
                        lat: place.geometry.viewport.getNorthEast().lat(),
                        lng: place.geometry.viewport.getNorthEast().lng(),
                    },
                    southwest: {
                        lat: place.geometry.viewport.getSouthWest().lat(),
                        lng: place.geometry.viewport.getSouthWest().lng(),
                    },
                });
            }
        }
    };
    const createQueryString = (data) => {
        const buildQuery = (obj, prefix) => {
            return Object.keys(obj)
                .filter((key) => {
                    const value = obj[key];
                    return (
                        value !== null && value !== undefined && value !== ""
                    );
                })
                .map((key) => {
                    const value = obj[key];
                    const queryKey = prefix ? `${prefix}[${key}]` : key;

                    if (Array.isArray(value)) {
                        return value
                            .map((item, index) => {
                                if (typeof item === "object") {
                                    return buildQuery(
                                        item,
                                        `${queryKey}[${index}]`
                                    );
                                }
                                return `${queryKey}[${index}]=${encodeURIComponent(
                                    item
                                )}`;
                            })
                            .join("&");
                    }

                    if (typeof value === "object" && !Array.isArray(value)) {
                        return buildQuery(value, queryKey);
                    }

                    return `${queryKey}=${encodeURIComponent(value)}`;
                })
                .filter(Boolean) // Filter out any undefined or null values that might be returned
                .join("&");
        };

        return buildQuery(data);
    };

    const handleYearChange = (date) => {
        setSelectedYear(date.getFullYear());
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const fetchState = async () => {
        setLoading(true);
        try {
            const query = getYearRange(selectedYear);

            const res = await getCityStats(headers, query);
            console.log(res);

            if (res.status !== 200) {
                throw new Error(res?.data?.message || "Erreur inconnue");
            }
            setStats(res.data);
        } catch (error) {
            openNotificationWithIcon("error", "Erreur", error.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchResidence = async () => {
        setLoading(true);
        console.log(params);
        const filteredObject = createQueryString(params);

        console.log("filterObjet::::", filteredObject);

        const res = await getMapResidence(filteredObject, headers);
        console.log("total resi", res.data.length);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                t("error.401"),
                t("error.retry1")
            );
            localStorage.clear();
            setTimeout(() => {
                Navigate("/login");
            }, 1500);
            return;
        }
        setResidence(res.data);
        setLoading(false);
    };
    const prevMapBounds = mapBounds;
    useEffect(() => {
        fetchResidence();
    }, [mapBounds, mapPosition, searchCity, filterValue.typeResi]);

    useEffect(() => {
        fetchState();
    }, [selectedYear]);
    return isLoaded ? (
        <div style={{ backgroundColor: "fff" }}>
            <div style={styles.container}>
                {contextHolder}
                {/* Statistiques */}
                <div style={styles.statsContainer}>
                    {[
                        "Nombre moyen de résidences par ville",
                        "Prix moyen par ville par nuitée",
                        "Gain moyen par ville",
                    ].map((title, index) => (
                        <div key={index} style={styles.statCard}>
                            <p style={styles.statTitle}>{title}</p>
                            <h2 style={styles.statValue}>
                                {index === 1
                                    ? 0 ||
                                      stats?.meanPricePerNightPerCity
                                          .toString()
                                          .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              " "
                                          ) +
                                          " " +
                                          currencySign() ||
                                      0
                                    : index === 2
                                    ? 0 ||
                                      stats?.meanPricePerNightPerCity
                                          .toString()
                                          .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              " "
                                          ) +
                                          " " +
                                          currencySign() ||
                                      0
                                    : stats?.countPerCity}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <div style={styles.filtersContainer}>
                    <div style={styles.searchInput}>
                        {" "}
                        <Autocomplete
                            onLoad={(autocomplete) =>
                                (autocompleteRef.current = autocomplete)
                            }
                            onPlaceChanged={handlePlaceSelect}
                            className="searchInput"
                        >
                            <input
                                type="text"
                                placeholder="Chercher une ville"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                style={{
                                    width: "90%",
                                    padding: "12px",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                }}
                            />
                        </Autocomplete>
                    </div>

                    <div style={styles.dropdownWrapper}>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            style={styles.filterButton}
                        >
                            {propertyType}
                        </button>
                        {showFilter && (
                            <div style={styles.filterDropdown}>
                                <AiOutlineClose
                                    style={styles.closeIcon}
                                    onClick={() => setShowFilter(false)}
                                />

                                <div
                                    onClick={() => handlePropertyChange(1)}
                                    style={{
                                        ...styles.filterItem,
                                        backgroundColor:
                                            filterValue.typeResi.includes(1)
                                                ? "#DAC7FF"
                                                : "transparent",
                                    }}
                                >
                                    <img
                                        style={resiImg}
                                        src="/maison.png"
                                        alt=""
                                    />
                                    <p>Maison</p>
                                </div>
                                <div
                                    onClick={() => handlePropertyChange(2)}
                                    style={{
                                        ...styles.filterItem,
                                        backgroundColor:
                                            filterValue.typeResi.includes(2)
                                                ? "#DAC7FF"
                                                : "transparent",
                                    }}
                                >
                                    <img
                                        style={resiImg}
                                        src="/building.png"
                                        alt=""
                                    />
                                    <p>Appartement</p>
                                </div>
                                <devicePixelRatio
                                    onClick={() => handlePropertyChange(3)}
                                    style={{
                                        ...styles.filterItem,
                                        backgroundColor:
                                            filterValue.typeResi.includes(3)
                                                ? "#DAC7FF"
                                                : "transparent",
                                    }}
                                >
                                    <img
                                        style={resiImg}
                                        src="/chalet.png"
                                        alt=""
                                    />{" "}
                                    <p>Chalet</p>
                                </devicePixelRatio>
                            </div>
                        )}
                    </div>

                    <div style={styles.datePickerContainer}>
                        <DatePicker
                            selected={new Date(selectedYear, 0, 1)}
                            onChange={handleYearChange}
                            showYearPicker
                            dateFormat="yyyy"
                            disabled={loading}
                            customInput={
                                <CustomDatePickerButton year={selectedYear} />
                            }
                        />
                    </div>
                </div>

                {/* Carte Google */}
                <div style={styles.mapContainer}>
                    <StatsMaps
                        location={{
                            lat: mapPosition.lat,
                            lng: mapPosition.lng,
                        }}
                        loading={loading}
                        // showModal={showModal}
                        // setShowModal={setShowModal}
                        arrayMap={residence}
                        mapPosition={mapPosition}
                        setMapPosition={setMapPosition}
                        mapBounds={mapBounds}
                        setMapBounds={setMapBounds}
                        stats
                    ></StatsMaps>
                </div>
            </div>
            {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    onClick={() => console.log("Exporting data")}
                    className="export-button"
                >
                    <FaDownload size={20} color="#9B74F3" /> Exporter les
                    résultats
                </button>
            </div> */}
        </div>
    ) : (
        <div style={styles.spinnerContainer}>
            <Spin size="large" />
        </div>
    );
};
const resiImg = {
    width: "30px",
    height: "30px",
};
const CustomDatePickerButton = React.forwardRef(({ year, onClick }, ref) => (
    <button style={styles.datePickerButton} onClick={onClick} ref={ref}>
        {year} <span style={styles.calendarIcon}>📅</span>
    </button>
));
const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#F8F9FC",
    },
    spinnerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Ensure it takes the full height of the viewport
        width: "100%",
    },
    statsContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        flex: 1,

        margin: "0 10px",
    },
    statTitle: {
        fontSize: "14px",
        color: "#6B7280",
        marginBottom: "5px",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    filtersContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        gap: "10px",
    },
    searchInput: {
        flex: 1,
        padding: "12px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        background: "#fff",
    },
    dropdownWrapper: {
        position: "relative",
    },
    filterButton: {
        padding: "12px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#fff",
        width: "200px",
    },
    filterDropdown: {
        position: "absolute",
        background: "#fff",
        padding: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        zIndex: 10,
        width: "220px",
        top: "110%",
        left: 0,
    },

    filterItem: {
        display: "flex",

        gap: "10px",
        padding: "10px",
        border: "1px solid #DAC7FF",
        borderRadius: "5px",
        width: "80%",
        flexDirection: "row",
        marginBottom: "5px",
    },
    icon: {
        marginRight: "8px",
    },
    closeIcon: {
        position: "absolute",
        top: "10px",
        right: "10px",
        cursor: "pointer",
        fontSize: "16px",
        color: "#A0AEC0",
    },
    filterActions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    },
    clearButton: {
        background: "transparent",
        color: "red",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
    },
    applyButton: {
        background: "#6C5DD3",
        color: "#fff",
        padding: "8px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        border: "none",
        fontSize: "14px",
    },
    yearSelector: {
        padding: "12px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
    },
    mapContainer: {
        height: "450px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
    },
    datePickerContainer: {
        position: "relative",
    },
    datePickerButton: {
        fontSize: "14px",
        background: "#F1F1F1",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
};

export default EmplacementPage;
