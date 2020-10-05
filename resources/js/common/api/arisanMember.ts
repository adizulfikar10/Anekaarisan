import request from "../utils/request";
import { IArisanMemberData } from "../interface/arisanMember.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchArisanMembers = (params?: any) => {
    return request({
        url: `arisanmembers?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneArisanMember = (arisanMember_id?: string) => {
    return request({
        url: `arisanmembers/${arisanMember_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createArisanMember = (arisanMember: IArisanMemberData) => {
    return request({
        url: `arisanmembers`,
        method: "post",
        data: arisanMember,
        headers: getHeader()
    });
};

export const createArisanMemberBulk = (arisanMembers: any) => {
    return request({
        url: `arisanmembers/bulk`,
        method: "post",
        data: arisanMembers,
        headers: getHeader()
    });
};

export const updateArisanMember = (
    arisanMember_id: string,
    arisanMember: IArisanMemberData
) => {
    return request({
        url: `arisanmembers/${arisanMember.id}`,
        method: "patch",
        data: arisanMember,
        headers: getHeader()
    });
};

export const deleteArisanMember = (arisanMember_id: string) => {
    return request({
        url: `arisanmembers/${arisanMember_id}`,
        method: "delete",
        headers: getHeader()
    });
};
