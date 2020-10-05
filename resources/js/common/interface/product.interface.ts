import { IResult, IErrorState, ISuccessState } from "./app.interface";

export interface IProductState {
    products: IResult;
    productData: IProductData;
    loadingFetchProducts: boolean;
    loadingCreateProduct: boolean;
    loadingUpdateProduct: boolean;
    loadingDeleteProduct: boolean;
    eventErrorProduct: IErrorState;
    eventSuccessProduct: ISuccessState;
}
export interface IProductData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    base_price: number;
    commision: number;
    image_ids: [];
    description: string;
}
