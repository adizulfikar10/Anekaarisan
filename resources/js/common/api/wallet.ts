import request from "../utils/request";
import { IWalletData } from "../interface/wallet.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchWallets = (params?: any) => {
    return request({
        url: `wallets?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneWallet = (wallet_id?: string) => {
    return request({
        url: `wallets/${wallet_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createWallet = (wallet: IWalletData) => {
    return request({
        url: `wallets`,
        method: "post",
        data: wallet,
        headers: getHeader(),
    });
};

export const updateWallet = (wallet_id: string, wallet: IWalletData) => {
    return request({
        url: `wallets/${wallet.id}`,
        method: "patch",
        data: wallet,
        headers: getHeader(),
    });
};

export const deleteWallet = (wallet_id: string) => {
    return request({
        url: `wallets/${wallet_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
