import {
    ISaldoData,
    ISaldoState
} from "../../common/interface/saldo.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import { formatErrorMessage } from "../../common/utils/helper";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initSaldoData
} from "../../common/utils/initialValue";
import { fetchSaldo } from "../../common/api/saldo";

@Module({
    dynamic: true,
    store,
    name: "SaldoModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Saldo extends VuexModule implements ISaldoState {
    loadingFetchSaldos: boolean = false;
    saldos: any = { ...initResult };
    saldo: any = { ...initSaldoData };
    eventErrorSaldo: any = {};
    eventSuccessSaldo: any = {};

    /* #region Action */
    @Action
    async fetchSaldo(userId: string) {
        try {
            this.SET_LOADING_FETCH_SALDO(true);
            const res: any = await fetchSaldo(userId);
            if (res) {
                this.SET_LOADING_FETCH_SALDO(false);
                this.SET_SALDO_DATA(res);
            } else {
                this.SET_LOADING_FETCH_SALDO(false);
                this.SET_SALDO_DATA(initSaldoData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_SALDO(false);
            this.SET_SALDO_DATA(initSaldoData);
            this.SET_ERROR_SALDO({ data: formatErrorMessage(error) });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_SALDO(payload: boolean) {
        this.loadingFetchSaldos = payload;
    }

    @Mutation
    SET_SALDO_DATA(payload: ISaldoData) {
        this.saldo = { ...payload };
    }

    @Mutation
    SET_ERROR_SALDO(payload: any) {
        this.eventErrorSaldo = payload;
    }

    @Mutation
    SET_SUCCESS_SALDO(payload: any) {
        this.eventSuccessSaldo = payload;
    }

    @Mutation
    CLEAN_ACTION_SALDO() {
        this.eventSuccessSaldo = { ...initSuccessState };
        this.eventErrorSaldo = { ...initErrorState };
    }
    /* #endregion */
}

export const SaldoModule = getModule(Saldo);
