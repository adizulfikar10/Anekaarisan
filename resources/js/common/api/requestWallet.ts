import request from "../utils/request";
import { IRequestWalletData } from "../interface/requestWallet.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchRequestWallets = (params?: any) => {
    return request({
        url: `walletrequests?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneRequestWallet = (id?: string) => {
    return request({
        url: `walletrequests/${id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createRequestWallet = (data: IRequestWalletData) => {
    return request({
        url: `walletrequests`,
        method: "post",
        data: data,
        headers: getHeader()
    });
};

export const updateRequestWallet = (id: string, data: IRequestWalletData) => {
    return request({
        url: `walletrequests/${data.id}`,
        method: "patch",
        data: data,
        headers: getHeader()
    });
};

export const deleteRequestWallet = (id: string) => {
    return request({
        url: `walletrequests/${id}`,
        method: "delete",
        headers: getHeader()
    });
};
