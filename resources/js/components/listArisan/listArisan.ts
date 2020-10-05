import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ArisanModule } from "../../store/modules/arisan";
import {
    initParams,
    initRules,
    initArisanData
} from "../../common/utils/initialValue";
import { changeFormatNumber } from '../../common/utils/helper';

@Component({
    name: "ListArisan"
})
export default class ListArisan extends Vue {
    //properti digunakan jika view dijadikan komponen
    @Prop(String) readonly status?: string;

    //inisialisasi
    headers: any[] = [
        { text: "Kode Arisan", value: "sequence_code" },
        { text: "Tanggal Mulai", value: "start_date" },
        { text: "Tanggal Selesai", value: "end_date" },
        { text: "Iuran/Bulan", value: "average_funds" },
        { text: "Total Dana", value: "total_funds" },
        { text: "Action", value: "actions", sortable: false, width: 190 }
    ];
    params: any = initParams;

    validForm: boolean = false;
    searchValue: string = "";
    loadData: boolean = true;
    dialogReject: boolean = false;
    dialogDetailArisan: boolean = false;
    dialogCancelReject: boolean = false;
    selectedItem: any = {};
    form: any = { ...initArisanData };
    rules: any = initRules;
    arisanDetailData: any = {};


    // computed untuk get data dari store
    get arisans() {
        return ArisanModule.arisans;
    }

    get isLoadingAction() {
        return ArisanModule.loadingUpdateArisan;
    }

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListArisan();
    }

    async getListArisan() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                }
            ],
            join: "arisantransactions,arisanmembers,user",
        };

        await ArisanModule.fetchArisans(this.params);
        this.loadData = await ArisanModule.loadingFetchArisans;
    }



    async searchArisan() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                },
                {
                    field: "sequence_code",
                    value: this.searchValue
                }
            ],
        };
        await ArisanModule.fetchArisans(this.params);
    }

    onPageChange(newPage: any) {
        this.params = {
            ...this.params,
            page: newPage
        };

        this.getListArisan();
    }

    openDialogReject(item: any) {
        this.selectedItem = item;
        this.dialogReject = true;
    }

    openDialogCancelReject(item: any) {
        this.selectedItem = item;
        this.dialogCancelReject = true;
    }


    async rejectArisan() {
        const data: any = {
            ...this.selectedItem,
            status: "CANCELED"
        };

        const payload: any = this.checkData(data);

        await ArisanModule.updateArisan(payload);

        this.dialogReject = false;
        this.getListArisan();

        const phone: string = changeFormatNumber(data.user.phone_number);
        const message: string = `Hai,${data.user.name}
        %0AArisan anda dengan kode arisan *${data.sequence_code} telah disetujui untuk *Dibatalkan*,
        %0A%0ATerimakasih, *Aneka Arisan*`;
        window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
        );
    }

    async activeArisan() {
        const data: any = {
            ...this.selectedItem,
            status: "PROGRESS"
        };

        const payload: any = this.checkData(data);

        await ArisanModule.updateArisan(payload);

        this.dialogCancelReject = false;

        this.getListArisan();
    }

    showArisanDetail(data: any) {
        this.dialogDetailArisan = true;
        this.arisanDetailData = Object.assign({}, { ...data });
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

    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }

}
