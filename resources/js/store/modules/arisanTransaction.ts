import {
    IArisanTransactionState,
    IArisanTransactionData
} from "../../common/interface/arisanTransaction.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchArisanTransactions,
    createArisanTransaction,
    updateArisanTransaction,
    deleteArisanTransaction,
    fetchOneArisanTransaction
} from "../../common/api/arisanTransaction";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initArisanTransactionData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ArisanTransactionModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class ArisanTransaction extends VuexModule implements IArisanTransactionState {
    arisanTransactions: any = { ...initResult };
    arisanTransactionData: any = { ...initArisanTransactionData };
    loadingFetchArisanTransactions: boolean = false;
    loadingCreateArisanTransaction: boolean = false;
    loadingUpdateArisanTransaction: boolean = false;
    loadingDeleteArisanTransaction: boolean = false;
    eventErrorArisanTransaction: any = {};
    eventSuccessArisanTransaction: any = {};

    /* #region Action */
    @Action
    async fetchArisanTransactions(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(true);
            const res: any = await fetchArisanTransactions(params);
            if (res && res.data) {
                // const mapArisan = res.data.map((element: any) => {
                //     return {
                //         ...element,
                //         meta_product: JSON.parse(element.meta_product)
                //     };
                // });
                // res.data = mapArisan;
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(res.data);
                this.SET_ARISAN_TRANSACTIONS(res);
            } else {
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
                this.SET_ARISAN_TRANSACTIONS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
            this.SET_ARISAN_TRANSACTIONS(initResult);
            this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error)
            });
        }
    }

    /* #region Action */
    @Action
    async fetchWaitingArisanTransactions(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(true);
            const res: any = await fetchArisanTransactions(params);
            if (res && res.data) {
                var i, a;
                var dat = res.data;
                for (i = 0; i < dat.length; i++) {
                    dat[i] = dat[i];
                    for (a = i + 1; a < res.data.length; a++) {
                        if (
                            res.data[a].meta_product.base_price <
                            res.data[i].meta_product.base_price
                        ) {
                            var sel = dat[i];
                            dat[i] = dat[a];
                            dat[a] = sel;
                            break;
                        }
                    }
                }
                res.data = dat;
                res.total = dat.length;
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(dat);
                this.SET_ARISAN_TRANSACTIONS(res);
            } else {
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
                this.SET_ARISAN_TRANSACTIONS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
            this.SET_ARISAN_TRANSACTIONS(initResult);
            this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error)
            });
        }
    }

    @Action
    async fetchOneArisanTransaction(id: string) {
        try {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(true);
            const res: any = await fetchOneArisanTransaction(id);
            if (res) {
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(res);
            } else {
                this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN_TRANSACTION(false);
            this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error)
            });
        }
    }

    @Action
    async setSelectedArisanTransaction(data: any) {
        try {
            this.SET_ARISAN_TRANSACTION_DATA(data);
        } catch (error) {
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error)
            });
        }
    }

    @Action
    async createArisanTransaction(payload: any) {
        try {
            this.SET_LOADING_CREATE_ARISAN_TRANSACTION(true);
            const res: any = await createArisanTransaction(payload);
            this.SET_LOADING_CREATE_ARISAN_TRANSACTION(false);
            this.SET_ARISAN_TRANSACTION_DATA(res.data);
            this.SET_SUCCESS_ARISAN_TRANSACTION({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Transaksi", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_ARISAN_TRANSACTION(false);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error)
            });
        }
    }

    @Action
    async updateArisanTransaction(data: any) {
        try {
            this.SET_LOADING_UPDATE_ARISAN_TRANSACTION(true);
            const res = await updateArisanTransaction(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(res.data);
                this.SET_SUCCESS_ARISAN_TRANSACTION({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Transaksi", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_ARISAN_TRANSACTION(false);
                this.SET_ARISAN_TRANSACTION_DATA(initArisanTransactionData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_ARISAN_TRANSACTION(false);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteArisanTransaction(event_id: string) {
        try {
            this.SET_LOADING_DELETE_ARISAN_TRANSACTION(true);

            const res = await deleteArisanTransaction(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_ARISAN_TRANSACTION(false);
                this.SET_SUCCESS_ARISAN_TRANSACTION({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Transaksi", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_ARISAN_TRANSACTION(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_ARISAN_TRANSACTION(false);
            this.SET_ERROR_ARISAN_TRANSACTION({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_ARISAN_TRANSACTION(payload: boolean) {
        this.loadingFetchArisanTransactions = payload;
    }

    @Mutation
    SET_LOADING_CREATE_ARISAN_TRANSACTION(payload: boolean) {
        this.loadingCreateArisanTransaction = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_ARISAN_TRANSACTION(payload: boolean) {
        this.loadingUpdateArisanTransaction = payload;
    }

    @Mutation
    SET_LOADING_DELETE_ARISAN_TRANSACTION(payload: boolean) {
        this.loadingDeleteArisanTransaction = payload;
    }

    @Mutation
    SET_ARISAN_TRANSACTIONS(payload: IResult) {
        this.arisanTransactions = { ...payload };
    }

    @Mutation
    SET_ARISAN_TRANSACTION_DATA(payload: IArisanTransactionData) {
        this.arisanTransactionData = { ...payload };
    }

    @Mutation
    SET_ERROR_ARISAN_TRANSACTION(payload: any) {
        this.eventErrorArisanTransaction = payload;
    }

    @Mutation
    SET_SUCCESS_ARISAN_TRANSACTION(payload: any) {
        this.eventSuccessArisanTransaction = payload;
    }

    @Mutation
    CLEAN_ACTION_ARISAN_TRANSACTION() {
        this.eventErrorArisanTransaction = { ...initSuccessState };
        this.eventSuccessArisanTransaction = { ...initErrorState };
    }
    /* #endregion */
}

export const ArisanTransactionModule = getModule(ArisanTransaction);
