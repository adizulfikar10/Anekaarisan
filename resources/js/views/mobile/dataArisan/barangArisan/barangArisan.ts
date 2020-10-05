import Vue from "vue";
import { Component } from "vue-property-decorator";
import ListBarang from "../../../../components/mobile/listBarang/ListBarang.vue";
import Wrapper from "../../../../components/mobile/wrapper/Wrapper.vue";
import { ArisanTransactionModule } from "../../../../store/modules/arisanTransaction";
import {
    initArisanTransactionData,
    initPaymentData,
    initParams,
    initArisanData
} from "../../../../common/utils/initialValue";
import { ArisanModule } from "../../../../store/modules/arisan";

@Component({
    name: "BarangArisan",
    components: {
        Wrapper,
        ListBarang
    }
})
export default class BarangArisan extends Vue {
    items: any = ["TERSEDIA", "PENDING", "DIBAYAR", "DIPROSES", "SELESAI"];
    tab: any = null;
    isLoadTab: boolean = false;
    jumlah = "";
    params: any = initPaymentData;
    alert = false;
    selectedBarang: any;

    mounted() {
        // this.getArisan();
    }

    get arisanData() {
        return ArisanModule.arisanData;
    }

    get loadFetchArisan() {
        return ArisanModule.loadingFetchArisans;
    }

    get loadTransaction() {
        return ArisanTransactionModule.loadingFetchArisanTransactions;
    }

    get TransactionSelected() {
        return ArisanTransactionModule.arisanTransactionData;
    }

    async getArisan() {
        // await ArisanModule.fetchOneArisan(this.arisanData.id);
    }

    changeTab() {
        this.isLoadTab = true;
        this.alert = false;

        setTimeout(() => {
            this.isLoadTab = false;
        }, 1000);
    }

    goBack() {
        this.$router.push({ name: "mobile-data-arisan" });
    }
}
