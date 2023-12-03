import React, { useState } from "react";
import OtpInput from "react-otp-input";
import Button from "../components/Button";
import { COLORS } from "../constant/Color";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

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
    const renderInput = ({ ...props }) => {
        console.log("value");
        return (
            <input
                // key={index}
                // value={value.value}
                className="otpInput"
                // onChange={value.onChange}
                // ref={value.ref}
            />
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
                        Code OTP
                    </p>
                    <span>
                        Saisissez le code OTP que vous avez reçu par mail
                    </span>

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
                            numInputs={4}
                            renderSeparator={<span> {""} </span>}
                            renderInput={(props) => <input {...props} />}
                            
                            inputStyle={{
                                width: "100%",

                                height: "50px",
                                borderRadius: "10px",

                                outline: "none",
                                border: "1px solid #E5E7EB",
                            }}
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
                            // onClick={handleclick}
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
export default Otp;
