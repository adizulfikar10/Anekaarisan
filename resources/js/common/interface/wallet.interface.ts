import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IWalletState {
  wallets: IResult;
  walletData: IWalletData;
  loadingFetchWallets: boolean;
  loadingCreateWallet: boolean;
  loadingUpdateWallet: boolean;
  loadingDeleteWallet: boolean;
  eventErrorWallet: IErrorState;
  eventSuccessWallet: ISuccessState;
}
export interface IWalletData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  amount: number;
  status: string
}
