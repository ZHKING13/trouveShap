import GoogleMapReact from "google-map-react";
import tv from "../assets/loca.svg";
import { useEffect, useState } from "react";
import { useTranslation} from 'react-i18next';

const Map = ({ location }) => {
    const { t, i18n } = useTranslation();
    const [rerenderTrigger, setRerenderTrigger] = useState(0);
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
                    <img src={tv} alt="icon" />
                </div>
            </div>
        );
    };
 
    useEffect(() => {
        setRerenderTrigger((prev) => prev + 1);
        console.log("rerender",location);
    }, [location.lat, location.lng]);
    return (
        <div
            style={{
                height: "200px",
                width: "100%",
                marginBottom: "20px",
                borderRadius: "30px",
            }}
        >
            <h2>{t("other.residenceLocation")}</h2>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key:"AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw"
                }}
                options={{
                    zoomControl: true,
                    draggable: false,


                }}
                defaultCenter={location}
                defaultZoom={18}
            >
                <CustomMarker lat={location.lat} lng={location.lng} />
            </GoogleMapReact>
        </div>
    );
};

export default Map;
