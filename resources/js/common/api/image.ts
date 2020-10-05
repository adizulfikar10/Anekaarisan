import request from "../utils/request";
import { IImageData } from "../interface/image.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader, getImageHeader } from '../utils/config';

export const fetchImages = (params?: any) => {
    return request({
        url: `masterimages?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneImage = (payment_id?: string) => {
    return request({
        url: `masterimages/${payment_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createImage = (payment: IImageData) => {
    return request({
        url: `masterimages`,
        method: "post",
        data: payment,
        headers: getHeader(),
    });
};

export const uploadImage = (payment: FormData) => {
    return request({
        url: `masterimages`,
        method: "post",
        data:payment,
        headers: getImageHeader(),
    });
};

export const updateImage = (payment_id: string, payment: IImageData) => {
    return request({
        url: `masterimages/${payment.id}`,
        method: "patch",
        data: payment,
        headers: getHeader(),
    });
};

export const deleteImage = (payment_id: string) => {
    return request({
        url: `masterimages/${payment_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
