import {
    IRequestWalletState,
    IRequestWalletData
} from "../../common/interface/requestWallet.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchRequestWallets,
    createRequestWallet,
    updateRequestWallet,
    deleteRequestWallet,
    fetchOneRequestWallet
} from "../../common/api/requestWallet";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initRequestWalletData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";
import { dateTimeTransaction } from "../../common/format/date";

@Module({
    dynamic: true,
    store,
    name: "RequestWalletModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class RequestWallet extends VuexModule implements IRequestWalletState {
    requestWallets: any = { ...initResult };
    requestWalletData: any = { ...initRequestWalletData };
    loadingFetchRequestWallets: boolean = false;
    loadingCreateRequestWallet: boolean = false;
    loadingUpdateRequestWallet: boolean = false;
    loadingDeleteRequestWallet: boolean = false;
    eventErrorRequestWallet: any = {};
    eventSuccessRequestWallet: any = {};

    /* #requeswallet Action */
    @Action
    async fetchRequestWallets(params: any) {
        try {
            this.SET_LOADING_FETCH_REQUEST_WALLET(true);
            const res: any = await fetchRequestWallets(params);
            if (res && res.data) {
                const data: any[] = res.data.map((el: any) => {
                    return {
                        ...el,
                        transaction_date: dateTimeTransaction(
                            new Date(el.created_at),
                            "SHORT"
                        )
                    };
                });

                const datas = {
                    ...res,
                    data: data
                };

                this.SET_REQUEST_WALLETS(datas);
                this.SET_LOADING_FETCH_REQUEST_WALLET(false);
            } else {
                this.SET_REQUEST_WALLETS(initResult);
                this.SET_LOADING_FETCH_REQUEST_WALLET(false);
            }
        } catch (error) {
            this.SET_REQUEST_WALLETS(initResult);
            this.SET_ERROR_REQUEST_WALLET({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_REQUEST_WALLET(false);
        }
    }

    async fetchOneRequestWallet(id: string) {
        try {
            this.SET_LOADING_FETCH_REQUEST_WALLET(true);
            const res: any = await fetchOneRequestWallet(id);
            if (res && res.data) {
                this.SET_REQUEST_WALLET_DATA(res.data);
                this.SET_LOADING_FETCH_REQUEST_WALLET(false);
            } else {
                this.SET_REQUEST_WALLET_DATA(initRequestWalletData);
                this.SET_LOADING_FETCH_REQUEST_WALLET(false);
            }
        } catch (error) {
            this.SET_REQUEST_WALLET_DATA(initRequestWalletData);
            this.SET_ERROR_REQUEST_WALLET({ data: formatErrorMessage(error) });
            this.SET_LOADING_FETCH_REQUEST_WALLET(false);
        }
    }

    @Action
    async createRequestWallet(payload: IRequestWalletData) {
        try {
            this.SET_LOADING_CREATE_REQUEST_WALLET(true);
            const res: any = await createRequestWallet(payload);
            this.SET_REQUEST_WALLET_DATA(res.data);
            this.SET_SUCCESS_REQUEST_WALLET({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Pencairan Dompet", "CREATED")
            });
            this.SET_LOADING_CREATE_REQUEST_WALLET(false);
        } catch (error) {
            this.SET_ERROR_REQUEST_WALLET({ data: formatErrorMessage(error) });
            this.SET_LOADING_CREATE_REQUEST_WALLET(false);
        }
    }

    @Action
    async updateRequestWallet(data: any) {
        try {
            this.SET_LOADING_UPDATE_REQUEST_WALLET(true);
            const res = await updateRequestWallet(data.id, data);
            if (res && res.data) {
                this.SET_REQUEST_WALLET_DATA(res.data);
                this.SET_SUCCESS_REQUEST_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Pencairan Dompet", "UPDATED")
                });
                this.SET_LOADING_UPDATE_REQUEST_WALLET(false);
            } else {
                this.SET_REQUEST_WALLET_DATA(initRequestWalletData);
                this.SET_LOADING_UPDATE_REQUEST_WALLET(false);
            }
        } catch (error) {
            this.SET_ERROR_REQUEST_WALLET({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_REQUEST_WALLET(false);
        }
    }

    @Action
    async deleteRequestWallet(event_id: string) {
        try {
            this.SET_LOADING_DELETE_REQUEST_WALLET(true);

            const res = await deleteRequestWallet(event_id);

            if (res && res.status === 200) {
                this.SET_SUCCESS_REQUEST_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Pencairan Dompet", "DELETED")
                });
                this.SET_LOADING_DELETE_REQUEST_WALLET(false);
            } else {
                this.SET_LOADING_DELETE_REQUEST_WALLET(false);
            }
        } catch (error) {
            this.SET_ERROR_REQUEST_WALLET({
                data: formatErrorMessage(error),
                status: true
            });
            this.SET_LOADING_DELETE_REQUEST_WALLET(false);
        }
    }
    /* #endrequeswallet */

    /* #requeswallet  Mutation */
    @Mutation
    SET_LOADING_FETCH_REQUEST_WALLET(payload: boolean) {
        this.loadingFetchRequestWallets = payload;
    }

    @Mutation
    SET_LOADING_CREATE_REQUEST_WALLET(payload: boolean) {
        this.loadingCreateRequestWallet = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_REQUEST_WALLET(payload: boolean) {
        this.loadingUpdateRequestWallet = payload;
    }

    @Mutation
    SET_LOADING_DELETE_REQUEST_WALLET(payload: boolean) {
        this.loadingDeleteRequestWallet = payload;
    }

    @Mutation
    SET_REQUEST_WALLETS(payload: IResult) {
        this.requestWallets = { ...payload };
    }

    @Mutation
    SET_REQUEST_WALLET_DATA(payload: IRequestWalletData) {
        this.requestWalletData = { ...payload };
    }

    @Mutation
    SET_ERROR_REQUEST_WALLET(payload: any) {
        this.eventErrorRequestWallet = payload;
    }

    @Mutation
    SET_SUCCESS_REQUEST_WALLET(payload: any) {
        this.eventSuccessRequestWallet = payload;
    }

    @Mutation
    CLEAN_ACTION_REQUEST_WALLET() {
        this.eventErrorRequestWallet = { ...initSuccessState };
        this.eventSuccessRequestWallet = { ...initErrorState };
    }
    /* #endrequeswallet */
}

export const RequestWalletModule = getModule(RequestWallet);
