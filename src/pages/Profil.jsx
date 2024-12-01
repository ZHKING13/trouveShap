import { Button, Card, Divider, Input, Space, Tag, notification } from "antd";
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
import { API_URL, UpdateAvatar, UpdatePassword, getProfilStats } from "../feature/API";
import { formatAmount } from "./Home";
import Uploads from "../components/Upload";
import { useTranslation } from "react-i18next";

const Profil = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useOutletContext();
    const [stats, setStats] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [avatarEditMode, setAvatarEditMode] = useState(false);
    const [passWord, setPassWord] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [api, contextHolder] = notification.useNotification();
    const [avatar, setAvatar] = useState(null);
    // const logUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [logUser, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );
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
    const handleChange = (e) => {
        setPassWord(e.target.value);
    }
    const upDateAvatar = async () => {
        let data ={avatar}
        setLoading2(true);
        let header = {...headers, "Content-Type": "multipart/form-data"};
        const res = await UpdateAvatar(data, header);
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Erreur",
                res.data.message
            );
            setLoading2(false);
            return;
        }
        setUser({...logUser, avatar: res.data.avatar});
        openNotificationWithIcon(
            "success",
            "Succès",
            "Votre avatar a été modifié avec succès"
        );
        setLoading(false);
        setAvatarEditMode(false);

    }
    const onSubmite = async () => {
        setLoading2(true);
        if (passWord === "" || oldPassword === "") {
            openNotificationWithIcon(
                "error",
                "Erreur",
                "merci de remplir tout les champs"
            );
            setLoading2(false);
            return;
        }
        let data = {
            newPassword: passWord,
            oldPassword: oldPassword,
        };
        const res = await UpdatePassword(data, headers);
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon(
                "error",
                "Erreur",
                res.data.message
            );
            setOldPassword("");
            setPassWord("");
            setLoading2(false);
            return;
        }
        openNotificationWithIcon(
            "success",
            "Succès",
            "Votre mot de passe a été modifié avec succès"
        );
        setLoading2(false);
        setEditMode(false);
        localStorage.clear();
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }
    const fetchProfilStats = async () => {
        setLoading(true);
         let user =  localStorage.getItem("user");
         setUser(JSON.parse(user));
        const res = await getProfilStats(headers);
        console.log(res);

        if (res.status !== 200) {
            openNotificationWithIcon("error", t("error.401"), t("error.retry1"));
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
                                        {logUser?.profile}{" "}
                                    </Tag>
                                </div>
                                {avatarEditMode ? (
                                    <div>
                                        <Uploads
                                            handleFileChange={(file) =>
                                                setAvatar(file)
                                            }
                                        />
                                        <Space>
                                            <Button
                                                onClick={() =>
                                                    setAvatarEditMode(false)
                                                }
                                                danger
                                            >
                                                {t("button.cancel")}
                                            </Button>
                                            <Button
                                                onClick={upDateAvatar}
                                                type="primary"
                                                loading={loading2}
                                            >
                                                {t("button.valid")}
                                            </Button>
                                        </Space>
                                    </div>
                                ) : (
                                    <div>
                                        <img
                                            src={`${API_URL}/assets/uploads/avatars/${logUser?.avatar}`}
                                            alt=""
                                            className="avatar"
                                        />
                                        <img
                                            style={{
                                                position: "absolute",
                                                top: 40,
                                                right: 104,
                                                background: "#A273FF",
                                                padding: 5,
                                                borderRadius: "50%",
                                            }}
                                            onClick={() => {
                                                setAvatarEditMode(true);
                                            }}
                                            src={edit}
                                            alt=""
                                        />
                                    </div>
                                )}
                                <Divider />
                                <div className="profilBotom">
                                    <div className="profilItem">
                                        <div className="left">
                                            <img src={mail} alt="" />
                                            <div>
                                                <p>email</p>
                                                <h4> {logUser.email} </h4>
                                            </div>
                                        </div>
                                        <div></div>
                                    </div>
                                    <Space size={20} className="profilItem">
                                        <div className="left">
                                            <img src={lock} alt="" />
                                            <div>
                                                <p>
                                                    {editMode
                                                        ? "Changer le mot de passe"
                                                        : "Mot de passe"}{" "}
                                                </p>
                                                {editMode ? (
                                                    <Space
                                                        direction="vertical"
                                                        size={10}
                                                    >
                                                        <Input.Password
                                                            onChange={(e) =>
                                                                setOldPassword(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="mots de pass actuel"
                                                        />
                                                        <Input.Password
                                                            onChange={
                                                                handleChange
                                                            }
                                                            placeholder="nouveau mots de passe"
                                                        />
                                                        <Space>
                                                            <Button
                                                                onClick={() =>
                                                                    setEditMode(
                                                                        false
                                                                    )
                                                                }
                                                                danger
                                                            >
                                                                {t("button.cancel")}
                                                            </Button>
                                                            <Button
                                                                onClick={
                                                                    onSubmite
                                                                }
                                                                type="primary"
                                                                loading={
                                                                    loading2
                                                                }
                                                            >
                                                                {t("button.valid")}
                                                            </Button>
                                                        </Space>
                                                    </Space>
                                                ) : (
                                                    <h4>********</h4>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {!editMode && (
                                                <img
                                                    onClick={() => {
                                                        setEditMode(true);
                                                    }}
                                                    src={edit}
                                                    alt=""
                                                />
                                            )}{" "}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profilStat">
                        <Stats
                            title={t("user.gain")}
                            subtitle={formatAmount(stats.getCompanyMoney)}
                            icon={note}
                        />
                        <Stats
                            title={t("user.reservation")}
                            subtitle={stats.getBooking}
                            icon={check}
                        />
                        <Stats
                            title={t("home.residences")}
                            subtitle={stats.getResidence}
                            icon={build}
                        />
                        <Stats
                            subtitle={stats.getVisits}
                            title={t("user.visite")}
                            icon={user}
                        />
                    </div>
                </div>
            </>
        </main>
    );
};
export default Profil;
