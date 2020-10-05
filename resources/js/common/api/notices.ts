import request from "../utils/request";
import { getHeader } from "../utils/config";

export const fetchNotices = (params?: any) => {
    return request({
        url: `/mynotices`,
        method: "get",
        headers: getHeader()
    });
};

export const readNotices = () => {
    return request({
        url: `/readmynotice`,
        method: "post",
        headers: getHeader()
    });
};
