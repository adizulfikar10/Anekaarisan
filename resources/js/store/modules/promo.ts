import {
    IPromoState,
    IPromoData
} from "../../common/interface/promo.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchPromos,
    createPromo,
    updatePromo,
    deletePromo,
    fetchOnePromo
} from "../../common/api/promo";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initPromoData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "PromoModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Promo extends VuexModule implements IPromoState {
    promos: any = { ...initResult };
    promoData: any = { ...initPromoData };
    loadingFetchPromos: boolean = false;
    loadingCreatePromo: boolean = false;
    loadingUpdatePromo: boolean = false;
    loadingDeletePromo: boolean = false;
    eventErrorPromo: any = {};
    eventSuccessPromo: any = {};

    /* #region Action */
    @Action
    async fetchPromos(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PROMO(true);
            const res: any = await fetchPromos(params);
            if (res && res.data) {
                this.SET_PROMOS(res);
                this.SET_LOADING_FETCH_PROMO(false);
            } else {
                this.SET_PROMOS(initResult);
                this.SET_LOADING_FETCH_PROMO(false);
            }
        } catch (error) {
            this.SET_PROMOS(initResult);
            this.SET_ERROR_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_PROMO(false);
        }
    }

    @Action
    async fetchOnePromo(params: string) {
        try {
            this.SET_LOADING_FETCH_PROMO(true);
            const res: any = await fetchOnePromo(params);
            if (res && res.data) {
                this.SET_PROMO_DATA(res.data);
                this.SET_LOADING_FETCH_PROMO(false);
            } else {
                this.SET_PROMO_DATA(initPromoData);
                this.SET_LOADING_FETCH_PROMO(false);
            }
        } catch (error) {
            console.log(error);
            this.SET_PROMO_DATA(initPromoData);
            this.SET_ERROR_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_PROMO(false);
        }
    }

    @Action
    async createPromo(payload: IPromoData) {
        try {
            this.SET_LOADING_CREATE_PROMO(true);
            const res: any = await createPromo(payload);
            if (res && res.data) {
                this.SET_PROMO_DATA(res.data);
                this.SET_SUCCESS_PROMO({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("PROMO", "CREATED")
                });
                this.SET_LOADING_CREATE_PROMO(false);
            } else {
                this.SET_LOADING_CREATE_PROMO(false);
            }
        } catch (error) {
            this.SET_ERROR_PROMO({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_PROMO(false);
        }
    }

    @Action
    async updatePromo(data: any) {
        try {
            this.SET_LOADING_UPDATE_PROMO(true);
            const res = await updatePromo(data.id, data);
            if (res && res.data) {
                this.SET_PROMO_DATA(res.data);
                this.SET_SUCCESS_PROMO({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("PROMO", "UPDATED")
                });
                this.SET_LOADING_UPDATE_PROMO(false);
            } else {
                this.SET_PROMO_DATA(initPromoData);
                this.SET_LOADING_UPDATE_PROMO(false);
            }
        } catch (error) {
            this.SET_ERROR_PROMO({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_PROMO(false);
        }
    }

    @Action
    async deletePromo(event_id: string) {
        try {
            this.SET_LOADING_DELETE_PROMO(true);

            const res = await deletePromo(event_id);

            if (res && res.status === 200) {
                this.SET_SUCCESS_PROMO({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("PROMO", "DELETED")
                });
                this.SET_LOADING_DELETE_PROMO(false);
            } else {
                this.SET_LOADING_DELETE_PROMO(false);
            }
        } catch (error) {
            this.SET_ERROR_PROMO({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_PROMO(false);
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_PROMO(payload: boolean) {
        this.loadingFetchPromos = payload;
    }

    @Mutation
    SET_LOADING_CREATE_PROMO(payload: boolean) {
        this.loadingCreatePromo = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_PROMO(payload: boolean) {
        this.loadingUpdatePromo = payload;
    }

    @Mutation
    SET_LOADING_DELETE_PROMO(payload: boolean) {
        this.loadingDeletePromo = payload;
    }

    @Mutation
    SET_PROMOS(payload: IResult) {
        this.promos = { ...payload };
    }

    @Mutation
    SET_PROMO_DATA(payload: IPromoData) {
        this.promoData = { ...payload };
    }

    @Mutation
    SET_ERROR_PROMO(payload: any) {
        this.eventErrorPromo = payload;
    }

    @Mutation
    SET_SUCCESS_PROMO(payload: any) {
        this.eventSuccessPromo = payload;
    }

    @Mutation
    CLEAN_ACTION_PROMO() {
        this.eventErrorPromo = { ...initSuccessState };
        this.eventSuccessPromo = { ...initErrorState };
    }
    /* #endregion */
}

export const PromoModule = getModule(Promo);
