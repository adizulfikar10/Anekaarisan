import Vue from "vue";
import { Component } from "vue-property-decorator";
import { SaldoModule } from "../../../store/modules/saldo";
import { AuthModule } from "../../../store/modules/auth";
import { ArisanModule } from "../../../store/modules/arisan";
import { initParams } from "../../../common/utils/initialValue";
import { NoticeModule } from "../../../store/modules/notice";

@Component({
    name: "Dashboard",
    components: {}
})
export default class App extends Vue {
    paramsReminder: any = { ...initParams };

    created() {
        this.getSaldo();
        this.getArisanReminder();
        this.getNotices();
    }

    get username() {
        return AuthModule.name;
    }

    get saldo() {
        return SaldoModule.saldo.saldo;
    }

    get userId() {
        return AuthModule.id;
    }

    async getSaldo() {
        SaldoModule.fetchSaldo(this.userId);
    }

    get arisanReminders() {
        return ArisanModule.arisanReminders;
    }

    get loadingArisanReminders() {
        return ArisanModule.loadingFetchArisans;
    }

    async getArisanReminder() {
        ArisanModule.fetchArisanReminders(this.paramsReminder);
    }

    async selectArisan(arisan: any, menu: string) {
        await ArisanModule.setSelectedArisan(arisan);
        this.$router.push("/mobile/data_arisan/barang");
    }

    async getNotices() {
        await NoticeModule.fetchNotices();
    }

    refresh() {
        this.getSaldo();
        this.getArisanReminder();
        this.getNotices();
    }
}
