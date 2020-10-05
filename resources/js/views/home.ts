import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Catalogue from "../components/catalogue/Catalogue.vue";
import Wrapper from "../components/mobile/wrapper/Wrapper.vue";
import { ProductModule } from "../store/modules/product";
import { initParams } from "../common/utils/initialValue";
import { CategoryModule } from "../store/modules/category";
import { AuthModule } from '../store/modules/auth';
import html2pdf from 'html2pdf.js';


@Component({
    name: "Home",
    components: {
        Catalogue,
        Wrapper
    }
})
export default class Home extends Vue {
    colors = [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4"
    ];
    slides = ["First", "Second", "Third", "Fourth", "Fifth"];

    dialogProduct: boolean = false;
    isMobile = this.$vuetify.breakpoint.mobile;

    get product() {
        return ProductModule.productData;
    }
    get products() {
        return ProductModule.products;
    }

    get loadingProducts() {
        return ProductModule.loadingFetchProducts;
    }

    get categories() {
        return CategoryModule.categories;
    }

    get loadingCategories() {
        return CategoryModule.loadingFetchCategory;
    }

    get auth() {
        return AuthModule.id;
    }

    get role() {
        return AuthModule.roles[0];
    }


    mounted() {
        if (this.product.name === "" && this.$route.params.id) {
            this.getProduct(this.$route.params.id);
        }
        this.getProducts(1);
        this.getCategory();
    }

    async getProduct(id: string) {
        await ProductModule.fetchOneProduct(id);
    }

    async getProducts(page: number) {
        const params = {
            ...initParams,
            loadMore: true,
            join: "productpromos.promo",
            page: page
        };
        await ProductModule.fetchProducts(params);
    }

    async selectProduct(id: string) {
        await ProductModule.selectOneProduct(id);
        this.dialogProduct = true;

        // this.$router.push({ path: "/product/" + id });
    }

    loadMore() {
        const page = this.products.current_page + 1;
        this.getProducts(page);
    }

    async getCategory() {
        const params = {
            ...initParams,
            per_page: 7,
            filter: [
                {
                    field: "parent_id",
                    value: "null"
                }
            ]
        };
        await CategoryModule.fetchCategories(params);
    }


    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }

    exportToPDF() {
        html2pdf(this.$refs.document, {
            margin: 1,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { dpi: 192, letterRendering: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
    }
}
