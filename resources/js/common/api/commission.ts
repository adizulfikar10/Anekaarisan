import request from "../utils/request";
import { ICommissionData } from "../interface/commission.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchCommissions = (params?: any) => {
    return request({
        url: `walletrequests?` + generateQuery(params),
        method: "get",
        headers: getHeader(),

    });
};

export const fetchOneCommission = (commission_id?: string) => {
    return request({
        url: `walletrequests/${commission_id}`,
        method: "get",
        headers: getHeader(),

    });
};

export const createCommission = (commission: ICommissionData) => {
    return request({
        url: `walletrequests`,
        method: "post",
        data: commission,
        headers: getHeader(),

    });
};

export const updateCommission = (commission_id: string, commission: ICommissionData) => {
    return request({
        url: `walletrequests/${commission.id}`,
        method: "patch",
        data: commission,
        headers: getHeader(),

    });
};

export const deleteCommission = (commission_id: string) => {
    return request({
        url: `walletrequests/${commission_id}`,
        method: "delete",
        headers: getHeader(),

    });
};
