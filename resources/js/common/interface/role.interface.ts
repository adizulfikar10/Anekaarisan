import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IRoleState {
  roles: IResult;
  roleData: IRoleData;
  loadingFetchRoles: boolean;
  loadingCreateRole: boolean;
  loadingUpdateRole: boolean;
  loadingDeleteRole: boolean;
  eventErrorRole: IErrorState;
  eventSuccessRole: ISuccessState;
}
export interface IRoleData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  role: string;
}
