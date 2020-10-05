import Vue from "vue";
import { Component } from "vue-property-decorator";
import Navigation from "../Navigation.vue";
import { initRules } from "../../../common/utils/initialValue";
import { WalletModule } from "../../../store/modules/wallet";
import { AuthModule } from "../../../store/modules/auth";
import { RequestWalletModule } from "../../../store/modules/requestWallet";
import { SaldoModule } from "../../../store/modules/saldo";

@Component({
    name: "RequestWallet",
    components: {}
})
export default class App extends Vue {
    rules: any = {
        ...initRules,
        notZero: (v: any) => v >= 10000 || "Minimal Rp.10.000"
    };
    validForm: boolean = false;
    wallet: number = 100000;
    requestWallet: number = 0;
    bankAccount: string = "";
    bankName: string = "";
    isAlert = false;
    alertMessage = "";
    dialog = false;

    get walletCurrency() {
        return "Rp. " + this.wallet.toLocaleString("id-ID");
    }

    get userId() {
        return AuthModule.id;
    }

    get walletHistories() {
        return WalletModule.wallets;
    }

    get walletPagination() {
        return WalletModule.walletPagination;
    }

    get requestWalletSuccess() {
        return RequestWalletModule.eventSuccessRequestWallet;
    }

    get saldo() {
        return SaldoModule.saldo.saldo;
    }

    get requestWallets() {
        return RequestWalletModule.requestWallets.data;
    }

    created() {
        this.getWallet(1);
        this.getSaldo();
        this.getRequestWallet();
    }

    async getRequestWallet() {
        const params = {
            filter: [
                {
                    field: "user_id",
                    value: this.userId
                },
                {
                    field: "status",
                    value: "WAITING"
                }
            ],
            page: 1,
            per_page: 10
        };
        await RequestWalletModule.fetchRequestWallets(params);
    }

    async getWallet(page: number) {
        const params = {
            filter: [
                {
                    field: "user_id",
                    value: this.userId
                }
            ],
            sort: ["created_at", "DESC"],
            page: page,
            per_page: 20
        };

        WalletModule.fetchWallets(params);
    }

    async getSaldo() {
        SaldoModule.fetchSaldo(this.userId);
    }

    loadMore() {
        const page = this.walletPagination.current_page + 1;
        this.getWallet(page);
    }

    async submit() {
        this.alertMessage = "";
        this.isAlert = false;

        if (this.saldo >= this.requestWallet) {
            await this.getRequestWallet();

            if (this.requestWallets <= 0) {
                await RequestWalletModule.createRequestWallet({
                    user_id: this.userId,
                    amount: this.requestWallet,
                    bank_account: this.bankAccount,
                    notes: this.bankName,
                    status: "WAITING",
                    category: "WITHDRAWAL"
                });
                this.$router.push({ name: "mobile-request-result" });
            } else {
                this.alertMessage =
                    "Anda harus menunggu pencairan pertama selesai";
                this.isAlert = true;
                this.dialog = false;
            }
        } else {
            this.alertMessage = "Saldo tidak cukup";
            this.isAlert = true;
            this.dialog = false;
        }
    }
}
