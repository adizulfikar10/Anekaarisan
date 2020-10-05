import Vue from "vue";
import { Component } from "vue-property-decorator";
import ListBarang from "../../../../components/mobile/listBarang/ListBarang.vue";
import { ArisanMemberModule } from "../../../../store/modules/arisanMember";
import { initParams } from "../../../../common/utils/initialValue";
import { AuthModule } from '../../../../store/modules/auth';
import { ArisanTransactionModule } from '../../../../store/modules/arisanTransaction';

@Component({
    name: "StatusBarang",
    components: {
        ListBarang
    }
})
export default class StatusBarang extends Vue {
    params: any = initParams;
    loadArisan: boolean = true;
    nextRoute: string = "";
    barangID: string = "";

    created() {
        console.log(this.$route.name);
    }

    mounted() {
        this.barangID = this.arisanTransactionData.id;
        console.log("asdsa");
        console.log(this.barangID);

        // this.getBarangInformation();

    }
    // computed untuk get data dari store
    get userid() {
        return AuthModule.id;
    }
    // computed untuk get data dari store
    get arisanTransactions() {
        return ArisanTransactionModule.arisanTransactionData;
    }

    get arisanTransactionData(){
        return ArisanTransactionModule.arisanTransactionData;
    }

    get loadingTransactionArisan() {
        return ArisanTransactionModule.loadingFetchArisanTransactions;
    }

    async getBarangInformation() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: 'id',
                    value: this.barangID,
                },
            ]
        };
        ArisanTransactionModule.fetchArisanTransactions(this.params);
        this.loadArisan = ArisanTransactionModule.loadingFetchArisanTransactions;
        this.loadArisan = false;
    }
}
