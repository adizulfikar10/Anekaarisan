import request from '../utils/request';
import { getHeader } from '../utils/config';

export const login = (data: any) => {
  return request({
    url: `login`,
    method: 'post',
    data,
    headers: {
      contentType: 'application/json',
    },
  });
};



export const logout = () =>
  request({
    url: '/logout',
    method: 'post',
    headers: getHeader(),
  });

export const me = () =>
  request({
    url: '/me',
    method: 'get',
    headers: getHeader(),
  });

export const refresh = () =>
  request({
    url: '/refresh',
    method: 'get',
    headers: getHeader(),
  });

