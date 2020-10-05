import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AuthModule } from "../../../store/modules/auth";
import { ArisanModule } from "../../../store/modules/arisan";
import {
    initParams,
    initRules,
    initArisanData
} from "../../../common/utils/initialValue";
import { ArisanMemberModule } from '../../../store/modules/arisanMember';

@Component({
    name: "Wrapper",
    components: {}
})
export default class Wrapper extends Vue {

    @Prop(String) readonly status?: string;

    loadData: boolean = true;
    selected = "";
    id = this.$route.params.id;

    get arisansMembers() {
        return ArisanMemberModule.arisanMembers;
    }

    mounted() {
        this.loadData = true;
        this.getAllData();
        console.log(this.$route.meta.padding)
    }

    async getAllData() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "arisan_id",
                    value: this.$route.params.id
                },
                {
                    field: 'status',
                    value: this.status,
                },
            ]
        };
        ArisanMemberModule.fetchArisanMembers(this.params);
        setTimeout(() => {
            this.loadData = false;
        }, 500);
    }
    selectbarang(selected: string) {
        if (this.status == "1") {
            this.selected = selected;
        }
    }

    count = 0;
    params: any = initParams;
    cards: any[] = [
        { icon: 'mdi-credit-card', text: this.$route.params.id, id: 'mandir', link: [] },
        { icon: 'mdi-credit-card', text: 'BCA', id: 'bca', link: [] },
        { icon: 'mdi-credit-card', text: 'BRI', id: 'bri', link: [] },
        { icon: 'mdi-credit-card', text: 'BNI', id: 'bni', link: [] },
    ];

}
