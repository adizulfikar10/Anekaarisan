import request from "../utils/request";
import { IProductDetailData } from "../interface/productDetail.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchProductDetails = (params?: any) => {
    return request({
        url: `productdetails?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneProductDetail = (productDetail_id?: string) => {
    return request({
        url: `productdetails/${productDetail_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createProductDetail = (productDetail: any) => {
    return request({
        url: `productdetails`,
        method: "post",
        data: productDetail,
        headers: getHeader()
    });
};

export const bulkProductDetail = (productDetail: IProductDetailData) => {
    return request({
        url: `productdetails/bulk`,
        method: "post",
        data: productDetail,
        headers: getHeader()
    });
};
export const updateBulkProductDetail = (
    product_id: string,
    productDetail: any
) => {
    return request({
        url: `productdetails/${product_id}/bulk`,
        method: "patch",
        data: productDetail,
        headers: getHeader()
    });
};

export const updateProductDetail = (
    productDetail_id: string,
    productDetail: IProductDetailData
) => {
    return request({
        url: `productdetails/${productDetail.id}`,
        method: "patch",
        data: productDetail,
        headers: getHeader()
    });
};

export const deleteProductDetail = (productDetail_id: string) => {
    return request({
        url: `productdetails/${productDetail_id}`,
        method: "delete",
        headers: getHeader()
    });
};
