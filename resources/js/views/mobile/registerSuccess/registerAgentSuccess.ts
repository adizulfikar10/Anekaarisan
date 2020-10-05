import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
    initParams,
    initRules,
    initUserData
} from "../../../common/utils/initialValue";
import indonesia from "territory-indonesia";
import { UserModule } from "../../../store/modules/user";
import { AuthModule } from "../../../store/modules/auth";

@Component({
    name: "MobileRegisterAgentSuccess"
})
export default class MobileRegisterAgentSuccess extends Vue {

}
