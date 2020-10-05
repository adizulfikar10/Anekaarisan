import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import { getSnapTokenApi, getStatusOrderMidtransApi } from "../../common/api/midtrans";
import { formatErrorMessage } from "../../common/utils/helper";
import {
    initSuccessState,
    initErrorState
} from "../../common/utils/initialValue";

@Module({
    dynamic: true,
    store,
    name: "ArisanModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Midtrans extends VuexModule {
    snapToken: any = {};
    loading: boolean = false;
    eventErrorMidtrans: any = {};
    eventSuccessMidtrans: any = {};
    statusOrder: any = {};

    @Action
    async getStatusOrderMidtrans(orderId: string) {
        try {
            this.SET_LOADING(true);
            const res: any = await getStatusOrderMidtransApi(orderId);
            this.SET_STATUS_ORDER(res);
            this.SET_LOADING(false);
        } catch (error) {
            this.SET_LOADING(false);
            this.SET_SNAP_TOKEN({});
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }

    /* #region Action */
    @Action
    async getSnapTokenMidtrans(payload: any) {
        try {
            this.SET_LOADING(true);
            const res: any = await getSnapTokenApi(payload);
            this.SET_SNAP_TOKEN(res);
            this.SET_LOADING(false);
        } catch (error) {
            this.SET_LOADING(false);
            this.SET_SNAP_TOKEN({});
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING(payload: boolean) {
        this.loading = payload;
    }

    @Mutation
    SET_SNAP_TOKEN(payload: any) {
        this.snapToken = payload;
    }

    @Mutation
    SET_STATUS_ORDER(payload: any) {
        this.statusOrder = payload;
    }

    @Mutation
    SET_ERROR_ARISAN(payload: any) {
        this.eventErrorMidtrans = payload;
    }

    @Mutation
    SET_SUCCESS_ARISAN(payload: any) {
        this.eventSuccessMidtrans = payload;
    }

    @Mutation
    CLEAN_ACTION_ARISAN() {
        this.eventErrorMidtrans = { ...initSuccessState };
        this.eventSuccessMidtrans = { ...initErrorState };
    }
    /* #endregion */
}

export const MidtransModule = getModule(Midtrans);
