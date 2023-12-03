import { useState } from "react";
import DataTable from "../components/DataTable";
import Header from "../components/Header";
import { Avatar, Button, Carousel, Divider, Drawer, Space, Tag } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import wifi from "../assets/wifi.svg";
import clim from "../assets/clim.svg";
import tv from "../assets/tv.svg";
import wash from "../assets/wash.svg";
import refri from "../assets/refri.svg";
import fan from "../assets/fan.svg";
import Map from "../components/Map";
const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
};
const Residence = () => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (
        <main>
            <Header title={"RESIDENCES"} path={"Résidences"} />
            <Drawer placement="right" onClose={onClose} open={open}>
                <div
                    style={{
                        position: "relative",
                    }}
                    className="top"
                >
                    <Carousel autoplay>
                        <div>
                            <h3 style={contentStyle}>1</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>2</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>3</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>4</h3>
                        </div>
                    </Carousel>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            color: "#000",
                            padding: "10px 18px ",
                            backgroundColor: "#fff",
                            borderRadius: "100px",
                        }}
                    >
                        <span>
                            <PictureOutlined /> +5 photos
                        </span>
                    </div>
                </div>
                <Divider />
                <h2
                    style={{
                        color: "#1B2559",
                    }}
                >
                    Danubius regent hotel park
                </h2>
                <span>Abidjan, Cocody Angré</span>
                <Divider />
                <div className="price">
                    <h2
                        style={{
                            color: "#1B2559",
                        }}
                    >
                        15.000 fcfa / nuits
                    </h2>
                    <p>Prix</p>
                </div>
                <Divider />
                <div
                    style={{
                        display: "flex",

                        alignItems: "center",
                    }}
                    className="user"
                >
                    <Avatar size={64} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "10px",
                        }}
                    >
                        <p>Hôte</p>
                        <h3
                            style={{
                                color: "#1B2559",
                            }}
                        >
                            Franck kelkun
                        </h3>
                    </div>
                </div>
                <Divider />
                <div orientation="vertical">
                    <h2>Comodités</h2>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px",
                            marginTop: "10px",
                        }}
                    >
                        <Space className="comodite">
                            <img src={clim} /> Climatisation
                        </Space>
                        <Space className="comodite">
                            <img src={tv} /> Télévision
                        </Space>
                        <Space className="comodite">
                            <img src={wash} /> Lave linge
                        </Space>
                        <Space className="comodite">
                            <img src={wifi} /> Wifi
                        </Space>
                        <Space className="comodite">
                            <img src={refri} /> Réfrigérateur
                        </Space>
                        <Space className="comodite">
                            <img src={fan} /> Ventilateur
                        </Space>
                    </div>
                </div>
                <Divider />
                <Map    />
            </Drawer>
            <DataTable
                onclick={() => {
                    showDrawer();
                }}
            />
        </main>
    );
}
export default Residence;