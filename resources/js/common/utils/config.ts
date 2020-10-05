// export const API_BASE_URL = 'http://127.0.0.1:8000/api/';
// export const API_BASE_URL = "https://dev.anekaarisan.com/api/";
export const API_BASE_URL = "https://staging.anekaarisan.com/api/";

import { decodeToken, getToken } from "./cookie";

export const VERSION_APP = "v.2.7";

export const getHeader = () => {
    const item: any = getToken();

    if (item) {
        const headers: any = {
            Accept: "application/json",
            Authorization: "Bearer " + JSON.parse(item).access_token
        };
        return headers;
    }
};

export const getImageHeader = () => {
    const item: any = getToken();

    if (item) {
        const headers: any = {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + JSON.parse(item).access_token
        };
        return headers;
    }
};

export function isAuth() {
    const item: any = getToken();

    if (item) {
        const user: any = decodeToken(JSON.parse(item).access_token);
        if (user && user.sub) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
