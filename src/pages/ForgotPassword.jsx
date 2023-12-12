import Button from "../components/Button";
import { COLORS } from "../constant/Color";
import logo from "../assets/logo.png";
import { useNavigate, Navigate } from "react-router-dom";
import { Spin, notification } from "antd";
import { useState } from "react";
import { RecoverPassword } from "../feature/API";

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
const ForgotPassword = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
    const [formdata, setFormdata] = useState(new FormData())
    const [api, contextHolder] = notification.useNotification();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    }
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const handleclick = async() => {
        setLoading(true);
        const { email } = formdata;
        if (!email) {
            openNotificationWithIcon(
                "error",
                "champs requis",
                "veuillez remplir tous les champs"
            );
            setLoading(false);
            return;
        }
        const res = await RecoverPassword(formdata)
        console.log(res)
        setLoading(false);
        if (res.status !== 201) {
            openNotificationWithIcon(
                "error",
                "connexion impossible",
                res.data.message
            );
            return
        }

        localStorage.setItem("requestId", JSON.stringify(res.data.id));
       navigate('/otp')
       
    };
    return (
        <Spin  spinning={loading} tip="Connexion en cours..." size="large">
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
                        Mot de passe oublié
                    </p>
                    <span>
                        Saisissez l'adresse e-mail associée à votre compte. Nous
                        vous enverrons un lien par e-mail pour réinitialiser
                        votre mot de passe.
                    </span>
{contextHolder}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "100%",
                        }}
                    >
                        <label for="email">Email*</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Adrianagrest@trouvechap.com"
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
                            onClick={handleclick}
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
export default ForgotPassword;
