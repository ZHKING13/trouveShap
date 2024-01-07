import axios from "axios";


export const API_URL = "https://api.trouvechap.com";
const privateService = axios.create({
    baseURL: API_URL,
});

export const LoginUser = async(data) => {
    try {
        const response = await privateService.post("/users/login", data)
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }

        return { status: error.response.status, data: error.response.data };
    }
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
    try {
        const response = await privateService.post("/users/request_password_recovery", data)
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };

    }
}
export const CheckPasswordRecoveryCode = async(data) => {
        try {
            const response = await privateService.post("/users/check_password_recovery_code", data)
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };

        }

    }
    //put users/update-password
export const UpdatePassword = async(data, headers) => {
    try {
        const response = await privateService.put("/users/update-password", data, { headers })
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };

    }

}
export const ResetPassword = async(data) => {
    try {
        const response = await privateService.post("/users/password_recovery_update", data)
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };

    }
}
export const getResidence = async(params, headers) => {
    try {
        const queryString = new URLSearchParams(params).toString();

        const response = await privateService.get("/admin/store?" + queryString, {

            headers,
        })
        console.log(response);
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }


        return { status: error.response.status, data: error.response.data };

    }
}
export const getResidenceById = async(id, headers) => {
    try {
        const response = await privateService.get(`/admin/store/${id}`, { headers })
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };
    }
}
export const getStats = async(headers) => {
    try {
        const response = await privateService.get("/users/statistics_home", { headers })
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };
    }
}
export const getProfilStats = async(headers) => {
        try {
            const response = await privateService.get("/users/statistics_profil", { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // delet residence /admin/residences/{id}
export const deleteResidence = async(id, data, headers) => {
        try {

            const response = await privateService.delete(`/admin/residences/${id}`, { headers, data })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // update residence /admin/residences/update_status/{id}
export const updateResidence = async(id, data, headers) => {
        try {
            const response = await privateService.put(`/admin/residences/update_status/${id}`, data, { headers })
            const { status, data: responseData } = response;
            console.log(response)
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // /admin/refunds/accept/{id}
export const AccepteReimbursment = async(id, headers) => {
    try {
        console.log(id, headers);
        const response = await privateService.put(`/admin/refunds/accept/${id}`, {}, { headers });
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };
    }
};

// reject reimbursment /admin/refunds/reject/{id}
export const RejectReimbursment = async(id, data, headers) => {
        try {
            console.log(id, headers)
            const response = await privateService.put(`/admin/refunds/reject/${id}`, data, { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    //post put refund /admin/refunds/pay/{id}

export const PayReimbursment = async(id, headers) => {
        try {
            console.log(id, headers)
            const response = await privateService.put(`/admin/refunds/pay/${id}`, null, { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // pay host /admin/bookings/pay_host/
export const PayHost = async(id, headers) => {
        try {
            console.log(id, headers)
            const response = await privateService.put(`/admin/bookings/pay_host/${id}`, null, { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // get reservation /admin/bookings

export const getReservation = async(params, headers) => {
        try {
            const queryString = new URLSearchParams(params).toString();

            const response = await privateService.get("/admin/bookings/?" + queryString, { headers })
            const { status, data: responseData } = response;
            console.log(response)
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // get newsletter /admin/newletters
export const getNewsletter = async(params, headers) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await privateService.get("/admin/newletters?" + queryString, { headers })
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };
    }

}

export const getReimbusment = async(params, headers) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await privateService.get("/admin/requests?" + queryString, { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }

    }
    //get /admin/residences/status_history
export const getStatusHistory = async(params, headers) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await privateService.get("/admin/residences/status_history?" + queryString, { headers })
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };
    }
}