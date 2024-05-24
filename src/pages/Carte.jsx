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
import { Icon } from "../constant/Icon";
import { icon } from "@fortawesome/fontawesome-svg-core";
import FilterBoxe from "../components/FilterBoxe";
import { Header } from "rsuite";
import { FilterModal } from "./Residence";
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
    const filtResidence = () => {
        console.log("filterValue", filterValue);
    };
    return (
        <APIProvider apiKey={"AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw"}>
            <div style={{ width: "100%", height: "70vh" }} className="">
                <Header
                    title={"RESIDENCES"}
                    path={"Résidences"}
                    children={
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
                <Map
                    width="100%"
                    height="50%"
                    defaultCenter={{ lat: 5.35, lng: -3.967696 }}
                    defaultZoom={12}
                    mapId={"3e9230c5a4bf47b4"}
                >
                    <MapControl
                        position={ControlPosition.LEFT_TOP}
                        style={{ margin: 10 }}
                        options={{ style: "SMALL" }}
                    >
                        <div
                            style={{
                                backgroundColor: "#fff",
                                padding: 10,
                                borderRadius: 5,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 10,
                                cursor: "pointer",
                            }}
                        >
                            <h4>Retourner a l’accueil</h4>
                        </div>
                    </MapControl>
                    {residenceLocationArray.map((location, index) => (
                        <CustomizedMarker
                            key={index}
                            position={location}
                            offsetTop={-20}
                            offsetLeft={-10}
                        />
                    ))}
                </Map>
            </div>
        </APIProvider>
    );
};
