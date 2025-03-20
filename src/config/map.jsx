import { Autocomplete, useLoadScript } from "@react-google-maps/api";
const libraries = ["places"];

export const useGoogleMaps = () => {
    return useLoadScript({
        googleMapsApiKey: "AIzaSyAYOroIYOdDWkyPJeSmSVCEOMnsUszUnLw",
        libraries,
    });
};