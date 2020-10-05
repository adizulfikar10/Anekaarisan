import request from "../utils/request";
import { IUserData } from "../interface/user.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from "../utils/config";

export const fetchUsers = (params?: any) => {
    return request({
        url: `users?` + generateQuery(params),
        method: "get",
        headers: getHeader()
    });
};

export const fetchOneUser = (user_id?: string) => {
    return request({
        url: `users/${user_id}`,
        method: "get",
        headers: getHeader()
    });
};

export const createUser = (user: IUserData) => {
    return request({
        url: `users`,
        method: "post",
        data: user,
        headers: getHeader()
    });
};

export const registerUser = (user: IUserData) => {
    return request({
        url: `register`,
        method: "post",
        data: user,
        headers: getHeader()
    });
};

export const updateUser = (user_id: string, user: IUserData) => {
    return request({
        url: `users/${user.id}`,
        method: "patch",
        data: user,
        headers: getHeader()
    });
};

export const deleteUser = (user_id: string) => {
    return request({
        url: `users/${user_id}`,
        method: "delete",
        headers: getHeader()
    });
};

export const resetPassword = (user_id: string, data: any) => {
    return request({
        url: `users/${user_id}/reset-password`,
        method: "patch",
        data: data,
        headers: getHeader()
    });
};

export const changePassword = (user_id: string, data: any) => {
    return request({
        url: `users/${user_id}/change-password`,
        method: "patch",
        data: data,
        headers: getHeader()
    });
};
