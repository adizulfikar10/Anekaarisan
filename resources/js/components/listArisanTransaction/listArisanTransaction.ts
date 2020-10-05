import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ArisanTransactionModule } from "../../store/modules/arisanTransaction";
import {
    initParams,
    initRules,
    initArisanTransactionData
} from "../../common/utils/initialValue";
import { IArisanTransactionData } from "../../common/interface/arisanTransaction.interface";
import indonesia from "territory-indonesia";
import { MidtransModule } from '../../store/modules/midtrans';

@Component({
    name: "ListArisanTransaction"
})
export default class ListArisanTransaction extends Vue {
    //properti digunakan jika view dijadikan komponen
    @Prop(String) readonly status?: string;
    @Prop(String) readonly role?: string;

    //inisialisasi
    params: any = initParams;

    validForm: boolean = false;
    searchValue: string = "";

    dialogKonfirmasi: boolean = false;
    loadingUpdate = false;
    courier = "JNE";

    selectedItem: any = {};
    dialogDetail: any = false;
    dialogConfirmation: any = false;

    form: any = Object.assign({}, { ...initArisanTransactionData });
    rules: any = initRules;

    error: any = Object.assign({}, { ...initArisanTransactionData });

    headers: any[] = [
        { text: "Arisan", value: "meta_arisan.sequence_code" },
        { text: "Nama Barang", value: "meta_product.name" },
        { text: "Harga Barang", value: "meta_product.base_price" },
        { text: "Kode Transaksi", value: "order_id" },
        { text: "Action", value: "actions", sortable: false, width: 190 }
    ];

    kurir: String[] = ["JNE", "JNT", "TIKI", "SiCepat"];
    // computed untuk get data dari store
    get statusOrderMidtrans() {
        return MidtransModule.statusOrder;
    }

    get loadingMidtrans() {
        return MidtransModule.loading;
    }

    get arisanTransactions() {
        return ArisanTransactionModule.arisanTransactions;
    }

    get arisanTransactionData() {
        return ArisanTransactionModule.arisanTransactionData;
    }

    get isLoadingAction() {
        return (
            ArisanTransactionModule.loadingCreateArisanTransaction ||
            ArisanTransactionModule.loadingUpdateArisanTransaction ||
            ArisanTransactionModule.loadingDeleteArisanTransaction
        );
    }

    get loadingUpdateArisanTransaction() {
        return ArisanTransactionModule.loadingUpdateArisanTransaction;
    }

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListArisanTransactions();
    }

    async getListArisanTransactions() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                }
            ],
            join: "arisanmember,arisan,arisan.user"
        };
        await ArisanTransactionModule.fetchArisanTransactions(this.params);
    }

    async searchArisanTransaction() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                },
                {
                    field: "name",
                    value: this.searchValue
                }
            ]
        };
        await ArisanTransactionModule.fetchArisanTransactions(this.params);
    }

    onPageChange(newPage: any) {
        this.params = {
            ...this.params,
            page: newPage
        };

        this.getListArisanTransactions();
    }

    resetForm() {
        this.dialogKonfirmasi = false;
        this.form = Object.assign({}, { initArisanTransactionData });
        (this.$refs.form as any).reset();
    }

    checkData(data: any) {
        Object.keys(data).forEach((el: any) => {
            if (
                data[el] === undefined ||
                data[el] === "" ||
                data[el] === null
            ) {
                delete data[el];
            }
        });

        return data;
    }

    selectBarang(arisanTransaksi: any) {
        this.dialogKonfirmasi = true;
        this.selectedItem = arisanTransaksi;
    }

    setSelectedKurir(value: any) {
        this.courier = value;
    }

    async konfirmasiBayar() {
        const data = {
            id: this.selectedItem.id,
            arisan_id: this.selectedItem.arisan_id,
            payment_id: this.selectedItem.payment_id,
            status: "SENDING",
            shipping_number: this.form.shipping_number,
            courier: this.courier
        };
        await ArisanTransactionModule.updateArisanTransaction(data);
        this.dialogKonfirmasi = false;
        this.resetForm();
        this.setInitData();
    }



    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }

    async detailOrder(item: any) {
        await MidtransModule.getStatusOrderMidtrans(item.order_id);

        this.dialogDetail = true;
        this.selectedItem = item;
    }

    async acceptTransaction() {
        const data = {
            ...this.selectedItem,
            status: 'PAID',
        }

        delete data.meta_arisan;
        delete data.meta_product;
        delete data.shipping_number;
        delete data.courier;
        await ArisanTransactionModule.updateArisanTransaction(data);

        this.dialogDetail = false;
        this.dialogConfirmation = false;
        this.setInitData();
    }
}
