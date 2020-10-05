import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IUserState {
  users: IResult;
  userData: IUserData;
  loadingFetchUsers: boolean;
  loadingCreateUser: boolean;
  loadingUpdateUser: boolean;
  loadingDeleteUser: boolean;
  eventErrorUser: IErrorState;
  eventSuccessUser: ISuccessState;
}
export interface IUserData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  phone_number: string;
  email: string;
  password: string;
  province: string;
  district: string;
  village: string;
  street: string;
  region: string;
  status: boolean;
  referral_code: string;
  agent_code: string;
}
