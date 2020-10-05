import request from "../utils/request";
import { getHeader } from "../utils/config";

export const getSnapTokenApi = (data: any) => {
    return request({
        url: `midtrans/snaptoken`,
        method: "post",
        headers: getHeader(),
        data
    });
};

export const getStatusOrderMidtransApi = (orderId: string) => {
    return request({
        url: `midtrans/${orderId}/status`,
        method: "post",
        headers: getHeader()
    });
};

