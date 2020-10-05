import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { CommissionModule } from "../../store/modules/commission";
import {
    initParams,
    initRules,
    initCommissionData
} from "../../common/utils/initialValue";
import { ICommissionData } from "../../common/interface/commission.interface";
import { changeFormatNumber } from '../../common/utils/helper';

@Component({
    name: "ListCommission"
})
export default class ListCommission extends Vue {
    //properti digunakan jika view dijadikan komponen
    @Prop(String) readonly status?: string;

    //inisialisasi
    headers: any[] = [
        { text: "Nama", value: "user.name" },
        { text: "Email", value: "user.email" },
        { text: "Telefon/WA", value: "user.phone_number" },
        { text: "Nominal Pengajuan", value: "amount" },
        { text: "Nama Bank", value: "notes" },
        { text: "Nomor Rekening", value: "bank_account" },
        { text: "Action", value: "actions", sortable: false, width: 190 }
    ];
    params: any = initParams;

    validForm: boolean = false;
    searchValue: string = "";
    loadData: boolean = true;
    dialogApprove: boolean = false;
    dialogCancel: boolean = false;
    selectedItem: any = {};
    form: any = { ...initCommissionData };
    rules: any = initRules;

    // computed untuk get data dari store
    get commissions() {
        return CommissionModule.commissions;
    }

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListCommission();
    }

    async getListCommission() {
        this.params = {
            ...this.params,
            join: "user",
            filter: [
                {
                    field: "status",
                    value: this.status
                }
            ]
        };
        await CommissionModule.fetchCommissions(this.params);
        this.loadData = await CommissionModule.loadingFetchCommissions;
    }

    async approveCommission() {
        const data: any = {
            ...this.form,
            status: "APPROVED"
        };
        this.dialogApprove = false;

        const payload: any = this.checkData(data);
        await CommissionModule.updateCommission(payload);
        this.getListCommission();

        const phone: string = changeFormatNumber(data.user.phone_number);
        const message: string = `Hai,${data.user.name}
        %0APencairan komisi anda sebesar *${this.formatMoney(data.amount)} telah dikirim ke nomer rekening *${data.bank_account}*,
        %0ASilahkan cek rekening anda
        %0A%0ATerimakasih, *Aneka Arisan*`;
        window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
        );
    }

    openDialogApprove(data: ICommissionData) {
        this.selectedItem = data;
        this.form = { ...data };
        this.dialogApprove = true;
    }

    openDialogCancel(data: ICommissionData) {
        this.selectedItem = data;
        this.form = { ...data };
        this.dialogCancel = true;
    }

    async cancelCommission() {
        const data: any = {
            ...this.selectedItem,
            status: "WAITING"
        };

        const payload: any = this.checkData(data);

        await CommissionModule.updateCommission(payload);

        this.dialogCancel = false;
        this.getListCommission();
    }

    async searchCommission() {
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
        await CommissionModule.fetchCommissions(this.params);
    }

    onPageChange(newPage: any) {
        this.params = {
            ...this.params,
            page: newPage
        };

        this.getListCommission();
    }

    checkData(data: any) {
        if (data.referral_code === null || data.referral_code === "") {
            delete data.referral_code;
        }

        return data;
    }

    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }
}
