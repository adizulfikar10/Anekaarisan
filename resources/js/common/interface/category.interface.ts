import { IResult, IErrorState, ISuccessState } from "./app.interface";

export interface ICategoryState {
    categories: IResult;
    categoryData: ICategoryData;
    loadingFetchCategory: boolean;
    loadingCreateCategory: boolean;
    loadingUpdateCategory: boolean;
    loadingDeleteCategory: boolean;
    eventErrorCategory: IErrorState;
    eventSuccessCategory: ISuccessState;
}
export interface ICategoryData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    parent_id?: string;
}
