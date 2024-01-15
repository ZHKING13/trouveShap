
import React from "react";
import build from "../assets/build.png";
import "./stat.css";
const Stats = ({title,subtitle,children,icon }) => {
    return (
        <div className="statContainer">
            <div className="statLeft">
                <img src={icon} alt="icon" />
            </div>
            <div className="statRight">
                <p>{ title}</p>
                <div className="statdetail">
                    <h5>{ subtitle}</h5>
                    {children && <span>{children}</span>}
                </div>
            </div>
        </div>
    );
};
export default Stats;
