import { IResult, IErrorState, ISuccessState } from './app.interface';

export interface IImageState {
    images: IResult;
    imageData: IImageData;
    loadingFetchImages: boolean;
    loadingCreateImage: boolean;
    loadingUpdateImage: boolean;
    loadingDeleteImage: boolean;
    eventErrorImage: IErrorState;
    eventSuccessImage: ISuccessState;
}
export interface IImageData {
    id?: string;
    created_at?: string;
    updated_at?: string;
    name: string;
    ext: string;
    size: number;
    path: string;
    uploaded_by: string;
    file?:File;
}