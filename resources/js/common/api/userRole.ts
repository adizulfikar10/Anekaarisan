import request from "../utils/request";
import { IUserRoleData } from "../interface/userRole.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchUserRoles = (params?: any) => {
    return request({
        url: `userroles?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOneUserRole = (userrole_id?: string) => {
    return request({
        url: `userroles/${userrole_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createUserRole = (userrole: IUserRoleData) => {
    return request({
        url: `userroles`,
        method: "post",
        data: userrole,
        headers: getHeader(),
    });
};

export const updateUserRole = (userrole_id: string, userrole: IUserRoleData) => {
    return request({
        url: `userroles/${userrole.id}`,
        method: "patch",
        data: userrole,
        headers: getHeader(),
    });
};

export const deleteUserRole = (userrole_id: string) => {
    return request({
        url: `userroles/${userrole_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
