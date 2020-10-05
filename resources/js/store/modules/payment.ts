import {
    IPaymentState,
    IPaymentData
} from "../../common/interface/payment.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment
} from "../../common/api/payment";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initPaymentData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "PaymentModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Payment extends VuexModule implements IPaymentState {
    payments: any = { ...initResult };
    paymentData: any = { ...initPaymentData };
    loadingFetchPayments: boolean = false;
    loadingCreatePayment: boolean = false;
    loadingUpdatePayment: boolean = false;
    loadingDeletePayment: boolean = false;
    eventErrorPayment: any = {};
    eventSuccessPayment: any = {};

    /* #region Action */
    @Action
    async fetchPayments(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PAYMENT(true);
            const res: any = await fetchPayments(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_PAYMENT(false);
                this.SET_PAYMENTS(res.data);
            } else {
                this.SET_LOADING_FETCH_PAYMENT(false);
                this.SET_PAYMENTS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PAYMENT(false);
            this.SET_PAYMENTS(initResult);
            this.SET_ERROR_PAYMENT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOnePayment(params: IParams) {
        try {
            this.SET_LOADING_FETCH_PAYMENT(true);
            const res: any = await fetchPayments(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_PAYMENT(false);
                this.SET_PAYMENT_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_PAYMENT(false);
                this.SET_PAYMENT_DATA(initPaymentData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_PAYMENT(false);
            this.SET_PAYMENT_DATA(initPaymentData);
            this.SET_ERROR_PAYMENT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createPayment(payload: IPaymentData) {
        try {
            this.SET_LOADING_CREATE_PAYMENT(true);
            const res: any = await createPayment(payload);

            if (res || res.data) {
                this.SET_LOADING_CREATE_PAYMENT(false);
                this.SET_PAYMENT_DATA(res);
                this.SET_SUCCESS_PAYMENT({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Pembayaran", "CREATED")
                });
            } else {
                this.SET_LOADING_CREATE_PAYMENT(false);
            }
        } catch (error) {
            this.SET_LOADING_CREATE_PAYMENT(false);
            this.SET_ERROR_PAYMENT({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updatePayment(data: any) {
        try {
            this.SET_LOADING_UPDATE_PAYMENT(true);
            const res = await updatePayment(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_PAYMENT(false);
                this.SET_PAYMENT_DATA(res.data);
                this.SET_SUCCESS_PAYMENT({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Pembayaran", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_PAYMENT(false);
                this.SET_PAYMENT_DATA(initPaymentData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_PAYMENT(false);
            this.SET_ERROR_PAYMENT({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deletePayment(event_id: string) {
        try {
            this.SET_LOADING_DELETE_PAYMENT(true);

            const res = await deletePayment(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_PAYMENT(false);
                this.SET_SUCCESS_PAYMENT({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Pembayaran", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_PAYMENT(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_PAYMENT(false);
            this.SET_ERROR_PAYMENT({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_PAYMENT(payload: boolean) {
        this.loadingFetchPayments = payload;
    }

    @Mutation
    SET_LOADING_CREATE_PAYMENT(payload: boolean) {
        this.loadingCreatePayment = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_PAYMENT(payload: boolean) {
        this.loadingUpdatePayment = payload;
    }

    @Mutation
    SET_LOADING_DELETE_PAYMENT(payload: boolean) {
        this.loadingDeletePayment = payload;
    }

    @Mutation
    SET_PAYMENTS(payload: IResult) {
        this.payments = { ...payload };
    }

    @Mutation
    SET_PAYMENT_DATA(payload: IPaymentData) {
        this.paymentData = { ...payload };
    }

    @Mutation
    SET_ERROR_PAYMENT(payload: any) {
        this.eventErrorPayment = payload;
    }

    @Mutation
    SET_SUCCESS_PAYMENT(payload: any) {
        this.eventSuccessPayment = payload;
    }

    @Mutation
    CLEAN_ACTION_PAYMENT() {
        this.eventErrorPayment = { ...initSuccessState };
        this.eventSuccessPayment = { ...initErrorState };
    }
    /* #endregion */
}

export const PaymentModule = getModule(Payment);
