import Button from "../components/Button";
import { GoogleOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import { COLORS } from "../constant/Color";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginUser } from "../feature/API";
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

const Login = () => {
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
    // validate input value befor submit
    const handleSubmit = async (e) => {
        setLoading(true);
        // check if formdat is empty
        const { email, password } = formData;
        if (!email || !password) {
            openNotificationWithIcon(
                "error",
                "champs requis",
                "veuillez remplir tous les champs"
            );
            setLoading(false);
            return;
        }

        e.preventDefault();
        const rest = await LoginUser(formData);
        setLoading(false);
        console.log(rest);
        if (rest.status !== 201) {
            openNotificationWithIcon(
                "error",
                "connexion impossible",
                rest.data.message
            );
            return;
        }
        localStorage.setItem("isLog", true);
        localStorage.setItem("user", JSON.stringify(rest.data));
        localStorage.setItem("token", rest.data.token);
        localStorage.setItem("accesToken", rest.data.access_token);
        localStorage.setItem("refreshToken", rest.data.refresh_token);
        openNotificationWithIcon("success", "connexion reussi","vous allez etre redirigé vers votre espace");
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
                        connexion
                    </p>
                    <span>
                        saisissez votre adresse email et votre mot de passe pour
                        vous connecter
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
                        <label for="email">Email*</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Adrianagrest@trouvechap.com"
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
                        <label for="password">Mot de passe*</label>
                        <input
                            type="password"
                            name="password"
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
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "12px",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                justifyContent: "center",
                            }}
                        >
                            <input
                                type="checkbox"
                                name="remember"
                                id="remember"
                            />
                            <label for="remember">Me garder connecté</label>
                        </div>
                        <p>
                            <Link to="/forgot-password">
                                Mot de passe oublié?
                            </Link>
                        </p>
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
                            <span style={{ color: "#f1f1f1" }}>Conexion</span>
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
export default Login;
