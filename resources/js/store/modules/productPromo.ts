import {
    IProductPromoState,
    IProductPromoData
} from "../../common/interface/productPromo.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchProductPromos,
    createProductPromo,
    updateProductPromo,
    deleteProductPromo
} from "../../common/api/productPromo";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initProductPromoData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ProductPromoModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class ProductPromo extends VuexModule implements IProductPromoState {
    productPromos: any = { ...initResult };
    productPromoData: any = { ...initProductPromoData };
    loadingFetchProductPromos: boolean = false;
    loadingCreateProductPromo: boolean = false;
    loadingUpdateProductPromo: boolean = false;
    loadingDeleteProductPromo: boolean = false;
    eventErrorProductPromo: any = {};
    eventSuccessProductPromo: any = {};

    /* #region Action */
    @Action
    async fetchProductPromos(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PRODUCT_PROMO(true);
            const res: any = await fetchProductPromos(params);
            if (res && res.data) {
                this.SET_PRODUCT_PROMOS(res);
                this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
            } else {
                this.SET_PRODUCT_PROMOS(initResult);
                this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
            }
        } catch (error) {
            this.SET_PRODUCT_PROMOS(initResult);
            this.SET_ERROR_PRODUCT_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
        }
    }

    async fetchOneProductPromo(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PRODUCT_PROMO(true);
            const res: any = await fetchProductPromos(params);
            if (res && res.data) {
                this.SET_PRODUCT_PROMO_DATA(res.data);
                this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
            } else {
                this.SET_PRODUCT_PROMO_DATA(initProductPromoData);
                this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
            }
        } catch (error) {
            this.SET_PRODUCT_PROMO_DATA(initProductPromoData);
            this.SET_ERROR_PRODUCT_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_PRODUCT_PROMO(false);
        }
    }

    @Action
    async createProductPromo(payload: IProductPromoData) {
        try {
            this.SET_LOADING_CREATE_PRODUCT_PROMO(true);
            const res: any = await createProductPromo(payload);
            this.SET_PRODUCT_PROMO_DATA(res.data);
            this.SET_SUCCESS_PRODUCT_PROMO({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk Promo", "CREATED")
            });
            this.SET_LOADING_CREATE_PRODUCT_PROMO(false);
        } catch (error) {
            this.SET_ERROR_PRODUCT_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_PRODUCT_PROMO(false);
        }
    }

    @Action
    async updateProductPromo(data: any) {
        try {
            this.SET_LOADING_UPDATE_PRODUCT_PROMO(true);
            const res = await updateProductPromo(data.id, data);
            if (res && res.data) {
                this.SET_PRODUCT_PROMO_DATA(res.data);
                this.SET_SUCCESS_PRODUCT_PROMO({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Produk Promo", "UPDATED")
                });
                this.SET_LOADING_UPDATE_PRODUCT_PROMO(false);
            } else {
                this.SET_PRODUCT_PROMO_DATA(initProductPromoData);
                this.SET_LOADING_UPDATE_PRODUCT_PROMO(false);
            }
        } catch (error) {
            this.SET_ERROR_PRODUCT_PROMO({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_PRODUCT_PROMO(false);
        }
    }

    @Action
    async deleteProductPromo(event_id: string) {
        try {
            this.SET_LOADING_DELETE_PRODUCT_PROMO(true);

            const res = await deleteProductPromo(event_id);

            if (res && res.status === 200) {
                this.SET_SUCCESS_PRODUCT_PROMO({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Produk Promo", "DELETED")
                });
                this.SET_LOADING_DELETE_PRODUCT_PROMO(false);
            } else {
                this.SET_LOADING_DELETE_PRODUCT_PROMO(false);
            }
        } catch (error) {
            this.SET_ERROR_PRODUCT_PROMO({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_PRODUCT_PROMO(false);
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_PRODUCT_PROMO(payload: boolean) {
        this.loadingFetchProductPromos = payload;
    }

    @Mutation
    SET_LOADING_CREATE_PRODUCT_PROMO(payload: boolean) {
        this.loadingCreateProductPromo = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_PRODUCT_PROMO(payload: boolean) {
        this.loadingUpdateProductPromo = payload;
    }

    @Mutation
    SET_LOADING_DELETE_PRODUCT_PROMO(payload: boolean) {
        this.loadingDeleteProductPromo = payload;
    }

    @Mutation
    SET_PRODUCT_PROMOS(payload: IResult) {
        this.productPromos = { ...payload };
    }

    @Mutation
    SET_PRODUCT_PROMO_DATA(payload: IProductPromoData) {
        this.productPromoData = { ...payload };
    }

    @Mutation
    SET_ERROR_PRODUCT_PROMO(payload: any) {
        this.eventErrorProductPromo = payload;
    }

    @Mutation
    SET_SUCCESS_PRODUCT_PROMO(payload: any) {
        this.eventSuccessProductPromo = payload;
    }

    @Mutation
    CLEAN_ACTION_PRODUCT_PROMO() {
        this.eventErrorProductPromo = { ...initSuccessState };
        this.eventSuccessProductPromo = { ...initErrorState };
    }
    /* #endregion */
}

export const ProductPromoModule = getModule(ProductPromo);
