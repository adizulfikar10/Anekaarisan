import request from "../utils/request";
import { IArisanTransactionData } from "../interface/arisanTransaction.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchArisanTransactions = (params?: any) => {
    return request({
        url: `arisantransactions?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneArisanTransaction = (arisan_id?: string) => {
    return request({
        url: `arisantransactions/${arisan_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createArisanTransaction = (arisan: IArisanTransactionData) => {
    return request({
        url: `arisantransactions`,
        method: "post",
        data: arisan,
        headers: getHeader(),
    });
};

export const updateArisanTransaction = (arisan_id: string, arisan: IArisanTransactionData) => {
    return request({
        url: `arisantransactions/${arisan.id}`,
        method: "patch",
        data: arisan,
        headers: getHeader(),
    });
};

export const deleteArisanTransaction = (arisan_id: string) => {
    return request({
        url: `arisantransactions/${arisan_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
