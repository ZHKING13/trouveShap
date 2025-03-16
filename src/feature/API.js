import axios from "axios";
import { getCurrencyId, getLanguageId } from "../App";



//export const API_URL = "https://api.trouvechap.com";
// export const API_URL = "http://85.31.234.166:3032";
export const API_URL = "https://preprodapi.trouvechap.com";
const privateService = axios.create({
    baseURL: API_URL,
});
// /users/update_avatar
export const UpdateAvatar = async (data, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.patch("/users/update_avatar", data, { headers })

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
export const LoginUser = async (data) => {
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
export const AutoLogin = async (data) => {
    const response = await fetch(`${API_URL}/users/autologin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
    return response;
}
export const RecoverPassword = async (data) => {
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
export const CheckPasswordRecoveryCode = async (data) => {
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
export const UpdatePassword = async (data, headers) => {
    try {

        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
// /users/first-reset-password
export const firsLogiReset = async (data, headers) => {
    headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
    try {
        const response = await privateService.post("/users/first-reset-password", data, { headers })
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
export const ResetPassword = async (data) => {
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
const createQueryString = (data) => {
    const buildQuery = (obj, prefix) => {
        return Object.keys(obj)
            .filter((key) => {
                const value = obj[key];
                return value !== null && value !== undefined && value !== "";
            })
            .map((key) => {
                const value = obj[key];
                const queryKey = prefix ? `${prefix}[${key}]` : key;

                if (Array.isArray(value)) {
                    return value
                        .map((item, index) => {
                            if (typeof item === "object") {
                                return buildQuery(item, `${queryKey}[${index}]`);
                            }
                            return `${queryKey}[${index}]=${encodeURIComponent(item)}`;
                        })
                        .join("&");
                }

                if (typeof value === "object" && !Array.isArray(value)) {
                    return buildQuery(value, queryKey);
                }

                return `${queryKey}=${encodeURIComponent(value)}`;
            })
            .filter(Boolean) // Filter out any undefined or null values that might be returned
            .join("&");
    };

    return buildQuery(data);
};
export const getResidence = async (params, headers) => {
    headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
    try {
        const queryString = createQueryString(params)
        console.log("querystringgg", queryString)
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
//Get /résidences/price_range
export const getResidencePriceRange = async (headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/residences/price_range", { headers })
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
export const getMapResidence = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const queryString = new URLSearchParams(params).toString();

        const response = await privateService.get("/residences/map?" + queryString, {

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
export const getUsers = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const queryString = new URLSearchParams(params).toString();

        const response = await privateService.get("/admin/users?" + queryString, {

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
// GET /admin/users-stats
export const getUsersStats = async (headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/admin/users-stats", { headers })
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
// get /stats/admin/total-money-stats
export const getTotalMoneyStats = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/total-money-stats", { headers, params: query })
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
//get /stats/admin/company-money-stats
export const getCompanyMoneyStats = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/company-money-stats", { headers, params: query })
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
// /stats/admin/conversion-stats
export const getConversionStats = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/conversion-stats", { headers, params: query })
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
// /stats/admin/cancellation-rate-bookings
export const getCancelationRateBookings = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/cancellation-rate-bookings", { headers, params: query })
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
// /stats/admin/mean-price-stats
export const getMeanPriceStats = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/mean-price-stats", { headers, params: query })
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

// get /stats/admin/booking-stats
export const getBookingStats = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/booking-stats", { headers, params: query })
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
// get /stats/admin/visitor-stats
export const getVisitorStats = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/visitor-stats", { headers, params: query })
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
// get /stats/admin/rate-stat
export const getRateStat = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/rate-stat", { headers, params: query })
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
// /stats/admin/count-stats
export const getCountStats = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/count-stats", { headers, params: query })
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
// /stats/admin/traveler-stat
export const getTravelerStat = async (headers, query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/traveler-stat", { headers, params: query })
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
// get /stats/admin/host-stat
export const getHostStat = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/host-stat", { headers, params: query })
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
// get /stats/admin/cancellation-booking-stat-one
export const getCancellationBookingStatOne = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/cancellation-booking-stat-one", { headers, params: query })
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
export const getCancellationBookingStatTwo = async (headers,query) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/stats/admin/cancellation-booking-stat-two", { headers, params: query })
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
//  /stats/admin/cancelled-bookings-stat
export const getCancelledBookingsStat = async (headers, query) => {
    try {
        headers = {
            ...headers,
            "Currency-id": await getCurrencyId(),
            "lang": await getLanguageId()
        };

        const response = await privateService.get(
            "/stats/admin/cancelled-bookings-stat",
            { headers, params: query } // Ajout de query dans params
        );

        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response?.status || 500, data: error.response?.data || { message: 'Unknown error' } };
    }
};
// /stats/admin/refunded-bookings-stat
export const getRefungBooking = async (headers, query) => {
    try {
        headers = {
            ...headers,
            "Currency-id": await getCurrencyId(),
            "lang": await getLanguageId()
        };

        const response = await privateService.get(
            "/stats/admin/refunded-bookings-stat",
            { headers, params: query } // Ajout de query dans params
        );

        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response?.status || 500, data: error.response?.data || { message: 'Unknown error' } };
    }
};
// /stats/admin/residence-rejected-stat
export const getResidenceRejected = async (headers, query) => {
    try {
        headers = {
            ...headers,
            "Currency-id": await getCurrencyId(),
            "lang": await getLanguageId()
        };

        const response = await privateService.get(
            "/stats/admin/residence-rejected-stat",
            { headers, params: query } // Ajout de query dans params
        );

        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response?.status || 500, data: error.response?.data || { message: 'Unknown error' } };
    }
};
// /stats/admin/city-stats
export const getCityStats = async (headers, query) => {
    try {
        headers = {
            ...headers,
            "Currency-id": await getCurrencyId(),
            "lang": await getLanguageId()
        };

        const response = await privateService.get(
            "/stats/admin/city-stats",
            { headers, params: query } // Ajout de query dans params
        );

        const { status, data: responseData } = response;
        return { status, data: responseData };
    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED' || error.code === "ERR_NETWORK") {
            console.error('La requête a expiré en raison d\'un timeout.');
            return { status: 408, data: { message: 'Request Timeout' } };
        }
        return { status: error.response?.status || 500, data: error.response?.data || { message: 'Unknown error' } };
    }
};

// Get /admin/actions-logs
export const getAdminLogs = async (headers, body) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.post("/admin/logs", body, { headers })
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
export const getResidenceById = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
// /admin/admins/{id}
export const togleAdmin = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.put(`/admin/admins/toggle-enable/${id}`, {}, { headers })
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
export const resetAdminPwd = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.put(`/admin/admins/reset-password/${id}`, {}, { headers })
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
export const editAdmin = async (id, data, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.put(`/admin/admins/${id}`, data, { headers })
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
export const addAdmin = async (data, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.post(`/admin/admins`, data, { headers })
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
export const getStats = async (headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const getProfilStats = async (headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const deleteResidence = async (id, data, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const updateResidence = async (id, data, headers) => {
    try {

        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const AccepteReimbursment = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const RejectReimbursment = async (id, data, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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

export const PayReimbursment = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const PayHost = async (id, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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

export const getReservation = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const getAdmins = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const queryString = new URLSearchParams(params).toString();

        const response = await privateService.get("/admin/admins/?" + queryString, { headers })
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
// /résidences/currencies-list
export const getCurrenciesList = async (headers) => {
    try {

        const response = await privateService.get("/residences/currencies-list", { headers })
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

export const getAllAdmins = async (headers) => {
    try {
        // const queryString = new URLSearchParams(params).toString();
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/admin/all-admins", { headers })
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
export const getActionLogs = async (headers) => {
    try {
        // const queryString = new URLSearchParams(params).toString();
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const response = await privateService.get("/admin/actions-logs", { headers })
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
export const getNewsletter = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
        const queryString = new URLSearchParams(params).toString();
        console.log(queryString)
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

export const getReimbusment = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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
export const getStatusHistory = async (params, headers) => {
    try {
        headers = { ...headers, "Currency-id": await getCurrencyId(), "lang": await getLanguageId() }
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