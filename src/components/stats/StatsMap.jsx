import { useEffect, useRef, useState } from "react";
import GoogleMap from "google-maps-react-markers";
import mapOption from "../mapOption.json";
import {
    LeftOutlined,
    MinusOutlined,
    PlusOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { FaLocationArrow } from "react-icons/fa6";
import AdminMarker from "../AdminMarker";
import Marker from "../Marker";

const StatsMaps = ({
    location,
    arrayMap,
    mapPosition,
    setMapPosition,
    mapBounds,
    setMapBounds,
    loading,
    stats,
}) => {
    const [showMarkers, setShowMarkers] = useState(true);
    const [userPosition, setUserPosition] = useState(null);
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapsInstance, setMapsInstance] = useState(null);
    const [clickedMarkerIndex, setClickedMarkerIndex] = useState(null);

    const onGoogleApiLoaded = ({ map, maps }) => {
        setMapInstance(map);
        setMapsInstance(maps);
        updateBounds(map);
    };

    const updateBounds = (map) => {
        // Ne pas mettre à jour les limites si nous sommes en train de le faire manuellement
        if (window.manualBoundsUpdate) {
            console.log("Skipping automatic bounds update during manual update");
            return;
        }
        
        const bounds = map.getBounds();
        if (bounds) {
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            
            // Utiliser une précision fixe pour éviter les différences minimes
            const newBounds = {
                northeast: {
                    lat: Number(northEast.lat().toFixed(6)),
                    lng: Number(northEast.lng().toFixed(6)),
                },
                southwest: {
                    lat: Number(southWest.lat().toFixed(6)),
                    lng: Number(southWest.lng().toFixed(6)),
                },
            };
            
            // Vérifier si les limites sont significativement différentes
            const latDiffNE = Math.abs(newBounds.northeast.lat - mapBounds.northeast.lat);
            const lngDiffNE = Math.abs(newBounds.northeast.lng - mapBounds.northeast.lng);
            const latDiffSW = Math.abs(newBounds.southwest.lat - mapBounds.southwest.lat);
            const lngDiffSW = Math.abs(newBounds.southwest.lng - mapBounds.southwest.lng);
            
            // Seuil de différence significative plus élevé
            const threshold = 0.001;
            
            if (latDiffNE > threshold || lngDiffNE > threshold || 
                latDiffSW > threshold || lngDiffSW > threshold) {
                console.log("Updating bounds from map:", JSON.stringify(newBounds));
                setMapBounds(newBounds);
            }
        }
    };

    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    mapInstance.setCenter(newPosition);
                    mapInstance.setZoom(15);
                    setUserPosition(newPosition);
                    setMapPosition((prev) => ({ ...prev, zoom: 15 }));
                },
                (error) => {
                    console.error("Error getting user's position: ", error);
                }
            );
        }
    };

    useEffect(() => {
        if (mapInstance && mapsInstance) {
            const listener = mapInstance.addListener("idle", () => {
                updateBounds(mapInstance);
            });
        console.log("mapPosition first", mapPosition);

            return () => {
                mapsInstance.event.removeListener(listener);
            };
        }
    }, [mapInstance, mapsInstance]);

    useEffect(() => {
        
        if (mapInstance && mapPosition) {
            const currentCenter = mapInstance.getCenter();
            const currentZoom = mapInstance.getZoom();
            if (
                currentCenter.lat() !== mapPosition?.lat ||
                currentCenter.lng() !== mapPosition?.lng ||
                currentZoom !== mapPosition.zoom
            ) {
                console.log("mapPosition",mapPosition);
                mapInstance.setCenter({
                    lat: mapPosition.lat,
                    lng: mapPosition.lng,
                });
                mapInstance.setZoom(mapPosition.zoom);
            }
        }
    }, [mapPosition]);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <GoogleMap
                apiKey="AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw"
                defaultCenter={location}
                ref={mapRef}
                defaultZoom={mapPosition.zoom || 14}
                options={{ ...mapOption }}
                mapMinHeight="100%"
                onGoogleApiLoaded={onGoogleApiLoaded}
                onChange={(map) => {
                    console.log("map center", map.center);
                    
                    const newPosition = {
                        lat: map.center[1],
                        lng: map.center[0],
                        zoom: map.zoom,
                    };

                    // Vérifiez si les valeurs sont différentes avant de mettre à jour l'état
                    if (
                        newPosition.lat !== mapPosition.lat ||
                        newPosition.lng !== mapPosition.lng ||
                        newPosition.zoom !== mapPosition.zoom
                    ) {
                        setMapPosition(newPosition);
                    }
                }}
            >
                {arrayMap.map((items, index) => (
                    <Marker
                        key={index}
                        stats={stats}
                        style={{
                            backgroundColor:
                                clickedMarkerIndex === items.id
                                    ? "#34176E"
                                    : "#A273FF",
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
                        lat={items.lat}
                        lng={items.lng}
                        markerId={items.name}
                        index={index}
                        resiDetails={items}
                        clickedMarkerIndex={clickedMarkerIndex}
                        price={items.price}
                        onClick={() => {}}
                    />
                ))}
                {userPosition && (
                    <AdminMarker
                        lat={userPosition.lat}
                        lng={userPosition.lng}
                    />
                )}
            </GoogleMap>

            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: stats ? "20px" : "100px",
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
                    top: stats ? "10px" : "100px",
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        setMapPosition((prev) => ({
                            ...prev,
                            zoom: prev.zoom + 1,
                        }));
                        mapInstance.setZoom(mapPosition.zoom + 1);
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        setMapPosition((prev) => ({
                            ...prev,
                            zoom: prev.zoom - 1,
                        }));
                        mapInstance.setZoom(mapPosition.zoom - 1);
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={getUserPosition}
                >
                    <p>
                        <FaLocationArrow
                            style={{
                                padding: "0",
                                marginTop: "8px",
                                marginRight: "3px",
                            }}
                            color="#000"
                        />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatsMaps;
