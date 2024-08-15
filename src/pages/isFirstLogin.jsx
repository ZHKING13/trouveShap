import Button from "../components/Button";
import { GoogleOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import { COLORS } from "../constant/Color";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { firsLogiReset, LoginUser } from "../feature/API";
import { Spin, notification } from "antd";
import Loader from "../components/Loader";
const styleProps = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    background: "#F4F7FE",
    maxWidth: "300px",
    height: "40px",
    borderRadius: "100px",
};

const FirstLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(new FormData());
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
     const logUser = JSON.parse(localStorage.getItem("user"));
    const headers = {
        Authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        // "refresh-token": localStorage.getItem("refreshToken"),
    };
    // validate input value befor submit
    const handleSubmit = async (e) => {
        setLoading(true);
        // check if formdat is empty
        const { password, password2 } = formData;
        if (password != password2) {
            openNotificationWithIcon(
                "error",
                "INVALIDE",
                "veuillez remplir tous les champs"
            );
            setLoading(false);
            return;
        }
let body = {
    new_password: password,
    email:logUser?.email
}
        e.preventDefault();
        const rest = await firsLogiReset(body,headers);
        setLoading(false);
        console.log(rest);
        if (rest.status !== 201) {
            openNotificationWithIcon(
                "error",
                "les deux champs ne correspondent pas",
                rest.data.message
            );
            return;
        }
        
        localStorage.setItem("firstLogin", false);
        // let firstLogin = rest.data.isFirstLogin
        openNotificationWithIcon("success", rest.data.message,"vous allez etre redirigé vers votre espace");
        setTimeout(() => {
            navigate("/");
        }, 1500);
    };
    return (
        <Spin spinning={loading} tip="Connexion en cours..." size="large">
            <div className="loginContainer">
                <div className="formContainer">
                    <p
                        style={{
                            color: COLORS.primary,
                            fontSize: "32px",
                            fontWeight: "400",
                            letterSpacing: "-0.64px",
                        }}
                    >
                        Renitialisation du mots de passe
                    </p>
                    <span>
                       merci  re remplir le formulaire
                    </span>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "100%",
                        }}
                    >
                        {contextHolder}
                        <label for="password">Mots de passe*</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            id="password"
                             placeholder="Min. 8 characters"
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <label for="password2">confirmer le Mot de passe*</label>
                        <input
                            type="password"
                            name="password2"
                            id="password"
                            required
                            className="form-input"
                            placeholder="Min. 8 characters"
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <Button
                            style={{
                                ...styleProps,
                                background: COLORS.primary,
                            }}
                            onClick={handleSubmit}
                        >
                            <span style={{ color: "#f1f1f1" }}>Connexion</span>
                        </Button>
                    </div>
                </div>
                <div className="logo">
                    <img
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                        src={logo}
                        alt="logo"
                    />
                </div>
            </div>
            <footer
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    width: "100vw",
                    color: "#A3AED0",
                    fontWeight: "600",
                    letterSpacing: "-0.24px",
                    position: "absolute",
                    bottom: "0",
                    margin: "auto",
                }}
            >
                <p>© 2023 Trouvechap. Tous droits réservé.</p>
            </footer>
        </Spin>
    );
};
export default FirstLogin;
