import request from "../utils/request";
import { IRoleData } from "../interface/role.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchRoles = (params?: any) => {
    return request({
        url: `roles?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneRole = (role_id?: string) => {
    return request({
        url: `roles/${role_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createRole = (role: IRoleData) => {
    return request({
        url: `roles`,
        method: "post",
        data: role,
        headers: getHeader(),
    });
};

export const updateRole = (role_id: string, role: IRoleData) => {
    return request({
        url: `roles/${role.id}`,
        method: "patch",
        data: role,
        headers: getHeader(),
    });
};

export const deleteRole = (role_id: string) => {
    return request({
        url: `roles/${role_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
