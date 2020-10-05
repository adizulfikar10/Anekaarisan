import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
    name: "Navigation"
})
export default class Navigation extends Vue {
    items: any[] = [
        {
            icon: "mdi-desktop-mac-dashboard",
            text: "Dashboard",
            route: "/dashboard",
            link: ["dashboard"]
        },
        {
            icon: "mdi-account-box",
            text: "Manajemen User",
            route: "/user",
            link: ["user"]
        },
        {
            icon: "mdi-credit-card",
            text: "Manajemen Transaksi",
            route: "/transaction",
            link: ["transaction"]
        },
        {
            icon: "mdi-wallet-plus-outline",
            text: "Komisi Agen",
            route: "/commission",
            link: ["commission"]
        },
        // {
        //     icon: "mdi-ticket-percent",
        //     text: "Manajemen Promo",
        //     route: "/promo",
        //     link: []
        // },
        {
            icon: "mdi-database",
            text: "Manajemen Produk",
            route: "/product",
            link: ["product", "product-detail", "add-product"]
        },
        {
            icon: "mdi-database",
            text: "Manajemen Arisan",
            route: "/management-arisan",
            link: ["management-arisan"]
        },
        // {
        //     icon: "mdi-file-settings-outline",
        //     text: "Master",
        //     route: "/master",
        //     link: []
        // }
    ];
}
