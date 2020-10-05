import request from "../utils/request";
import { IProductPromoData } from "../interface/productPromo.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchProductPromos = (params?: any) => {
    return request({
        url: `productpromos?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneProductPromo = (productPromos_id?: string) => {
    return request({
        url: `productpromos/${productPromos_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createProductPromo = (productPromos: IProductPromoData) => {
    return request({
        url: `productpromos`,
        method: "post",
        data: productPromos,
        headers: getHeader()
    });
};

export const updateProductPromo = (
    productPromos_id: string,
    productPromos: IProductPromoData
) => {
    return request({
        url: `productpromos/${productPromos.id}`,
        method: "patch",
        data: productPromos,
        headers: getHeader()
    });
};

export const deleteProductPromo = (productPromos_id: string) => {
    return request({
        url: `productPromos/${productPromos_id}`,
        method: "delete",
        headers: getHeader()
    });
};
