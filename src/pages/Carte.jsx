import React, { useEffect, useState } from "react";
import {
    APIProvider,
    // Map,
    Marker,
    MapControl,
    ControlPosition,
    AdvancedMarker,
    Pin,
} from "@vis.gl/react-google-maps";
import { Spin, notification } from "antd";
import { Icon } from "../constant/Icon";
import { icon } from "@fortawesome/fontawesome-svg-core";
import FilterBoxe from "../components/FilterBoxe";
import { Header } from "rsuite";
import { FilterModal } from "./Residence";
import { getMapResidence } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import logo from "../assets/logo_sm.png";
import Map from "../components/Map";
import Maps from "../components/ResiMaps";

const residenceLocationArray = [
    { lat: 5.35, lng: -3.967696 },
    { lat: 5.395045275554687, lng: -3.967696 },
    { lat: 5.386007366126123, lng: -3.931428682520963 },
    { lat: 5.359854251680091, lng: -3.9245513174790374 },
    { lat: 5.324954724445313, lng: -3.947696 },
    { lat: 5.313992633873877, lng: -3.985840682520963 },
    { lat: 5.340145748319909, lng: -3.9927180475628886 },
    { lat: 5.375045275554687, lng: -3.969696 },
    { lat: 5.386007366126123, lng: -4.005963317479037 },
];
const CustomizedMarker = ({ position }) => (
    <AdvancedMarker children position={position}>
        <div
            style={{
                backgroundColor: "#A273FF ",
                borderRadius: "6px",

                minWidth: "70px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px",
                color: "#fff",
                position: "relative",
            }}
            className="maps-statLeft"
        >
            100 000 FCFA
            <div
                style={{
                    backgroundColor: "#A273FF ",
                    borderBottomLeftRadius: "100%",
                    borderBottomRightRadius: "100%",
                    borderEndEndRadius: "100%",
                    padding: "2px",
                    width: "4px",
                    height: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: "-8px",
                }}
            ></div>
        </div>
    </AdvancedMarker>
);

const position = { lat: 5.35, lng: -3.967696 };
export const Carte = () => {
    const [filtertext, setFilterText] = useState("");
    const [residence, setResidence] = useState([]);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState({
        deletModal: false,
        filterModal: false,
        addModal: false,
        loading: false,
        rejectModal: false,
    });
    const [filterValue, setFilterValue] = useState({
        minPrice: "",
        maxPrice: "",
        numPeople: 5,
        status: "",
    });
    const navigate = useNavigate();
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
    const [mapPosition, setMapPosition] = useState({
        lat: 5.35,
        lng: -3.967696,
        zoom: 13,
    });
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const filtResidence = async () => {
        setShowModal({
            ...showModal,
            filterModal: false,
        });
        const filteredObject = await createQueryString(params);

        console.log(filteredObject);
        fetchResidence();
    };
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };

    const params = {
        limit: 7,
        status: filterValue.status,
        admin_search: filtertext,
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
        minPrice: filterValue.minPrice,
        maxPrice: filterValue.maxPrice,
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

    const fetchResidence = async () => {
        const filteredObject = createQueryString(params);

        console.log(filteredObject);

        const res = await getMapResidence(filteredObject, headers);
        console.log(res.data);
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
        setResidence(res.data);
                setLoading(false);

    };
    useEffect(() => {
        setLoading(true);
        fetchResidence();
        console.log("fetching data")
    }, [
        filtertext,
        filterValue,
        showModal.filterModal,
        mapBounds,
        mapPosition,
    ]);
    return (
        <>
            <Spin
                style={{
                    height: "100%",
                    width: "100%",
                }}
                spinning={false}
                tip="Chargement des données..."
            >
                <div
                    style={{
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title={"RESIDENCES"}
                        path={"Résidences"}
                        children={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 20,
                                    
                                    
                                }}
                            >
                                <div>
                                    {" "}
                                    <img src={logo} alt="" />
                                </div>
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
                            </div>
                        }
                    />
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
                    <Maps
                        location={{
                            lat: mapPosition.lat,
                            lng: mapPosition.lng,
                        }}
                        loading={loading}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        arrayMap={residence}
                        mapPosition={mapPosition}
                        setMapPosition={setMapPosition}
                        mapBounds={mapBounds}
                        setMapBounds={setMapBounds}
                    ></Maps>
                </div>
            </Spin>
        </>
    );
};

// const CustomMarker = () => {
//     return (
//         <Spin spinning={loading} tip="Chargement des données...">
//             <APIProvider apiKey="AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw">
//                 <div style={{ width: "100%", height: "100%" }} className="">
//                     <Header
//                         title={"RESIDENCES"}
//                         path={"Résidences"}
//                         children={
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                     paddingRight: 20,
//                                     paddingLeft: 20,
//                                 }}
//                             >
//                                 <div>
//                                     <img src={logo} alt="" />
//                                 </div>
//                                 <FilterBoxe
//                                     handleSearch={setFilterText}
//                                     filtertext={filtertext}
//                                     onClick={() => {
//                                         setShowModal({
//                                             ...showModal,
//                                             filterModal: true,
//                                         });
//                                     }}
//                                     placeHolder={"Rechercher une résidence"}
//                                     children={
//                                         <img
//                                             onClick={() => {
//                                                 setShowModal({
//                                                     ...showModal,
//                                                     filterModal: true,
//                                                 });
//                                             }}
//                                             src={Icon.filter}
//                                             alt="filter icon"
//                                         />
//                                     }
//                                 />
//                             </div>
//                         }
//                     />
//                     <FilterModal
//                         showModal={showModal}
//                         setShowModal={setShowModal}
//                         setFilterValue={setFilterValue}
//                         min={filterValue.minPrice}
//                         max={filterValue.maxPrice}
//                         numPeople={filterValue.numPeople}
//                         filterValue={filterValue}
//                         onConfirme={filtResidence}
//                         filtResidence={filtResidence}
//                     />
//                     <Map
//                         defaultCenter={position}
//                         mapId={"teststst"}
//                         defaultZoom={12}
//                     >
//                         <MapControl position={ControlPosition.TOP_LEFT}>
//                             <div
//                                 style={{
//                                     backgroundColor: "#fff",
//                                     padding: "10px",
//                                     borderRadius: "5px",
//                                     boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     alignItems: "center",
//                                 }}
//                             >
//                                 <div
//                                     style={{
//                                         backgroundColor: "#fff",
//                                         padding: "10px",
//                                         borderRadius: "5px",
//                                         boxShadow:
//                                             "0px 0px 5px rgba(0,0,0,0.1)",
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <div
//                                         style={{
//                                             backgroundColor: "#fff",
//                                             padding: "10px",
//                                             borderRadius: "5px",
//                                             boxShadow:
//                                                 "0px 0px 5px rgba(0,0,0,0.1)",
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             alignItems: "center",
//                                         }}
//                                     ></div>
//                                 </div>
//                             </div>
//                         </MapControl>
//                         {residence &&
//                             residence.map((residence) => {
//                                 return (
//                                     <CustomizedMarker
//                                         key={residence.id}
//                                         position={{
//                                             lat: parseFloat(residence.lat),
//                                             lng: parseFloat(residence.lng),
//                                         }}
//                                     />
//                                 );
//                             })}
//                     </Map>
//                 </div>
//             </APIProvider>
//         </Spin>
//     );
// }
