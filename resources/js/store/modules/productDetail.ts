import {
    IProductDetailState,
    IProductDetailData
} from "../../common/interface/productDetail.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchProductDetails,
    createProductDetail,
    updateProductDetail,
    deleteProductDetail,
    fetchOneProductDetail,
    bulkProductDetail,
    updateBulkProductDetail
} from "../../common/api/productDetail";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initProductDetailData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ProductDetailModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class ProductDetail extends VuexModule implements IProductDetailState {
    productDetails: any = { ...initResult };
    productDetailData: any = { ...initProductDetailData };
    loadingFetchProductDetails: boolean = false;
    loadingCreateProductDetail: boolean = false;
    loadingUpdateProductDetail: boolean = false;
    loadingDeleteProductDetail: boolean = false;
    eventErrorProductDetail: any = {};
    eventSuccessProductDetail: any = {};

    /* #region Action */
    @Action
    async fetchProductDetails(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PRODUCT_DETAIL(true);
            const res: any = await fetchProductDetails(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAILS(res);
            } else {
                this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAILS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
            this.SET_PRODUCT_DETAILS(initResult);
            this.SET_ERROR_PRODUCT_DETAIL({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneProductDetail(params: string) {
        try {
            this.SET_LOADING_FETCH_PRODUCT_DETAIL(true);
            const res: any = await fetchOneProductDetail(params);
            if (res) {
                this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAIL_DATA(res);
            } else {
                this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAIL_DATA(initProductDetailData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PRODUCT_DETAIL(false);
            this.SET_PRODUCT_DETAIL_DATA(initProductDetailData);
            this.SET_ERROR_PRODUCT_DETAIL({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createProductDetail(payload: IProductDetailData) {
        try {
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(true);
            const res: any = await createProductDetail(payload);
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(false);
            this.SET_PRODUCT_DETAIL_DATA(res.data);
            this.SET_SUCCESS_PRODUCT_DETAIL({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk Detail", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(false);
            this.SET_ERROR_PRODUCT_DETAIL({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async bulkProductDetail(payload: any) {
        try {
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(true);
            const res: any = await bulkProductDetail(payload);
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(false);
            this.SET_PRODUCT_DETAIL_DATA(res.data);
            this.SET_SUCCESS_PRODUCT_DETAIL({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk Detail", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_PRODUCT_DETAIL(false);
            this.SET_ERROR_PRODUCT_DETAIL({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateProductDetail(data: any) {
        try {
            this.SET_LOADING_UPDATE_PRODUCT_DETAIL(true);
            const res: any = await updateProductDetail(data.id, data);
            this.SET_LOADING_UPDATE_PRODUCT_DETAIL(false);
            this.SET_PRODUCT_DETAIL_DATA(res.data);
            this.SET_SUCCESS_PRODUCT_DETAIL({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk Detail", "UPDATED")
            });
        } catch (error) {
            this.SET_LOADING_UPDATE_PRODUCT_DETAIL(false);
            this.SET_ERROR_PRODUCT_DETAIL({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async updateBulkProductDetail(data: any) {
        try {
            this.SET_LOADING_UPDATE_PRODUCT_DETAIL(true);
            const product_id = data.product_id;

            const res = await updateBulkProductDetail(product_id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAIL_DATA(res.data);
                this.SET_SUCCESS_PRODUCT_DETAIL({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Produk Detail", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_PRODUCT_DETAIL(false);
                this.SET_PRODUCT_DETAIL_DATA(initProductDetailData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_PRODUCT_DETAIL(false);
            this.SET_ERROR_PRODUCT_DETAIL({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteProductDetail(event_id: string) {
        try {
            this.SET_LOADING_DELETE_PRODUCT_DETAIL(true);

            const res = await deleteProductDetail(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_PRODUCT_DETAIL(false);
                this.SET_SUCCESS_PRODUCT_DETAIL({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Produk Detail", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_PRODUCT_DETAIL(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_PRODUCT_DETAIL(false);
            this.SET_ERROR_PRODUCT_DETAIL({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_PRODUCT_DETAIL(payload: boolean) {
        this.loadingFetchProductDetails = payload;
    }

    @Mutation
    SET_LOADING_CREATE_PRODUCT_DETAIL(payload: boolean) {
        this.loadingCreateProductDetail = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_PRODUCT_DETAIL(payload: boolean) {
        this.loadingUpdateProductDetail = payload;
    }

    @Mutation
    SET_LOADING_DELETE_PRODUCT_DETAIL(payload: boolean) {
        this.loadingDeleteProductDetail = payload;
    }

    @Mutation
    SET_PRODUCT_DETAILS(payload: IResult) {
        this.productDetails = { ...payload };
    }

    @Mutation
    SET_PRODUCT_DETAIL_DATA(payload: IProductDetailData) {
        this.productDetailData = { ...payload };
    }

    @Mutation
    SET_ERROR_PRODUCT_DETAIL(payload: any) {
        this.eventErrorProductDetail = payload;
    }

    @Mutation
    SET_SUCCESS_PRODUCT_DETAIL(payload: any) {
        this.eventSuccessProductDetail = payload;
    }

    @Mutation
    CLEAN_ACTION_PRODUCT_DETAIL() {
        this.eventErrorProductDetail = { ...initSuccessState };
        this.eventSuccessProductDetail = { ...initErrorState };
    }
    /* #endregion */
}

export const ProductDetailModule = getModule(ProductDetail);
