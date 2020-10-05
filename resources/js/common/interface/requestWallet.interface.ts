import { IResult, IErrorState, ISuccessState } from "./app.interface";

export interface IRequestWalletState {
    requestWallets: IResult;
    requestWalletData: IRequestWalletData;
    loadingFetchRequestWallets: boolean;
    loadingCreateRequestWallet: boolean;
    loadingUpdateRequestWallet: boolean;
    loadingDeleteRequestWallet: boolean;
    eventErrorRequestWallet: IErrorState;
    eventSuccessRequestWallet: ISuccessState;
}
export interface IRequestWalletData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id: string;
    amount: number;
    status: string;
    category: string;
    bank_account: string;
    notes: string;
    meta_transaction?: any;
}
