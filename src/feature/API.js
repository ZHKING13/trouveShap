import axios from "axios";


const API_URL = "https://api.trouvechap.com";
const privateService = axios.create({
    baseURL: API_URL,
});

export const LoginUser = async(data) => {
    try {
        const response = await privateService.post("/users/login", data)
        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
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
        if (error.code === 'ECONNABORTED') {
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
        if (error.code === 'ECONNABORTED') {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response.status, data: error.response.data };

    }

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
        if (error.code === 'ECONNABORTED') {
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
        if (error.code === 'ECONNABORTED') {
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
        if (error.code === 'ECONNABORTED') {
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
            if (error.code === 'ECONNABORTED') {
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
            if (error.code === 'ECONNABORTED') {
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
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED') {
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

            const response = await privateService.get("/admin/bookings?" + queryString, { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED') {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }
    }
    // get newsletter /admin/newletters
export const getNewsletter = async(headers) => {
        try {
            const response = await privateService.get("/admin/newletters", { headers })
            const { status, data: responseData } = response;
            return { status, data: responseData };
        } catch (error) {
            console.log(error);
            if (error.code === 'ECONNABORTED') {
                console.error('La requête a expiré en raison d\'un timeout.');
                return { status: 408, data: { message: 'Request Timeout' } };
            }
            return { status: error.response.status, data: error.response.data };
        }

    } // get residence by date