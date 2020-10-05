import request from "../utils/request";
import { getHeader } from "../utils/config";

export const fetchSaldo = (user_id?: any) => {
    return request({
        url: `mastersaldos/${user_id}`,
        method: "get",
        headers: getHeader()
    });
};
