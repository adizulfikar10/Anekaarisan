import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IUserRoleState {
  userRoles: IResult;
  userRoleData: IUserRoleData;
  loadingFetchUserRoles: boolean;
  loadingCreateUserRole: boolean;
  loadingUpdateUserRole: boolean;
  loadingDeleteUserRole: boolean;
  eventErrorUserRole: IErrorState;
  eventSuccessUserRole: ISuccessState;
}
export interface IUserRoleData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  role_id: string;
}
