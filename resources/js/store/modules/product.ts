import {
    IProductState,
    IProductData
} from "../../common/interface/product.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchOneProduct
} from "../../common/api/product";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initProductData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ProductModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Product extends VuexModule implements IProductState {
    products: any = { ...initResult };
    productData: any = { ...initProductData };
    loadingFetchProducts: boolean = false;
    loadingCreateProduct: boolean = false;
    loadingUpdateProduct: boolean = false;
    loadingDeleteProduct: boolean = false;
    eventErrorProduct: any = {};
    eventSuccessProduct: any = {};

    /* #region Action */
    @Action
    async fetchProducts(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PRODUCT(true);
            const res: any = await fetchProducts(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_PRODUCT(false);

                let listNewProducts = res;
                let listOldProducts = this.products;

                if (params.loadMore && params.page != 1) {
                    let lop = listOldProducts.data;
                    let lnp = listNewProducts.data;
                    Array.prototype.push.apply(lop, lnp);
                    listOldProducts = {
                        ...listNewProducts,
                        data: lop
                    };
                } else {
                    listOldProducts = listNewProducts;
                }

                this.SET_PRODUCTS(listOldProducts);
            } else {
                this.SET_LOADING_FETCH_PRODUCT(false);
                this.SET_PRODUCTS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PRODUCT(false);
            this.SET_PRODUCTS(initResult);
            this.SET_ERROR_PRODUCT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneProduct(params: string) {
        try {
            this.SET_LOADING_FETCH_PRODUCT(true);
            const res: any = await fetchOneProduct(params);
            if (res) {
                this.SET_LOADING_FETCH_PRODUCT(false);
                this.SET_PRODUCT_DATA(res);
            } else {
                this.SET_LOADING_FETCH_PRODUCT(false);
                this.SET_PRODUCT_DATA(initProductData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PRODUCT(false);
            this.SET_PRODUCT_DATA(initProductData);
            this.SET_ERROR_PRODUCT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async selectOneProduct(id: string) {
        try {
            this.SET_LOADING_FETCH_PRODUCT(true);
            const data: any = this.products.data.find(
                (el: any) => el.id === id
            );
            if (data) {
                this.SET_LOADING_FETCH_PRODUCT(false);
                this.SET_PRODUCT_DATA(data);
            } else {
                this.SET_LOADING_FETCH_PRODUCT(false);
                this.SET_PRODUCT_DATA(initProductData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PRODUCT(false);
            this.SET_PRODUCT_DATA(initProductData);
            this.SET_ERROR_PRODUCT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createProduct(payload: IProductData) {
        try {
            this.SET_LOADING_CREATE_PRODUCT(true);
            const res: any = await createProduct(payload);
            this.SET_LOADING_CREATE_PRODUCT(false);
            this.SET_PRODUCT_DATA(res);
            this.SET_SUCCESS_PRODUCT({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_PRODUCT(false);
            this.SET_ERROR_PRODUCT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateProduct(data: any) {
        try {
            this.SET_LOADING_UPDATE_PRODUCT(true);
            const res: any = await updateProduct(data.id, data);
            this.SET_LOADING_UPDATE_PRODUCT(false);
            this.SET_PRODUCT_DATA(res);
            this.SET_SUCCESS_PRODUCT({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk", "UPDATED")
            });
        } catch (error) {
            this.SET_LOADING_UPDATE_PRODUCT(false);
            this.SET_ERROR_PRODUCT({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteProduct(event_id: string) {
        try {
            this.SET_LOADING_DELETE_PRODUCT(true);

            const res = await deleteProduct(event_id);

            this.SET_LOADING_DELETE_PRODUCT(false);
            this.SET_SUCCESS_PRODUCT({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Produk", "DELETED")
            });
        } catch (error) {
            this.SET_LOADING_DELETE_PRODUCT(false);
            this.SET_ERROR_PRODUCT({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_PRODUCT(payload: boolean) {
        this.loadingFetchProducts = payload;
    }

    @Mutation
    SET_LOADING_CREATE_PRODUCT(payload: boolean) {
        this.loadingCreateProduct = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_PRODUCT(payload: boolean) {
        this.loadingUpdateProduct = payload;
    }

    @Mutation
    SET_LOADING_DELETE_PRODUCT(payload: boolean) {
        this.loadingDeleteProduct = payload;
    }

    @Mutation
    SET_PRODUCTS(payload: IResult) {
        this.products = { ...payload };
    }

    @Mutation
    SET_PRODUCT_DATA(payload: IProductData) {
        this.productData = { ...payload };
    }

    @Mutation
    SET_ERROR_PRODUCT(payload: any) {
        this.eventErrorProduct = payload;
    }

    @Mutation
    SET_SUCCESS_PRODUCT(payload: any) {
        this.eventSuccessProduct = payload;
    }

    @Mutation
    CLEAN_ACTION_PRODUCT() {
        this.eventErrorProduct = { ...initSuccessState };
        this.eventSuccessProduct = { ...initErrorState };
    }
    /* #endregion */
}

export const ProductModule = getModule(Product);
