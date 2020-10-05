import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IProductDetailState {
    productDetails: IResult;
    productDetailData: IProductDetailData;
    loadingFetchProductDetails: boolean;
    loadingCreateProductDetail: boolean;
    loadingUpdateProductDetail: boolean;
    loadingDeleteProductDetail: boolean;
    eventErrorProductDetail: IErrorState;
    eventSuccessProductDetail: ISuccessState;
}
export interface IProductDetailData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    product_id: string;
    price: number;
    periode: number;
}
