import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { AuthModule } from "../../../store/modules/auth";
import { ArisanModule } from "../../../store/modules/arisan";
import {
    initParams,
    initRules,
    initArisanData,
    initArisanTransactionData
} from "../../../common/utils/initialValue";
import { ArisanMemberModule } from "../../../store/modules/arisanMember";
import { ArisanTransactionModule } from "../../../store/modules/arisanTransaction";
import { PaymentModule } from "../../../store/modules/payment";
import { MidtransModule } from "../../../store/modules/midtrans";
import { UserModule } from "../../../store/modules/user";

@Component({
    name: "ListBarang",
    components: {}
})
export default class ListBarang extends Vue {
    @Prop(String) readonly status?: string;
    @Prop(Number) readonly iuran?: number;

    alertMidtrans: boolean = false;
    loadData: boolean = true;
    notSelected = true;
    selected = "";
    selectedBarang: any = {};
    id = "";
    dialogTerima = false;
    dialogSnap = true;
    alert = false;
    params: any = initParams;
    limit: number = 0;
    selisih: number = 0;
    paramTransaction: any = initArisanTransactionData;

    cards: any[] = [
        {
            icon: "mdi-credit-card",
            text: this.id,
            id: "mandir",
            link: []
        },
        { icon: "mdi-credit-card", text: "BCA", id: "bca", link: [] },
        { icon: "mdi-credit-card", text: "BRI", id: "bri", link: [] },
        { icon: "mdi-credit-card", text: "BNI", id: "bni", link: [] }
    ];

    get arisanData() {
        return ArisanModule.arisanData;
    }

    get arisanTransactions() {
        return ArisanTransactionModule.arisanTransactions;
    }

    get arisanTransactionsData() {
        return ArisanTransactionModule.arisanTransactionData;
    }

    get paymentData() {
        return PaymentModule.paymentData;
    }

    get arisanReminders() {
        return ArisanModule.arisanReminders;
    }

    get loadingUpdateArisanTransaction() {
        return ArisanTransactionModule.loadingUpdateArisanTransaction;
    }

    get loadingFetchArisanTransaction() {
        return ArisanTransactionModule.loadingFetchArisanTransactions;
    }

    get loadingCreatePayment() {
        return PaymentModule.loadingCreatePayment;
    }

    get snapTokenMidtrans() {
        return MidtransModule.snapToken;
    }

    get loadingMidtrans() {
        return MidtransModule.loading;
    }

    get alertMessage() {
        return (
            MidtransModule.eventErrorMidtrans &&
            MidtransModule.eventErrorMidtrans.data
        );
    }

    get userData() {
        return AuthModule.userData;
    }

    @Watch("alertMessage")
    getErrorMessageMidtrans() {
        this.alertMidtrans = true;
    }

    @Watch("snapTokenMidtrans")
    getSnapTokenWatch() {
        if (this.snapTokenMidtrans.token) {
            window.location.href = this.snapTokenMidtrans.redirect_url;
        }
    }

    mounted() {
        this.loadData = true;
        this.notSelected = true;
        this.id = this.arisanData.id;

        if (this.iuran != null || this.iuran != undefined) {
            this.limit = this.iuran;
        }
        this.getData();
    }

    async getData() {
        var filter = [];
        filter = [
            {
                field: "status",
                value: this.status,
                value2: "AND"
            },
            {
                field: "arisan_id",
                value: this.id
            }
        ];
        await AuthModule.me();
        this.params = {
            ...this.params,
            filter: filter,
            join: "payments"
        };
        await ArisanTransactionModule.fetchWaitingArisanTransactions(this.params);
        this.loadData = this.loadingFetchArisanTransaction;
    }


    selectbarang(selected: any) {
        if (
            this.status == "WAIT_PAYMENT" &&
            selected.status == "WAIT_PAYMENT"
        ) {
            this.selectedBarang = selected;
            this.notSelected = false;
            this.selisih =
                this.selectedBarang.meta_product.base_price -
                this.arisanData.average_funds;
        } else {
            // this.selectedBarang = initArisanTransactionData;
            this.notSelected = true;
        }
    }

    openDialogTerima(selectedBarang: any) {
        this.dialogTerima = true;

        this.selectedBarang = selectedBarang;
        console.log(this.selectedBarang);

    }
    async terimaBarang() {
        const data = {
            id: this.selectedBarang.id,
            arisan_id: this.selectedBarang.arisan_id,
            payment_id: this.selectedBarang.payment_id,
            status: "FINISH"
        };
        await ArisanTransactionModule.updateArisanTransaction(data);
        if (this.loadingUpdateArisanTransaction) {
            console.log("loading");
        } else {
            this.dialogTerima = false;
            this.getData();
            this.loadData = false;
            this.showAlert();
        }
    }

    showAlert() {
        this.alert = true;
    }

    async createPayment() {
        const meta = {
            transaction_details: {
                order_id: "order-csb-example",
                gross_amount: this.selectedBarang.meta_product.base_price
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: "TRIAL",
                last_name: "DATA",
                email: "testmidtrans@mailnesia.com",
                phone: "08111222333"
            }
        };
        const payment = {
            ...this.params,
            meta: meta
        };

        await PaymentModule.createPayment(payment);
    }

    async bayar() {
        await this.createPayment();
        this.loadData = true;
        if (this.loadingCreatePayment) {
            console.log("LOAD");
        } else {
            console.log("END");
            const metaArisan = {
                order_id: "order-csb-example",
                gross_amount: 10000
            };

            const data = {
                id: this.selectedBarang.id,
                arisan_id: this.selectedBarang.arisan_id,
                payment_id: this.paymentData.id,
                status: "PAID",
                reminder_id: this.selectedReminder()
            };
            await ArisanTransactionModule.updateArisanTransaction(data);
            if (this.loadingUpdateArisanTransaction) {
                console.log("loading");
            } else {
                this.limit +=
                    this.iuran == null || this.iuran == undefined
                        ? 0
                        : this.iuran -
                          this.selectedBarang.meta_product.base_price;
                this.dialogTerima = false;
                this.getData();
                this.loadData = false;
                this.notSelected = true;
                this.showAlert();
            }
            // this.$router.go(-1);
        }
    }

    async selectBarang(barang: any) {
        await ArisanTransactionModule.setSelectedArisanTransaction(barang);
        this.$router.push("/mobile/data_arisan/barang/status");
    }

    selectedReminder() {
        try {
            let reminder: any;
            const maps = this.arisanReminders.map((element: any) => {
                if (element.id == this.selectedBarang.arisan_id) {
                    reminder = element;
                }
            });
            return reminder.reminders[0].id;
        } catch (ex) {
            return null;
        }
    }

    async getSnapToken() {
        const dataBarang = this.selectedBarang.meta_product;
        const date = new Date();
        const orderId = date.getTime();
        const user: any = this.userData;
        console.log(this.arisanData.average_funds);

        const data = {
            transaction_details: {
                order_id: "ANEKA" + orderId,
                gross_amount: this.arisanData.average_funds
            },
            item_details: [
                {
                    id: dataBarang.id,
                    price: this.arisanData.average_funds,
                    quantity: 1,
                    name: dataBarang.name,
                    brand: "",
                    category: "",
                    merchant_name: "ANEKA"
                }
            ],
            customer_details: {
                first_name: user.name,
                last_name: "",
                email: user.email ? user.email : null,
                phone: user.phone_number,
                address: user.street
                    ? user.street + " "
                    : "" + user.village
                        ? user.village + " "
                        : "" + user.district
                            ? user.district + " "
                            : "" + user.region
                                ? user.region + " "
                                : "" + user.province
                                    ? user.province + " "
                                    : ""
            }
        };

        const data2 = {
            arisan_transaction_id: this.selectedBarang.id,
            midtrans_detail: data
        };
        await MidtransModule.getSnapTokenMidtrans(data2);
    }
}
