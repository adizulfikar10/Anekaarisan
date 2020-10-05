import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AuthModule } from "../../../store/modules/auth";
import { ArisanMemberModule } from "../../../store/modules/arisanMember";
import {
    initParams,
    initRules,
    initArisanMemberData
} from "../../../common/utils/initialValue";
import { ArisanModule } from '../../../store/modules/arisan';

@Component({
    name: "ListArisanMember",
    components: {}
})
export default class ListArisanMember extends Vue {
    //Data arisan = member
    //Pembayaran = bayar
    @Prop(String) readonly menu?: string;

    params: any = initParams;
    loadArisan: boolean = true;
    nextRoute: string = "";

    mounted() {
        this.getArisanInformation();
    }

    get arisanData(){
        return ArisanModule.arisanData;
    }
    get userid() {
        return AuthModule.id;
    }
    get arisanMembers() {
        return ArisanMemberModule.arisanMembers;
    }

    async getArisanInformation() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "arisan_id",
                    value: this.arisanData.id
                }
            ]
        };
        await ArisanMemberModule.fetchArisanMembers(this.params);
        this.loadArisan = ArisanMemberModule.loadingFetchArisanMembers;

    }
}
