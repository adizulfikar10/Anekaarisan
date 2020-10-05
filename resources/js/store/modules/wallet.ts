import {
    IWalletState,
    IWalletData
} from "../../common/interface/wallet.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchWallets,
    createWallet,
    updateWallet,
    deleteWallet
} from "../../common/api/wallet";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initWalletData
} from "../../common/utils/initialValue";
import { dateTimeTransaction } from "../../common/format/date";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "WalletModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Wallet extends VuexModule implements IWalletState {
    wallets: any = [];
    walletData: any = { ...initWalletData };
    walletPagination: any = {};
    loadingFetchWallets: boolean = false;
    loadingCreateWallet: boolean = false;
    loadingUpdateWallet: boolean = false;
    loadingDeleteWallet: boolean = false;
    eventErrorWallet: any = {};
    eventSuccessWallet: any = {};

    /* #region Action */
    @Action
    async fetchWallets(params: IParams) {
        try {
            this.SET_LOADING_FETCH_WALLET(true);
            const res: any = await fetchWallets(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_WALLET(false);

                const walletInject: any[] = res.data.map((el: any) => {
                    return {
                        ...el,
                        transaction_date: dateTimeTransaction(
                            new Date(el.created_at),
                            "SHORT"
                        )
                    };
                });

                let arrWallet = this.wallets;

                if (params.page != 1) {
                    Array.prototype.push.apply(arrWallet, walletInject);
                } else {
                    arrWallet = walletInject;
                }

                this.SET_PAGINATION_DATA(res);
                this.SET_WALLETS(arrWallet);
            } else {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLETS([]);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_WALLET(false);
            this.SET_WALLETS([]);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneWallet(params: IParams) {
        try {
            this.SET_LOADING_FETCH_WALLET(true);
            const res: any = await fetchWallets(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLET_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_WALLET(false);
                this.SET_WALLET_DATA(initWalletData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_WALLET(false);
            this.SET_WALLET_DATA(initWalletData);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createWallet(payload: IWalletData) {
        try {
            this.SET_LOADING_CREATE_WALLET(true);
            const res: any = await createWallet(payload);
            if (res && res.data) {
                this.SET_LOADING_CREATE_WALLET(false);
                this.SET_WALLET_DATA(res.data);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Dompet", "CREATED")
                });

                this.wallets;
            } else {
                this.SET_LOADING_CREATE_WALLET(false);
            }
        } catch (error) {
            this.SET_LOADING_CREATE_WALLET(false);
            this.SET_ERROR_WALLET({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateWallet(data: any) {
        try {
            this.SET_LOADING_UPDATE_WALLET(true);
            const res = await updateWallet(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_WALLET(false);
                this.SET_WALLET_DATA(res.data);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Dompet", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_WALLET(false);
                this.SET_WALLET_DATA(initWalletData);
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
    async deleteWallet(event_id: string) {
        try {
            this.SET_LOADING_DELETE_WALLET(true);

            const res = await deleteWallet(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_WALLET(false);
                this.SET_SUCCESS_WALLET({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Dompet", "DELETED")
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
        this.loadingFetchWallets = payload;
    }

    @Mutation
    SET_LOADING_CREATE_WALLET(payload: boolean) {
        this.loadingCreateWallet = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_WALLET(payload: boolean) {
        this.loadingUpdateWallet = payload;
    }

    @Mutation
    SET_LOADING_DELETE_WALLET(payload: boolean) {
        this.loadingDeleteWallet = payload;
    }

    @Mutation
    SET_WALLETS(payload: any[]) {
        this.wallets = payload;
    }

    @Mutation
    SET_WALLET_DATA(payload: IWalletData) {
        this.walletData = { ...payload };
    }

    @Mutation
    SET_ERROR_WALLET(payload: any) {
        this.eventErrorWallet = payload;
    }

    @Mutation
    SET_SUCCESS_WALLET(payload: any) {
        this.eventSuccessWallet = payload;
    }

    @Mutation
    CLEAN_ACTION_WALLET() {
        this.eventErrorWallet = { ...initSuccessState };
        this.eventSuccessWallet = { ...initErrorState };
    }

    @Mutation
    SET_PAGINATION_DATA(payload: any) {
        const pagination = payload;
        delete pagination.data;

        this.walletPagination = pagination;
    }
    /* #endregion */
}

export const WalletModule = getModule(Wallet);
