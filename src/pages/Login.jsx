import Button from "../components/Button";
import { GoogleOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import { COLORS } from "../constant/Color";
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
                        connexion
                    </p>
                    <span>
                        saisissez votre adresse email et votre mot de passe pour
                        vous connecter
                    </span>
                    <Button style={styleProps}>
                        <img src={google} alt="google" />
                        <span>Se connecter avec Google</span>
                    </Button>
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
                        <label for="password">Mot de passe*</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="form-input"
                            placeholder="Min. 8 characters"
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
                            <a href="#">Mot de passe oublié?</a>
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
                        >
                            <span style={{ color: "#f1f1f1" }}>Conexion</span>
                        </Button>
                    </div>
                    <div
                        style={{
                            fontSize: "12px",
                        }}
                    >
                        <p>
                            Pas de compte ?<a href="#">Créer un compte</a>
                        </p>
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
export default Login;
