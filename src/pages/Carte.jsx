import React, { useState } from "react";
import {
    APIProvider,
    Map,
    Marker,
    MapControl,
    ControlPosition,
    AdvancedMarker,
    Pin,
} from "@vis.gl/react-google-maps";
import {
   
    notification,
   
} from "antd";
import { Icon } from "../constant/Icon";
import { icon } from "@fortawesome/fontawesome-svg-core";
import FilterBoxe from "../components/FilterBoxe";
import { Header } from "rsuite";
import { FilterModal } from "./Residence";
import GoogleMapReact from "google-map-react";
import { getMapResidence } from "../feature/API";
import { useNavigate, useOutletContext } from "react-router-dom";
import logo from "../assets/logo_sm.png";

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
    
    
    const [loading, setLoading] = useOutletContext();

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
        numPeople: "",
        status: "",
    });
    const navigate = useNavigate();
        const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const filtResidence = () => {
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const params = {
        
        limit: 7,
        status: filterValue.status,
        admin_search: filtertext,
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
        const res = await getMapResidence(filteredObject, headers);
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
        setResidence(res.data.residences);
        console.log(residence);
    };
    return (
        < >
            <div style={{ width: "100%", height: "100%" }} className="">
                <Header
                    title={"RESIDENCES"}
                    path={"Résidences"}
                    children={
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems:"center",
                            paddingRight: 20,
                            paddingLeft: 20,
                        }}>
                            <div >
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
             <GoogleMapReact
                bootstrapURLKeys={{
                    key:"AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw"
                }}
                options={{
                    zoomControl: true,
                    draggable: false,


                }}
                defaultCenter={position}
                defaultZoom={14}
            >
                    {
                        residence && residence.map((item) => {
                            return <CustomMarker lat={parseFloat(item.lat)} lng={parseFloat(item.lng)} />
                        })
                }
            </GoogleMapReact>
            </div>
        </>
    );
};

const CustomMarker = () => {
        return (
            <div
                style={{
                    backgroundColor: "#C7ABFF ",
                    borderRadius: "50%",
                    padding: "10px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#A273FF ",
                        borderRadius: "50%",
                        padding: "10px",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    className="maps-statLeft"
                >
                    <img src={Icon.tv} alt="icon" />
                </div>
            </div>
        );
    };