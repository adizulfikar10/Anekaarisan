import request from "../utils/request";
import { IPaymentData } from "../interface/payment.interface";
import { generateQuery } from "../utils/queryGenerator";
import { getHeader } from '../utils/config';

export const fetchPayments = (params?: any) => {
    return request({
        url: `payments?` + generateQuery(params),
        method: "get",
        headers: getHeader(),
    });
};

export const fetchOnePayment = (payment_id?: string) => {
    return request({
        url: `payments/${payment_id}`,
        method: "get",
        headers: getHeader(),
    });
};

export const createPayment = (payment: IPaymentData) => {
    return request({
        url: `payments`,
        method: "post",
        data: payment,
        headers: getHeader(),
    });
};

export const updatePayment = (payment_id: string, payment: IPaymentData) => {
    return request({
        url: `payments/${payment.id}`,
        method: "patch",
        data: payment,
        headers: getHeader(),
    });
};

export const deletePayment = (payment_id: string) => {
    return request({
        url: `payments/${payment_id}`,
        method: "delete",
        headers: getHeader(),
    });
};
