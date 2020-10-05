import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AuthModule } from "../../../store/modules/auth";
import { ArisanModule } from "../../../store/modules/arisan";
import {
    initParams,
    initRules,
    initArisanData
} from "../../../common/utils/initialValue";

@Component({
    name: "ListArisan",
    components: {}
})
export default class ListArisan extends Vue {
    //Data arisan = member
    //Pembayaran = bayar
    @Prop(String) readonly menu?: string;

    params: any = initParams;
    nextRoute: string = "";
    paramsReminder: any = { ...initParams };

    mounted() {
        if (this.$route.name == "mobile-data-arisan") {
            this.nextRoute = "/mobile/member_arisan";
        } else {
            this.nextRoute = "/mobile/barang_arisan";
        }
        this.getArisan();

    }

    // computed untuk get data dari store
    get userid() {
        return AuthModule.id;
    }
    // computed untuk get data dari store
    get arisans() {
        return ArisanModule.arisans;
    }

    get arisanData() {
        return ArisanModule.arisanData;
    }

    get loadArisan() {
        return ArisanModule.loadingFetchArisans;
    }

    async getArisan() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "user_id",
                    value: this.userid
                }
            ]
        };
        await ArisanModule.fetchArisans(this.params);
    }

    async selectArisan(arisan: any, menu: string) {
        await ArisanModule.setSelectedArisan(arisan);
        if (menu == "barang") {
            this.$router.push("/mobile/data_arisan/barang");
        } else {
            this.$router.push("/mobile/data_arisan/member");
        }
    }

}
