import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IPromoState {
    promos: IResult;
    promoData: IPromoData;
    loadingFetchPromos: boolean;
    loadingCreatePromo: boolean;
    loadingUpdatePromo: boolean;
    loadingDeletePromo: boolean;
    eventErrorPromo: IErrorState;
    eventSuccessPromo: ISuccessState;
}
export interface IPromoData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    status: string;
    banner_status: string;
    date_start: string;
    date_end: string;
    promo_percent: number;
    image_ids: [];
}

