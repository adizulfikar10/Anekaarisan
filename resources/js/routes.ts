import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./views/Home.vue";
import NotFoundPage from "./views/NotFoundPage.vue";
import Login from "./views/auth/Login.vue";

//Mobile Route
import MobileDashboard from "./views/mobile/dashboard/Dashboard.vue";
import MobileDataArisan from "./views/mobile/dataArisan/DataArisan.vue";
import MobileMemberArisan from "./views/mobile/dataArisan/memberArisan/memberArisan.vue";
import MobileAddMemberArisan from "./views/mobile/dataArisan/memberArisan/add/Add.vue";
import MobileBarangArisan from "./views/mobile/dataArisan/barangArisan/BarangArisan.vue";
import MobileMetodeBayar from "./views/mobile/dataArisan/metodeBayar/MetodeBayar.vue";
import MobilePembayaran from "./views/mobile/dataArisan/pembayaran/Pembayaran.vue";
import MobileRequest from "./views/mobile/requestWallet/RequestWallet.vue";
import MobileRequestResult from "./views/mobile/requestWallet/requestResult/RequestWalletResult.vue";
import User from "./views/admin/user/User.vue";
import Transaction from "./views/admin/transaction/Transaction.vue";
import Commission from "./views/admin/commission/Commission.vue";
import Product from "./views/admin/product/Product.vue";
import ProductDetail from "./views/admin/product/ProductDetail.vue";
import Master from "./views/admin/master/Master.vue";
import Dashboard from "./views/admin/dashboard/Dashboard.vue";
import Arisan from "./views/admin/arisan/Arisan.vue";
import Promo from "./views/admin/promo/Promo.vue";
import PromoAdd from "./views/admin/promo/add/Add.vue";
import ChangePassword from "./views/admin/user/change-password/ChangePassword.vue";
import { AuthModule } from "./store/modules/auth";
import { getToken, getLoginDate } from "./common/utils/cookie";
import MobileRegisterAgent from "./views/mobile/register/RegisterAgent.vue";
import RegistrasiArisan from "./views/mobile/registrasiArisan/RegistrasiArisan.vue";
import MobileStatusBarang from "./views/mobile/dataArisan/barangArisan/StatusBarang.vue";
import MobileRegisterAgentSuccess from "./views/mobile/registerSuccess/RegisterAgentSuccess.vue";
import Notification from "./views/mobile/notification/Notification.vue";
//response snap
import MobileSnapFinish from "./views/mobile/snapResponse/Finish.vue";
import MobileSnapError from "./views/mobile/snapResponse/Error.vue";
import CatalogueView from "./views/CatalogueView.vue";

Vue.use(VueRouter);

class RouteMeta {
    title: string;
    requiredAuth?: boolean;
    roles?: any[];
    bottomNav?: boolean;

    constructor({
        title,
        requiredAuth,
        roles,
        bottomNav
    }: {
        title: string;
        requiredAuth?: boolean;
        roles?: any[];
        bottomNav?: boolean;
    }) {
        this.title = title;
        this.requiredAuth = requiredAuth;
        this.roles = roles;
        this.bottomNav = bottomNav;
    }
}

export const routes: any[] = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/catalogue",
        name: "catalogue-view",
        component: CatalogueView
    },
    {
        path: "/product/:id",
        name: "Produk",
        component: Home
    },
    /* #region  route admin */
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: new RouteMeta({
            title: "dashboard",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/user",
        name: "user",
        component: User,
        meta: new RouteMeta({
            title: "user",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/transaction",
        name: "transaction",
        component: Transaction,
        meta: new RouteMeta({
            title: "transaction",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/commission",
        name: "commission",
        component: Commission,
        meta: new RouteMeta({
            title: "commission",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/product",
        name: "product",
        component: Product,
        meta: new RouteMeta({
            title: "product",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/product-detail/:id",
        name: "product-detail",
        component: ProductDetail,
        meta: new RouteMeta({
            title: "product-detail",
            requiredAuth: false,
            roles: []
            // roles: ["ADMIN"]
        })
    },
    {
        path: "/add-product",
        name: "add-product",
        component: ProductDetail,
        meta: new RouteMeta({
            title: "add-product",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/master",
        name: "master",
        component: Master,
        meta: new RouteMeta({
            title: "master",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    /* #promo routes begin */
    {
        path: "/promo",
        name: "promo",
        component: Promo,
        meta: new RouteMeta({
            title: "promo",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/promo_add",
        name: "add_promo",
        component: PromoAdd,
        meta: new RouteMeta({
            title: "add_promo",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/change-password",
        name: "change-password",
        component: ChangePassword,
        meta: new RouteMeta({
            title: "Ubah Password",
            requiredAuth: true,
            roles: ["ADMIN", "AGENT"]
        })
    },
    {
        path: "/promo_detail/:id",
        name: "detail_promo",
        component: PromoAdd,
        meta: new RouteMeta({
            title: "detail_promo",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    {
        path: "/management-arisan",
        name: "management_arisan",
        component: Arisan,
        meta: new RouteMeta({
            title: "management_arisan",
            requiredAuth: true,
            roles: ["ADMIN"]
        })
    },
    /* #promo routes end */

    /* #endregion */

    /* #region  not found page */
    {
        path: "/404-not-found",
        name: "404-not-found",
        component: NotFoundPage
    },
    /* #endregion */

    /* #region routes mobile */
    {
        path: "/mobile/dashboard",
        name: "mobile-dashboard",
        component: MobileDashboard,
        meta: new RouteMeta({
            title: "Aneka Arisan",
            requiredAuth: true,
            bottomNav: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/register_binaan",
        name: "mobile-register-binaan",
        component: MobileRegisterAgent,
        meta: new RouteMeta({
            title: "Registrasi Binaan",
            requiredAuth: true,
            roles: ["AGENT"],
            bottomNav: false
        })
    },
    {
        path: "/mobile/register",
        name: "mobile-register",
        component: MobileRegisterAgent,
        meta: new RouteMeta({
            title: "Registrasi Agen",
            requiredAuth: false,
            // roles: ["AGENT"],
            bottomNav: false
        })
    },
    {
        path: "/mobile/register_success",
        name: "mobile-register-success",
        component: MobileRegisterAgentSuccess,
        meta: new RouteMeta({
            title: "Registrasi Berhasil",
            requiredAuth: false,
            bottomNav: false
        })
    },
    {
        path: "/mobile/data_arisan",
        name: "mobile-data-arisan",
        component: MobileDataArisan,
        meta: new RouteMeta({
            title: "Data Arisan",
            requiredAuth: true,
            roles: ["AGENT"],
            bottomNav: true
        })
    },
    {
        path: "/mobile/pembayaran_arisan",
        name: "mobile-pembayaran-arisan",
        component: MobileDataArisan,
        meta: new RouteMeta({
            title: "Data Arisan",
            requiredAuth: true,
            roles: ["AGENT"],
            bottomNav: true
        })
    },
    {
        path: "/mobile/data_arisan/member",
        name: "mobile-member-arisan",
        component: MobileMemberArisan,
        meta: new RouteMeta({
            title: "Member Arisan",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/member_arisan/add",
        name: "mobile-add-member-arisan",
        component: MobileAddMemberArisan,
        meta: new RouteMeta({
            title: "Tambah Anggota",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/data_arisan/barang",
        name: "mobile-barang-arisan",
        component: MobileBarangArisan,
        meta: new RouteMeta({
            title: "Barang Arisan",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/data_arisan/barang/status",
        name: "mobile-status-barang-arisan",
        component: MobileStatusBarang,
        meta: new RouteMeta({
            title: "Status Barang",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/payment-finish",
        name: "mobile-payment-finish",
        component: MobileSnapFinish,
        meta: new RouteMeta({
            title: "Informasi Tagihan",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/payment-error",
        name: "mobile-payment-error",
        component: MobileSnapError,
        meta: new RouteMeta({
            title: "Transaksi Gagal",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/metode_bayar",
        name: "mobile-metode-bayar",
        component: MobileMetodeBayar,
        meta: new RouteMeta({
            title: "Pilih Metode Pembayaran",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/pembayaran",
        name: "mobile-pembayaran",
        component: MobilePembayaran,
        meta: new RouteMeta({
            title: "Selesaikan Transaksi",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/request",
        name: "mobile-request",
        component: MobileRequest,
        meta: new RouteMeta({
            title: "Pencairan Wallet",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/request-result",
        name: "mobile-request-result",
        component: MobileRequestResult,
        meta: new RouteMeta({
            title: "Hasil Pengajuan Penarikan",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/registrasi_arisan",
        name: "mobile-registrasi-arisan",
        component: RegistrasiArisan,
        meta: new RouteMeta({
            title: "Registrasi Arisan",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    },
    {
        path: "/mobile/notifications",
        name: "mobile-notifications",
        component: Notification,
        meta: new RouteMeta({
            title: "Notifikasi",
            requiredAuth: true,
            roles: ["AGENT"]
        })
    }
    /* #endregion */
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    const local = localStorage.vuex;
    const getAuth =
        local != undefined ? JSON.parse(local).AuthModule : AuthModule;

    const expiredToken =
        getToken() !== undefined ? JSON.parse(getToken()).expires_in : 0;

    const routeMeta = to.meta as RouteMeta;
    const dateNow = new Date();
    const loginDate = new Date(getLoginDate());
    const dateDiff = (dateNow.getTime() - loginDate.getTime()) / 1000;

    if (routeMeta.roles !== undefined) {
        if (expiredToken !== 0 && dateDiff < expiredToken) {
            if (
                dateDiff >= expiredToken - 500 ||
                getAuth.id === "" ||
                AuthModule.id === ""
            ) {
                await AuthModule.refresh();
                await AuthModule.me();
            }
            const getUserRole =
                getAuth && getAuth.roles[0]
                    ? getAuth.roles[0].name.toUpperCase()
                    : "";
            if (routeMeta.roles.includes(getUserRole)) {
                next();
            } else {
                next({ name: "404-not-found" });
            }
        } else {
            AuthModule.resetToken();
            next({ name: "login" });
        }
    } else {
        if ((getAuth.id || expiredToken !== 0) && to.name === "login") {
            AuthModule.resetToken();
            AuthModule.logout();
            next({ name: "home" });
        } else if (expiredToken !== 0) {
            await AuthModule.refresh();
            await AuthModule.me();
            next();
        } else {
            next();
        }
    }
});

export default router;
