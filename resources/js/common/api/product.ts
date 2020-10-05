import request from "../utils/request";
import { IProductData } from "../interface/product.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchProducts = (params?: any) => {
    return request({
        url: `products?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneProduct = (product_id?: string) => {
    return request({
        url: `products/${product_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createProduct = (product: IProductData) => {
    return request({
        url: `products`,
        method: "post",
        data: product,
        headers: getHeader(),
    });
};

export const updateProduct = (product_id: string, product: IProductData) => {
    return request({
        url: `products/${product.id}`,
        method: "patch",
        data: product,
        headers: getHeader(),
    });
};

export const deleteProduct = (product_id: string) => {
    return request({
        url: `products/${product_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
