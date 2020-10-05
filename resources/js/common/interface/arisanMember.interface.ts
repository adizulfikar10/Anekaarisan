import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IArisanMemberState {
  arisanMembers: IResult;
  arisanMemberData: IArisanMemberData;
  loadingFetchArisanMembers: boolean;
  loadingCreateArisanMember: boolean;
  loadingUpdateArisanMember: boolean;
  loadingDeleteArisanMember: boolean;
  eventErrorArisanMember: IErrorState;
  eventSuccessArisanMember: ISuccessState;
}
export interface IArisanMemberData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  product_id: string;
  arisan_id: string;
  status: string
  meta_product: {}
}
