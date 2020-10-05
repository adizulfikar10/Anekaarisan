import {
    ICommissionState,
    ICommissionData
} from "../../common/interface/commission.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission
} from "../../common/api/commission";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initCommissionData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "CommissionModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Commission extends VuexModule implements ICommissionState {
    commissions: any = { ...initResult };
    commissionData: any = { ...initCommissionData };
    loadingFetchCommissions: boolean = false;
    loadingCreateCommission: boolean = false;
    loadingUpdateCommission: boolean = false;
    loadingDeleteCommission: boolean = false;
    eventErrorCommission: any = {};
    eventSuccessCommission: any = {};

    /* #region Action */
    @Action
    async fetchCommissions(params: IParams) {
        try {
            this.SET_LOADING_FETCH_COMMISSION(true);
            const res: any = await fetchCommissions(params);
            if (res && res.data) {
                this.SET_COMMISSIONS(res);
                this.SET_LOADING_FETCH_COMMISSION(false);
            } else {
                this.SET_COMMISSIONS(initResult);
                this.SET_LOADING_FETCH_COMMISSION(false);
            }
        } catch (error) {
            this.SET_COMMISSIONS(initResult);
            this.SET_ERROR_COMMISSION({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_COMMISSION(false);
        }
    }

    async fetchOneCommission(params: IParams) {
        try {
            this.SET_LOADING_FETCH_COMMISSION(true);
            const res: any = await fetchCommissions(params);
            if (res && res.data) {
                this.SET_COMMISSION_DATA(res.data);
                this.SET_LOADING_FETCH_COMMISSION(false);
            } else {
                this.SET_COMMISSION_DATA(initCommissionData);
                this.SET_LOADING_FETCH_COMMISSION(false);
            }
        } catch (error) {
            this.SET_COMMISSION_DATA(initCommissionData);
            this.SET_ERROR_COMMISSION({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_COMMISSION(false);
        }
    }

    @Action
    async createCommission(payload: ICommissionData) {
        try {
            this.SET_LOADING_CREATE_COMMISSION(true);
            const res: any = await createCommission(payload);
            this.SET_COMMISSION_DATA(res.data);
            this.SET_SUCCESS_COMMISSION({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Komisi", "CREATED")
            });
            this.SET_LOADING_CREATE_COMMISSION(false);
        } catch (error) {
            this.SET_ERROR_COMMISSION({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_COMMISSION(false);
        }
    }

    @Action
    async updateCommission(data: any) {
        try {
            this.SET_LOADING_UPDATE_COMMISSION(true);
            const res = await updateCommission(data.id, data);
            if (res && res.data) {
                this.SET_COMMISSION_DATA(res.data);
                this.SET_SUCCESS_COMMISSION({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Komisi", "UPDATED")
                });
                this.SET_LOADING_UPDATE_COMMISSION(false);
            } else {
                this.SET_COMMISSION_DATA(initCommissionData);
                this.SET_LOADING_UPDATE_COMMISSION(false);
            }
        } catch (error) {
            this.SET_ERROR_COMMISSION({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_COMMISSION(false);
        }
    }

    @Action
    async deleteCommission(event_id: string) {
        try {
            this.SET_LOADING_DELETE_COMMISSION(true);

            const res = await deleteCommission(event_id);

            if (res && res.status === 200) {
                this.SET_SUCCESS_COMMISSION({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Komisi", "DELETED")
                });
                this.SET_LOADING_DELETE_COMMISSION(false);
            } else {
                this.SET_LOADING_DELETE_COMMISSION(false);
            }
        } catch (error) {
            this.SET_ERROR_COMMISSION({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_COMMISSION(false);
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_COMMISSION(payload: boolean) {
        this.loadingFetchCommissions = payload;
    }

    @Mutation
    SET_LOADING_CREATE_COMMISSION(payload: boolean) {
        this.loadingCreateCommission = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_COMMISSION(payload: boolean) {
        this.loadingUpdateCommission = payload;
    }

    @Mutation
    SET_LOADING_DELETE_COMMISSION(payload: boolean) {
        this.loadingDeleteCommission = payload;
    }

    @Mutation
    SET_COMMISSIONS(payload: IResult) {
        this.commissions = { ...payload };
    }

    @Mutation
    SET_COMMISSION_DATA(payload: ICommissionData) {
        this.commissionData = { ...payload };
    }

    @Mutation
    SET_ERROR_COMMISSION(payload: any) {
        this.eventErrorCommission = payload;
    }

    @Mutation
    SET_SUCCESS_COMMISSION(payload: any) {
        this.eventSuccessCommission = payload;
    }

    @Mutation
    CLEAN_ACTION_COMMISSION() {
        this.eventErrorCommission = { ...initSuccessState };
        this.eventSuccessCommission = { ...initErrorState };
    }
    /* #endregion */
}

export const CommissionModule = getModule(Commission);
