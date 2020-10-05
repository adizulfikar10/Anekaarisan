import request from "../utils/request";
import { IArisanData } from "../interface/arisan.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchArisans = (params?: any) => {
    return request({
        url: `arisans?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneArisan = (arisan_id?: string) => {
    return request({
        url: `arisans/${arisan_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createArisan = (arisan: IArisanData) => {
    return request({
        url: `arisans`,
        method: "post",
        data: arisan,
        headers: getHeader()
    });
};

export const updateArisan = (arisan_id: string, arisan: IArisanData) => {
    return request({
        url: `arisans/${arisan.id}`,
        method: "patch",
        data: arisan,
        headers: getHeader()
    });
};

export const deleteArisan = (arisan_id: string) => {
    return request({
        url: `arisans/${arisan_id}`,
        method: "delete",
        headers: getHeader()
    });
};

export const fetchArisanReminders = (params?: any) => {
    return request({
        url: `arisans-reminder?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};
