import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IProductPromoState {
    productPromos: IResult;
    productPromoData: IProductPromoData;
    loadingFetchProductPromos: boolean;
    loadingCreateProductPromo: boolean;
    loadingUpdateProductPromo: boolean;
    loadingDeleteProductPromo: boolean;
    eventErrorProductPromo: IErrorState;
    eventSuccessProductPromo: ISuccessState;
}
export interface IProductPromoData {
    id: string;
    created_at?: string;
    updated_at?: string;
    product_id: string;
    promo_id: string;
}
