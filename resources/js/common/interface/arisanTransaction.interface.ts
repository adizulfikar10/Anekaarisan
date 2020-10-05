import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IArisanTransactionState {
  arisanTransactions: IResult;
  arisanTransactionData: IArisanTransactionData;
  loadingFetchArisanTransactions: boolean;
  loadingCreateArisanTransaction: boolean;
  loadingUpdateArisanTransaction: boolean;
  loadingDeleteArisanTransaction: boolean;
  eventErrorArisanTransaction: IErrorState;
  eventSuccessArisanTransaction: ISuccessState;
}
export interface IArisanTransactionData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  arisan_id: string;
  payment_id: string;
  payment_amount: string;
  shipping_number: string;
  courier: string;
  meta_arisan: {};
  meta_product: {};
  status: string;
}
