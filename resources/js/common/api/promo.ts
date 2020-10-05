import request from "../utils/request";
import { IPromoData } from "../interface/promo.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchPromos = (params?: any) => {
    return request({
        url: `promos?` + generateQuery(params),
        method: "get",
        headers: getHeader(),

    });
};

export const fetchOnePromo = (promo_id?: string) => {
    return request({
        url: `promos/${promo_id}`,
        method: "get",
        headers: getHeader(),

    });
};

export const createPromo = (promo: IPromoData) => {
    return request({
        url: `promos`,
        method: "post",
        data: promo,
        headers: getHeader(),

    });
};

export const updatePromo = (promo_id: string, promo: IPromoData) => {
    return request({
        url: `promos/${promo.id}`,
        method: "patch",
        data: promo,
        headers: getHeader(),

    });
};

export const deletePromo = (promo_id: string) => {
    return request({
        url: `promos/${promo_id}`,
        method: "delete",
        headers: getHeader(),

    });
};
