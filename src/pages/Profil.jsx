import { Card, Divider, Space, Tag, notification } from "antd";
import Header from "../components/Header";
const { Meta } = Card;
import back from "../assets/back.jpeg";
import lock from "../assets/lock.png";
import mail from "../assets/mail.png";
import phone from "../assets/phone.png";
import edit from "../assets/edit.png";
import marker from "../assets/marker.png";
import wallet from "../assets/wallet.png";
import note from "../assets/note.png";
import build from "../assets/build1.png";
import check from "../assets/check.png";
import user from "../assets/users.png";
import Stats from "../components/Stats";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfilStats } from "../feature/API";
import { formatAmount } from "./Home";

const Profil = () => {
    const [loading, setLoading] = useOutletContext();
    const [stats, setStats] = useState([]);
    const [selectItem, setSelectItem] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const logUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        "refresh-token": localStorage.getItem("refreshToken"),
    };
    const fetchProfilStats = async () => {
        setLoading(true);
        const res = await getProfilStats(headers);
        console.log(res);

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
        setStats(res.data);
        setLoading(false);
    };
    useEffect(() => {
        fetchProfilStats();
    }, []);
    return (
        <main>
            <>
                {contextHolder}
                <Header title={"PROFIL"} path={"Profil"} />
                <div className="profilContainer">
                    <div className="profil">
                        <div
                            hoverable
                            style={{
                                width: 340,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    position: "relative",
                                    width: "100%",
                                }}
                                className="profilImg"
                            >
                                <img
                                    alt="example"
                                    src={back}
                                    className="backgroundImg"
                                />
                                <div className="subtitle">
                                    <p>
                                        {" "}
                                        {logUser.firstname} {logUser.lastname}{" "}
                                    </p>
                                    <Tag color="#A273FF">
                                        {logUser.profile}{" "}
                                    </Tag>
                                </div>
                                <img src={back} alt="" className="avatar" />
                                <Divider />
                                <div className="profilBotom">
                                    <div className="profilItem">
                                        <div className="left">
                                            <img src={mail} alt="" />
                                            <div>
                                                <p>Adresse email</p>
                                                <h4> {logUser.email} </h4>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                    <Space size={20} className="profilItem">
                                        <div className="left">
                                            <img src={lock} alt="" />
                                            <div>
                                                <p>Mot de passe</p>
                                                <h4>**********</h4>
                                            </div>
                                        </div>
                                        <div>
                                            <img src={edit} alt="" />
                                        </div>
                                    </Space>
                                    <div className="profilItem">
                                        <div className="left">
                                            <img src={phone} alt="" />
                                            <div>
                                                <p>Numéro de téléphone</p>
                                                <h4>{logUser.contact} </h4>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="profilItem">
                                        <div className="left">
                                            <img src={marker} alt="" />
                                            <div>
                                                <p>Lieu d’habitation</p>
                                                <h4>{logUser.location}</h4>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profilStat">
                        <Stats
                            title={"Gain "}
                            subtitle={formatAmount(stats.getCompanyMoney)}
                            icon={note}
                        />
                        <Stats
                            title="Réservation "
                            subtitle={stats.getBooking}
                            icon={check}
                        />
                        <Stats
                            title="Résidences "
                            subtitle={stats.getResidence}
                            icon={build}
                        />
                        <Stats
                            subtitle={stats.getVisits}
                            title="Nombre de visiteur"
                            icon={user}
                        />
                    </div>
                </div>
            </>
        </main>
    );
};
export default Profil;
