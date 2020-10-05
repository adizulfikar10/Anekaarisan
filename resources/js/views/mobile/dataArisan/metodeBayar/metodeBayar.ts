import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AuthModule } from "../../../../store/modules/auth";
import { ArisanModule } from "../../../../store/modules/arisan";
import {
    initParams,
    initRules,
    initArisanData
} from "../../../../common/utils/initialValue";
import { ArisanTransactionModule } from "../../../../store/modules/arisanTransaction";

@Component({
    name: "MetodeBayar",
    components: {}
})
export default class MetodeBayar extends Vue {
    cards: any[] = [
        { icon: "mdi-credit-card", text: "Mandiri", id: "mandir", link: [] },
        { icon: "mdi-credit-card", text: "BCA", id: "bca", link: [] },
        { icon: "mdi-credit-card", text: "BRI", id: "bri", link: [] },
        { icon: "mdi-credit-card", text: "BNI", id: "bni", link: [] }
    ];
}
