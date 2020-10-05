import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import { AuthModule } from "../../../../store/modules/auth";
import { ArisanModule } from "../../../../store/modules/arisan";
import { initParams, initRules, initArisanData } from '../../../../common/utils/initialValue';


@Component({
    name: "Pembayaran",
    components: {
	}
})
export default class Pembayaran extends Vue {
   
}
