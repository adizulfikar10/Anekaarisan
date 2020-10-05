import { IResult, IErrorState, ISuccessState } from "./app.interface";

export interface INoticeState {
    notices: IResult;
    noticeData: INoticeData;
    noticeUnreadMessage: number;
    loadingFetchNotices: boolean;
    eventErrorNotice: IErrorState;
    eventSuccessNotice: ISuccessState;
}
export interface INoticeData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    message: string;
    user_id: string;
    is_read: boolean;
}
