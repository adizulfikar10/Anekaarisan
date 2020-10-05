import {
    IWithdrawState,
    IWithdrawData
} from "../../common/interface/withdraw.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchWithdraws,
    createWithdraw,
    updateWithdraw,
    deleteWithdraw
} from "../../common/api/withdraw";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initWithdrawData
} from "../../common/utils/initialValue";

@Module({
    dynamic: true,
    store,
    name: "WithdrawModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Withdraw extends VuexModule implements IWithdrawState {
    withdraws: any = { ...initResult };
    withdrawData: any = { ...initWithdrawData };
    loadingFetchWithdraws: boolean = false;
    loadingCreateWithdraw: boolean = false;
    loadingUpdateWithdraw: boolean = false;
    loadingDeleteWithdraw: boolean = false;
    eventErrorWithdraw: any = {};
    eventSuccessWithdraw: any = {};

    /* #region Action */
    @Action
    async fetchWithdraws(params: IParams) {
        try {
            this.SET_LOADING_FETCH_WALLET(true);
            const res: any = await fetchWithdraws(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLETS(res.data);
            } else {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLETS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_WALLET(false);
            this.SET_WALLETS(initResult);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneWithdraw(params: IParams) {
        try {
            this.SET_LOADING_FETCH_WALLET(true);
            const res: any = await fetchWithdraws(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLET_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLET_DATA(initWithdrawData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_WALLET(false);
            this.SET_WALLET_DATA(initWithdrawData);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createWithdraw(payload: IWithdrawData) {
        try {
            this.SET_LOADING_CREATE_WALLET(true);
            const res: any = await createWithdraw(payload);
            if (res && res.data) {
                this.SET_LOADING_CREATE_WALLET(false);
                this.SET_WALLET_DATA(res.data);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "Withdraw has been created"
                });
            } else {
                this.SET_LOADING_CREATE_WALLET(false);
            }
        } catch (error) {
            this.SET_LOADING_CREATE_WALLET(false);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateWithdraw(data: any) {
        try {
            this.SET_LOADING_UPDATE_WALLET(true);
            const res = await updateWithdraw(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_WALLET(false);
                this.SET_WALLET_DATA(res.data);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "Withdraw has been updated"
                });
            } else {
                this.SET_LOADING_UPDATE_WALLET(false);
                this.SET_WALLET_DATA(initWithdrawData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_WALLET(false);
            this.SET_ERROR_WALLET({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteWithdraw(event_id: string) {
        try {
            this.SET_LOADING_DELETE_WALLET(true);

            const res = await deleteWithdraw(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_WALLET(false);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "Withdraw has been deleted"
                });
            } else {
                this.SET_LOADING_DELETE_WALLET(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_WALLET(false);
            this.SET_ERROR_WALLET({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_WALLET(payload: boolean) {
        this.loadingFetchWithdraws = payload;
    }

    @Mutation
    SET_LOADING_CREATE_WALLET(payload: boolean) {
        this.loadingCreateWithdraw = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_WALLET(payload: boolean) {
        this.loadingUpdateWithdraw = payload;
    }

    @Mutation
    SET_LOADING_DELETE_WALLET(payload: boolean) {
        this.loadingDeleteWithdraw = payload;
    }

    @Mutation
    SET_WALLETS(payload: IResult) {
        this.withdraws = { ...payload };
    }

    @Mutation
    SET_WALLET_DATA(payload: IWithdrawData) {
        this.withdrawData = { ...payload };
    }

    @Mutation
    SET_ERROR_WALLET(payload: any) {
        this.eventErrorWithdraw = payload.data;
    }

    @Mutation
    SET_SUCCESS_WALLET(payload: any) {
        this.eventSuccessWithdraw = payload.data;
    }

    @Mutation
    CLEAN_ACTION_WALLET() {
        this.eventErrorWithdraw = { ...initSuccessState };
        this.eventSuccessWithdraw = { ...initErrorState };
    }
    /* #endregion */
}

export const WithdrawModule = getModule(Withdraw);
