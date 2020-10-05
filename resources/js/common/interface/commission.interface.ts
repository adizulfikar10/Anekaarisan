import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface ICommissionState {
    commissions: IResult;
    commissionData: ICommissionData;
    loadingFetchCommissions: boolean;
    loadingCreateCommission: boolean;
    loadingUpdateCommission: boolean;
    loadingDeleteCommission: boolean;
    eventErrorCommission: IErrorState;
    eventSuccessCommission: ISuccessState;
}
export interface ICommissionData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id: string;
    amount: number;
    status: string;
    category: string;
    bank_account: string;
    notes: string;
    meta_transaction: {};
}
