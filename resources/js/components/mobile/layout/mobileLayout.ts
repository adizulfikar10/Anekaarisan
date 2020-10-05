import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import { AuthModule } from '../../../store/modules/auth';
import { NoticeModule } from '../../../store/modules/notice';
import Wrapper from "../wrapper/Wrapper.vue";

@Component({
    name: "MobileLayout",
    components: {
        Wrapper
    }
})
export default class MobileLayout extends Vue {
    bottomNav: boolean = false;
    buttonNav = 1;

    menus: any[] = [
        {
            text: "Ubah Password",
            route: "/change-password"
        }
    ];

    navigations: any[] = [
        {
            icon: "mdi-view-grid",
            text: "Dashboard",
            route: "/mobile/dashboard",
            link: ["mobile-dashboard"]
        },
        {
            icon: "mdi-file-multiple",
            text: "Registrasi",
            route: "/mobile/registrasi_arisan",
            link: ["mobile-registrasi-arisan"]
        },
        {
            icon: "mdi-account-multiple",
            text: "Daftar Binaan",
            route: "/mobile/register_binaan",
            link: ["mobile-register-binaan"]
        },
        {
            icon: "mdi-clipboard-check",
            text: "Arisan",
            route: "/mobile/data_arisan",
            link: ["mobile-data-arisan"]
        }
    ];

    get notifications() {
        return NoticeModule.noticeUnreadMessage;
    }

    resetPassword() {
        this.$router.push({ name: "change-password" });
    }

    logout() {
        AuthModule.logout();
        this.$router.push({ name: "home" });
    }

    goBack() {
        if (this.$route.name === 'mobile-status-barang-arisan') {
            this.$router.push({ name: "mobile-barang-arisan" });
        } else {
            this.$router.push({ name: "mobile-dashboard" });
        }
    }
}
