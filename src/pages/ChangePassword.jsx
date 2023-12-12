import { COLORS } from "../constant/Color";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
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
const ChangePassword = () => {
    const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const handleclick = async () => {
        setLoading(true);
        const { password, password2 } = formData;
        if (!password || !password2) {
            openNotificationWithIcon(
                "error",
                "champs requis",
                "veuillez remplir tous les champs"
            );
            setLoading(false);
            return;
        }
        const res = await RecoverPassword(formData);
        setLoading(false);
        if (res.status !== 201) {
            openNotificationWithIcon(
                "error",
                "connexion impossible",
                res.data.message
            );
            return;
        }
        openNotificationWithIcon(
            "success",
            "connexion réussie",
            "vous êtes connecté"
        );
       
    };
    return (
        <div>
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
                        Le nouveau mot de passe doit comprendre au moins un
                        symbole ou un chiffre et comporter au moins 8 caractères
                        et être différent de l’ancien.
                    </span>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "100%",
                        }}
                    >
                        <label for="email">Mot de passe*</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Min. 8 characters"
                            required
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <label for="password">Confirmez le mot de passe*</label>
                        <input
                            type="password"
                            name="password2"
                            id="password"
                            required
                            className="form-input"
                            placeholder="Min. 8 characters"
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
        </div>
    );
};
export default ChangePassword;
