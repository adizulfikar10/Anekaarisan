import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IPaymentState {
  payments: IResult;
  paymentData: IPaymentData;
  loadingFetchPayments: boolean;
  loadingCreatePayment: boolean;
  loadingUpdatePayment: boolean;
  loadingDeletePayment: boolean;
  eventErrorPayment: IErrorState;
  eventSuccessPayment: ISuccessState;
}
export interface IPaymentData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  meta: string;
}
