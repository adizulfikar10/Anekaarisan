import Vue from "vue";
import { Component } from "vue-property-decorator";
import Navigation from "../Navigation.vue";
import listArisanMember from "../../../../components/mobile/listArisanMember/ListArisanMember.vue";
import { ArisanMemberModule } from "../../../../store/modules/arisanMember";
import { ArisanModule } from "../../../../store/modules/arisan";
import { initParams } from "../../../../common/utils/initialValue";
import { initArisanData } from "../../../../common/utils/initialValue";

@Component({
    name: "MemberArisan",
    components: {
        listArisanMember
    }
})
export default class MemberArisan extends Vue {
    dialogPembatalan: boolean = false;
    params: any = initParams;
    loadingArisan: boolean = true;

    get loadingFetchArisanMembers() {
        return ArisanMemberModule.loadingFetchArisanMembers;
    }

    get arisans() {
        return ArisanModule.arisans;
    }

    get arisanData(){
        return ArisanModule.arisanData;
    }

    mounted() {
        this.getArisan();
    }

    getArisan() {
        const arisan = this.arisans.data;
        let data: any =
            arisan &&
            arisan.find((element: any) => element.id === this.arisanData.id);
        return data;
    }

    async requestCancel() {
        let data: any = this.getArisan();
        data = {
            ...data,
            status: "REQUEST_CANCEL"
        };
        await ArisanModule.updateArisan(data);
        this.dialogPembatalan = false;
        this.$router.go(-1);
    }
}
