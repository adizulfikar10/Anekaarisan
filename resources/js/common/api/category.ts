import request from "../utils/request";
import { ICategoryData } from "../interface/category.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchCategories = (params?: any) => {
    return request({
        url: `categories?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneCategory = (category_id?: string) => {
    return request({
        url: `categories/${category_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createCategory = (arisan: ICategoryData) => {
    return request({
        url: `categories`,
        method: "post",
        data: arisan,
        headers: getHeader()
    });
};

export const updateCategory = (category_id: string, arisan: ICategoryData) => {
    return request({
        url: `categories/${arisan.id}`,
        method: "patch",
        data: arisan,
        headers: getHeader()
    });
};

export const deleteCategory = (category_id: string) => {
    return request({
        url: `categories/${category_id}`,
        method: "delete",
        headers: getHeader()
    });
};
