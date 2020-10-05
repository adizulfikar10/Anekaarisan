import { IResult, IErrorState, ISuccessState } from "./app.interface";

export interface ISaldoState {
    saldos: IResult;
    saldo: ISaldoData;
    loadingFetchSaldos: boolean;
    eventErrorSaldo: IErrorState;
    eventSuccessSaldo: ISuccessState;
}
export interface ISaldoData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    user_id: string;
    saldo: number;
}
