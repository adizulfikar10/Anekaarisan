import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IWithdrawState {
  withdraws: IResult;
  withdrawData: IWithdrawData;
  loadingFetchWithdraws: boolean;
  loadingCreateWithdraw: boolean;
  loadingUpdateWithdraw: boolean;
  loadingDeleteWithdraw: boolean;
  eventErrorWithdraw: IErrorState;
  eventSuccessWithdraw: ISuccessState;
}
export interface IWithdrawData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  amount: number;
  date: Date | null;
  status: string;
}
