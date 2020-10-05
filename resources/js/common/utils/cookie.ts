import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

// User
const tokenKey = 'aneka_token';

export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const setLoginDate = (date: Date) => Cookies.set('login-date', date);
export const getLoginDate = () => Cookies.get('login-date');
export const removeLoginDate = () => Cookies.remove('login-date');
export const removeToken = () => Cookies.remove(tokenKey);
export const decodeToken = (token: string) => jwt.decode(token);