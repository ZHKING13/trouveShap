import { Card, Divider, Space, Tag } from "antd";
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


const Profil = () => {
    return (
        <main>
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
                                <p>Maxim Arnaud Bollou</p>
                                <Tag color="#A273FF">Admin</Tag>
                            </div>
                            <img src={back} alt="" className="avatar" />
                            <Divider />
                            <div className="profilBotom">
                                <div className="profilItem">
                                    <div className="left">
                                        <img src={mail} alt="" />
                                        <div>
                                            <p>Adresse email</p>
                                            <h4>Sergekota@gmail.com</h4>
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
                                            <h4>+225 0012345678</h4>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                                <div className="profilItem">
                                    <div className="left">
                                        <img src={marker} alt="" />
                                        <div>
                                            <p>Lieu d’habitation</p>
                                            <h4>Cocody angré 7eme tranche</h4>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profilStat">
                    <Stats title={"Gain "} subtitle="250.592k" icon={note} />
                    <Stats title="Réservation " subtitle="1857" icon={check} />
                    <Stats title="Résidences " subtitle="2935" icon={build} />
                    <Stats
                        subtitle="2935"
                        title="Nombre de visiteur"
                        icon={user}
                    />
                </div>
            </div>
        </main>
    );
};
export default Profil;
