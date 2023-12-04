import axios from "axios";


const API_URL = "http://85.31.234.166:3030";
const publicServices = axios.create({
    baseURL: API_URL,
});

export const LoginUser = async(data) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
    console.log(response);
    return response;
};
export const AutoLogin = async(data) => {
    const response = await fetch(`${API_URL}/users/autologin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
}
export const RecoverPassword = async(data) => {
        const response = await fetch(`${API_URL}/users/request_password_recovery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
        return response;
    }
    // /users/check_password_recovery_code
export const CheckPasswordRecoveryCode = async(data) => {
    const response = await fetch(`${API_URL}/users/check_password_recovery_code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;

}
export const ResetPassword = async(data) => {
    const response = await fetch(`${API_URL}/users/password_recovery_update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
}