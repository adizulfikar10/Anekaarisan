import request from "../utils/request";
import { IWithdrawData } from "../interface/withdraw.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchWithdraws = (params?: any) => {
    return request({
        url: `withdraws?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneWithdraw = (withdraw_id?: string) => {
    return request({
        url: `withdraws/${withdraw_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createWithdraw = (withdraw: IWithdrawData) => {
    return request({
        url: `withdraws`,
        method: "post",
        data: withdraw,
        headers: getHeader(),
    });
};

export const updateWithdraw = (withdraw_id: string, withdraw: IWithdrawData) => {
    return request({
        url: `withdraws/${withdraw.id}`,
        method: "patch",
        data: withdraw,
        headers: getHeader(),
    });
};

export const deleteWithdraw = (withdraw_id: string) => {
    return request({
        url: `withdraws/${withdraw_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
