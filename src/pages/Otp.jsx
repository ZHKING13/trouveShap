import React, { useState } from "react";
import OtpInput from "react-otp-input";
import Button from "../components/Button";
import { COLORS } from "../constant/Color";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Spin, notification } from "antd";
import { CheckPasswordRecoveryCode } from "../feature/API";

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
const Otp = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, title, message) => {
        api[type]({
            message: title,
            description: message,
        });
    };
    const handleSubmit = async () => {
        setLoading(true);
        let requestId = localStorage.getItem("requestId");
        requestId = JSON.parse(requestId);
        requestId = parseInt(requestId);
        console.log(typeof requestId);
        const formdata = {
            code: otp,
            requestId: requestId,
        };
        console.log(formdata);
        if (otp.length < 5 || otp === "") {
            openNotificationWithIcon(
                "error",
                "OTP invalide",
                "Le code doit contenir 5 chiffres"
            );
            setLoading(false);
            return;
        }
        const res = await CheckPasswordRecoveryCode(formdata);
        setLoading(false);
        console.log(res);
        if (res.status !== 200) {
            openNotificationWithIcon("error", "OTP invalide", res.data.message);
            return;
        }
    };
    return (
        <Spin spinning={loading} size="large" tip="Chargement...">
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
                        Code OTP
                    </p>
                    <span>
                        Saisissez le code OTP que vous avez reçu par mail
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
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={5}
                            renderSeparator={<span> {""} </span>}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{
                                width: "100%",
                                height: "50px",
                                borderRadius: "10px",
                                outline: "none",
                                border: "1px solid #E5E7EB",
                            }}
                            shouldAutoFocus
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
export default Otp;
