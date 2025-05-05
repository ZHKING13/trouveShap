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
        northeast: { lat: 5.35, lng: -3.967696 },
        southwest: { lat: 5.35, lng: -3.967696 },
    });
    const [lastValidViewport, setLastValidViewport] = useState(null);
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

    const autocompleteRef = useRef(null);
    const boundsTimeoutRef = useRef(null);

    const openNotificationWithIcon = (type, title, message) => {
        api[type]({ message: title, description: message });
    };

    const handlePropertyChange = (type) => {
        setFilterValue((prevState) => {
            const newTypeResi = prevState.typeResi.includes(type)
                ? prevState.typeResi.filter((item) => item !== type)
                : [...prevState.typeResi, type];
            
            // Mettre à jour le texte du bouton de filtre
            updatePropertyTypeText(newTypeResi);
            
            return { ...prevState, typeResi: newTypeResi };
        });
    };
    
    // Nouvelle fonction pour mettre à jour le texte du bouton de filtre
    const updatePropertyTypeText = (typeArray) => {
        if (typeArray.length === 0) {
            setPropertyType("Toutes les propriétés");
        } else if (typeArray.length === 3) {
            setPropertyType("Toutes les propriétés");
        } else {
            const typeNames = [];
            if (typeArray.includes(1)) typeNames.push("Maison");
            if (typeArray.includes(2)) typeNames.push("Appartement");
            if (typeArray.includes(3)) typeNames.push("Chalet");
            setPropertyType(typeNames.join(", "));
        }
    };

    const getYearRange = (year) => ({
        fromDate: `${year}-01-01`,
        toDate: `${year}-12-31`,
    });

    const isValidViewport = (viewport) => {
        if (!viewport || !viewport.northeast || !viewport.southwest) return false;
        
        const latDiff = Math.abs(viewport.northeast.lat - viewport.southwest.lat);
        const lngDiff = Math.abs(viewport.northeast.lng - viewport.southwest.lng);
        
        return latDiff > 0.001 && lngDiff > 0.001 && latDiff < 10 && lngDiff < 10;
    };

    const normalizeBounds = (bounds) => {
        return {
            northeast: {
                lat: Math.max(bounds.northeast.lat, bounds.southwest.lat),
                lng: Math.max(bounds.northeast.lng, bounds.southwest.lng),
            },
            southwest: {
                lat: Math.min(bounds.northeast.lat, bounds.southwest.lat),
                lng: Math.min(bounds.northeast.lng, bounds.southwest.lng),
            }
        };
    };

    const params = useMemo(
        () => ({
            limit: 7,
            admin_search: searchCity,
            zoomLevel: mapPosition.zoom,
            viewport: mapBounds,
            typeIds: filterValue.typeResi,
            fromDate: getYearRange(selectedYear).fromDate,
            toDate: getYearRange(selectedYear).toDate,
            showAllResidence: true,
        }),
        [searchCity, mapPosition.zoom, mapBounds, filterValue.typeResi, selectedYear]
    );

    const handlePlaceSelect = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        
        if (!place || !place.geometry) return;
        
        setSearchCity(place.name || "");

        // Réinitialiser complètement les états pour éviter toute interférence
        if (boundsTimeoutRef.current) {
            clearTimeout(boundsTimeoutRef.current);
        }

        // Créer un flag pour indiquer que nous sommes en train de mettre à jour manuellement
        window.manualBoundsUpdate = true;

        // Extraire les limites directement depuis l'API Google Maps
        if (place.geometry.viewport) {
            console.log("place", place);
            
            // Définir un zoom approprié
            let newZoom = 12;
            if (place.types?.includes("locality")) {
                newZoom = 13;
            } else if (place.types?.includes("sublocality") || place.types?.includes("neighborhood")) {
                newZoom = 15;
            }
            else if (place.types?.includes("point_of_interest")) {
                newZoom = 17;
            }

            // Créer une copie profonde des limites pour éviter toute référence partagée
            const bounds = place.geometry.viewport;
            const newBounds = {
                northeast: {
                    lat: Number(bounds.getNorthEast().lat().toFixed(6)),
                    lng: Number(bounds.getNorthEast().lng().toFixed(6)),
                },
                southwest: {
                    lat: Number(bounds.getSouthWest().lat().toFixed(6)),
                    lng: Number(bounds.getSouthWest().lng().toFixed(6)),
                },
            };
            
            console.log("Original viewport from Google:", JSON.stringify(newBounds));
            
            // Mettre à jour la position
            const newPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                zoom: newZoom,
            };
            
            // Désactiver temporairement les effets secondaires
            setMapPosition(newPosition);
            
            // Attendre que la position soit mise à jour
            setTimeout(() => {
                // Mettre à jour les limites avec une précision fixe
                console.log("Setting final viewport:", JSON.stringify(newBounds));
                setMapBounds(newBounds);
                setLastValidViewport(newBounds);
                
                // Réactiver les effets secondaires après un délai
                setTimeout(() => {
                    window.manualBoundsUpdate = false;
                }, 1000);
            }, 500);
        }
    };

    const createQueryString = (data) => {
        const buildQuery = (obj, prefix) => {
            return Object.keys(obj)
                .filter((key) => {
                    const value = obj[key];
                    return value !== null && value !== undefined && value !== "";
                })
                .map((key) => {
                    const value = obj[key];
                    const queryKey = prefix ? `${prefix}[${key}]` : key;

                    if (Array.isArray(value)) {
                        return value
                            .map((item, index) => {
                                if (typeof item === "object") {
                                    return buildQuery(item, `${queryKey}[${index}]`);
                                }
                                return `${queryKey}[${index}]=${encodeURIComponent(item)}`;
                            })
                            .join("&");
                    }

                    if (typeof value === "object" && !Array.isArray(value)) {
                        return buildQuery(value, queryKey);
                    }

                    return `${queryKey}=${encodeURIComponent(value)}`;
                })
                .filter(Boolean)
                .join("&");
        };

        return buildQuery(data);
    };

    const handleYearChange = (date) => {
        // Mettre à jour l'année sélectionnée
        const newYear = date.getFullYear();
        setSelectedYear(newYear);
        
        // Forcer une mise à jour des données avec la nouvelle année
        setTimeout(() => {
            const year = getYearRange(newYear);
            const query = {
                ...year,
                admin_search: params.admin_search,
                viewport: params.viewport,
                typeIds: params.typeIds
            };
            const filteredObject = createQueryString(query);
            
            console.log("Fetching with new year:", newYear, filteredObject);
            
            // Appeler directement les API avec la nouvelle année
            (async () => {
                setLoading(true);
                try {
                    // Récupérer les statistiques
                    const statsRes = await getCityStats(headers, filteredObject);
                    if (statsRes.status === 200) {
                        setStats(statsRes.data);
                    }
                    
                    // Récupérer les résidences
                    const paramsWithNewYear = {
                        ...params,
                        fromDate: year.fromDate,
                        toDate: year.toDate
                    };
                    const residenceQueryString = createQueryString(paramsWithNewYear);
                    const residenceRes = await getMapResidence(residenceQueryString, headers);
                    if (residenceRes.status === 200) {
                        setResidence(residenceRes.data);
                    }
                } catch (error) {
                    openNotificationWithIcon("error", "Erreur", error.message);
                } finally {
                    setLoading(false);
                }
            })();
        }, 100);
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };

    // Restaurer les fonctions fetchState et fetchResidence
    const fetchState = async () => {
        setLoading(true);
        try {
            const year = getYearRange(selectedYear);
            const query = {
                ...year,
                admin_search: params.admin_search,
                viewport: params.viewport,
                typeIds: params.typeIds
            };
            const filteredObject = createQueryString(query);

            console.log("Fetching stats with params:", filteredObject);
            const res = await getCityStats(headers, filteredObject);
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
        const filteredObject = createQueryString(params);

        try {
            const res = await getMapResidence(filteredObject, headers);
            if (res.status !== 200) {
                openNotificationWithIcon("error", "Erreur", "Erreur lors de la récupération des résidences");
                localStorage.clear();
                setTimeout(() => {
                    Navigate("/login");
                }, 1500);
                return;
            }
            setResidence(res.data);
        } catch (error) {
            openNotificationWithIcon("error", "Erreur", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading) {
            console.log("Fetching residence with params:", {
                mapBounds, 
                mapPosition, 
                searchCity, 
                typeIds: filterValue.typeResi,
                year: selectedYear
            });
            fetchResidence();
        }
    }, [mapBounds, mapPosition, searchCity, filterValue.typeResi, selectedYear]);

    useEffect(() => {
        if (!loading) {
            console.log("Fetching stats with params:", {
                selectedYear, 
                searchCity, 
                typeIds: filterValue.typeResi,
                mapBounds
            });
            fetchState();
        }
    }, [selectedYear, searchCity, filterValue.typeResi, mapBounds]);

    useEffect(() => {
        return () => {
            if (boundsTimeoutRef.current) {
                clearTimeout(boundsTimeoutRef.current);
            }
        };
    }, []);

    if (!isLoaded) {
        return (
            <div style={styles.spinnerContainer}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#fff" }}>
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
                                    ? stats?.meanMoneyPerCity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currencySign() || 0
                                    : index === 2
                                    ? stats?.meanPricePerNightPerCity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + currencySign() || 0
                                    : stats?.countPerCity || 0}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Filtres */}
                <div style={styles.filtersContainer}>
                    <div style={styles.searchInput}>
                        <Autocomplete
                            onLoad={(autocomplete) => {
                                autocompleteRef.current = autocomplete;
                                autocomplete.setFields(['geometry', 'name', 'types']);
                            }}
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
                                        backgroundColor: filterValue.typeResi.includes(1) ? "#DAC7FF" : "transparent",
                                    }}
                                >
                                    <img style={resiImg} src="/maison.png" alt="" />
                                    <p>Maison</p>
                                </div>
                                <div
                                    onClick={() => handlePropertyChange(2)}
                                    style={{
                                        ...styles.filterItem,
                                        backgroundColor: filterValue.typeResi.includes(2) ? "#DAC7FF" : "transparent",
                                    }}
                                >
                                    <img style={resiImg} src="/building.png" alt="" />
                                    <p>Appartement</p>
                                </div>
                                <div
                                    onClick={() => handlePropertyChange(3)}
                                    style={{
                                        ...styles.filterItem,
                                        backgroundColor: filterValue.typeResi.includes(3) ? "#DAC7FF" : "transparent",
                                    }}
                                >
                                    <img style={resiImg} src="/chalet.png" alt="" />
                                    <p>Chalet</p>
                                </div>
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
                        arrayMap={residence}
                        mapPosition={mapPosition}
                        setMapPosition={setMapPosition}
                        mapBounds={mapBounds}
                        setMapBounds={setMapBounds}
                        stats
                    />
                </div>
            </div>
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
        height: "80vh",
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
    closeIcon: {
        position: "absolute",
        top: "10px",
        right: "10px",
        cursor: "pointer",
        fontSize: "16px",
        color: "#A0AEC0",
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