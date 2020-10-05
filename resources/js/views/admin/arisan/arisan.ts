import Vue from "vue";
import { Component } from "vue-property-decorator";
import listArisan from "../../../components/listArisan/listArisan.vue";
import { ArisanModule } from '../../../store/modules/arisan';

@Component({
    name: "Arisan",
    components: {
        listArisan
    }
})
export default class Commission extends Vue {
    items: any = ["LIST ARISAN", "REQUEST PEMBATALAN", "LIST ARISAN BATAL"];
    tab: any = null;
    isLoadTab: boolean = false;

    get loadingFetchArisans() {
        return ArisanModule.loadingFetchArisans;
    }

    changeTab() {
        this.isLoadTab = true;

        setTimeout(() => {
            this.isLoadTab = false;
        }, 1000);
    }
}
