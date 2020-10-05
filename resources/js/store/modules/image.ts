import {
    IImageState,
    IImageData
} from "../../common/interface/image.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchImages,
    createImage,
    updateImage,
    deleteImage,
    uploadImage
} from "../../common/api/image";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initImageData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ImageModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Image extends VuexModule implements IImageState {
    images: any = { ...initResult };
    imageData: any = { ...initImageData };
    loadingFetchImages: boolean = false;
    loadingCreateImage: boolean = false;
    loadingUpdateImage: boolean = false;
    loadingDeleteImage: boolean = false;
    eventErrorImage: any = {};
    eventSuccessImage: any = {};

    /* #region Action */
    @Action
    async fetchImages(params: IParams) {
        try {
            this.SET_LOADING_FETCH_IMAGE(true);
            const res: any = await fetchImages(params);
            if (res) {
                this.SET_IMAGES(res);
                this.SET_LOADING_FETCH_IMAGE(false);
            } else {
                this.SET_IMAGES(initResult);
                this.SET_LOADING_FETCH_IMAGE(false);
            }
        } catch (error) {
            this.SET_IMAGES(initResult);
            this.SET_ERROR_IMAGE({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_IMAGE(false);
        }
    }

    async fetchOneImage(params: IParams) {
        try {
            this.SET_LOADING_FETCH_IMAGE(true);
            const res: any = await fetchImages(params);
            if (res && res.data) {
                this.SET_IMAGE_DATA(res.data);
                this.SET_LOADING_FETCH_IMAGE(false);
            } else {
                this.SET_IMAGE_DATA(initImageData);
                this.SET_LOADING_FETCH_IMAGE(false);
            }
        } catch (error) {
            this.SET_IMAGE_DATA(initImageData);
            this.SET_ERROR_IMAGE({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_IMAGE(false);
        }
    }

    @Action
    async createImage(payload: IImageData) {
        try {
            this.SET_LOADING_CREATE_IMAGE(true);
            const res: any = await createImage(payload);
            this.SET_IMAGE_DATA(res.data);
            this.SET_SUCCESS_IMAGE({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Gambar", "CREATED")
            });
            this.SET_LOADING_CREATE_IMAGE(false);
        } catch (error) {
            this.SET_ERROR_IMAGE({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_IMAGE(false);
        }
    }

    @Action
    async uploadImage(formData: FormData) {
        try {
            this.SET_LOADING_CREATE_IMAGE(true);
            const res: any = await uploadImage(formData);
            if (res) {
                this.SET_IMAGE_DATA(res);
                this.SET_SUCCESS_IMAGE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "Gambar berhasil diunggah"
                });
                this.SET_LOADING_CREATE_IMAGE(false);
            } else {
                this.SET_LOADING_CREATE_IMAGE(false);
            }
        } catch (error) {
            this.SET_ERROR_IMAGE({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_IMAGE(false);
        }
    }

    @Action
    async updateImage(data: any) {
        try {
            this.SET_LOADING_UPDATE_IMAGE(true);
            const res = await updateImage(data.id, data);
            if (res && res.data) {
                this.SET_IMAGE_DATA(res.data);
                this.SET_SUCCESS_IMAGE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Gambar", "UPDATED")
                });
                this.SET_LOADING_UPDATE_IMAGE(false);
            } else {
                this.SET_IMAGE_DATA(initImageData);
                this.SET_LOADING_UPDATE_IMAGE(false);
            }
        } catch (error) {
            this.SET_ERROR_IMAGE({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_IMAGE(false);
        }
    }

    @Action
    async deleteImage(event_id: string) {
        try {
            this.SET_LOADING_DELETE_IMAGE(true);

            const res = await deleteImage(event_id);

            if (res && res.status === 200) {
                this.SET_SUCCESS_IMAGE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Gambar", "DELETED")
                });
                this.SET_LOADING_DELETE_IMAGE(false);
            } else {
                this.SET_LOADING_DELETE_IMAGE(false);
            }
        } catch (error) {
            this.SET_ERROR_IMAGE({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_IMAGE(false);
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_IMAGE(payload: boolean) {
        this.loadingFetchImages = payload;
    }

    @Mutation
    SET_LOADING_CREATE_IMAGE(payload: boolean) {
        this.loadingCreateImage = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_IMAGE(payload: boolean) {
        this.loadingUpdateImage = payload;
    }

    @Mutation
    SET_LOADING_DELETE_IMAGE(payload: boolean) {
        this.loadingDeleteImage = payload;
    }

    @Mutation
    SET_IMAGES(payload: IResult) {
        this.images = { data: payload };
    }

    @Mutation
    SET_IMAGE_DATA(payload: IImageData) {
        this.imageData = { ...payload };
    }

    @Mutation
    SET_ERROR_IMAGE(payload: any) {
        this.eventErrorImage = payload;
    }

    @Mutation
    SET_SUCCESS_IMAGE(payload: any) {
        this.eventSuccessImage = payload;
    }

    @Mutation
    CLEAN_ACTION_IMAGE() {
        this.eventErrorImage = { ...initSuccessState };
        this.eventSuccessImage = { ...initErrorState };
    }
    /* #endregion */
}

export const ImageModule = getModule(Image);
