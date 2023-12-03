import GoogleMapReact from "google-map-react";
import tv from "../assets/loca.svg";

const Map = () => {
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

    const location = {
        address: "1600 Amphitheatre Parkway, Mountain View, California.",
        lat: 37.42216,
        lng: -122.08427,
    };

    return (
        <div
            style={{
                height: "200px",
                width: "100%",
                marginBottom: "20px",
                borderRadius: "30px",
            }}
        >
            <h2>Localisation du logement</h2>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyDR_ABkBmzqjHJr5mOcvYepEPkVgZITulY",
                }}
                defaultCenter={location}
                defaultZoom={13}
            >
                <CustomMarker lat={location.lat} lng={location.lng} />
            </GoogleMapReact>
        </div>
    );
};

export default Map;
