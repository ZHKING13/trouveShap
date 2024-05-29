import React from "react";
import PropTypes from "prop-types";
import { Icon } from "../constant/Icon";
import {CaretDownOutlined} from "@ant-design/icons"
const Marker = ({
    className,
    lat,
    lng,
    markerId,
    onClick,
    draggable,
    onDrag,
    onDragEnd,
    onDragStart,
    price,
    resiDetails,
    index,
    clickedMarkerIndex,
    ...props
}) => {
    if (!lat || !lng) return null;

    const handleDragStart = (e) => {
        if (onDragStart) onDragStart(e, { latLng: { lat, lng } });
    };

    const handleDrag = (e) => {
        if (onDrag) onDrag(e, { latLng: { lat, lng } });
    };

    const handleDragEnd = (e) => {
        if (onDragEnd) onDragEnd(e, { latLng: { lat, lng } });
    };

    return (
        <div
            className={className}
            src={Icon.map}
            onClick={(e) =>
                onClick && onClick(e, { markerId, lat, lng, resiDetails,index })
            }
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ fontSize: 40 }}
            alt={markerId}
            width={35}
            height={35}
            draggable={draggable}
            {...props}
        >
            {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} XOF
            <div
                style={{
                    // backgroundColor: "#A273FF",
                    color:"#A273FF",
                    // width: "0",
                    // height: "0",
                    // borderLeft: "5px solid transparent",
                    // borderRight: "5px solid transparent",
                    // borderTop: "10px solid #A273FF",
                    position: "absolute",
                    bottom: "-10px",
                }}
            >
                <CaretDownOutlined style={{
                    color:clickedMarkerIndex == index ? "#34176E" : "#A273FF",
                    fontSize:"16px"
                }}  />
            </div>
        </div>
    );
};

Marker.propTypes = {
    className: PropTypes.string,
    draggable: PropTypes.bool,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    markerId: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragStart: PropTypes.func,
};

Marker.defaultProps = {
    className: "",
    draggable: false,
    onClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragStart: null,
};

export default Marker;
