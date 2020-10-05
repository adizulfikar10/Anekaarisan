import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ProductModule } from "../../store/modules/product";
import { initParams } from "../../common/utils/initialValue";
import CatalogueDetail from "./CatalogueDetail.vue";

@Component({
    name: "Catalogue",
    components: {
        CatalogueDetail
    }
})
export default class Catalogue extends Vue {
    @Prop(Boolean) readonly readonly?: boolean;
    @Prop({ type: Boolean, default: false }) readonly dashboard?: boolean;
    @Prop(Boolean) readonly emit?: boolean;

    searchValue: string = "";
    dialogProduct: boolean = false;
    dialogFilter: boolean = false;
    selectedItem: any = {};
    params: any = initParams;
    sort: string = "";
    priceLowest: number | null = null;
    priceHigest: number | null = null;
    isMobile = this.$vuetify.breakpoint.mobile;

    get products() {
        return ProductModule.products;
    }

    get loadingFetchProducts() {
        return ProductModule.loadingFetchProducts;
    }

    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListProducts();
    }

    async getListProducts() {
        this.params = {
            ...this.params,
            sort: {
                field: "created_at",
                value: "DESC"
            },
            join: "productpromos,productpromos.promo,productdetails"
        };

        await ProductModule.fetchProducts(this.params);
    }

    async searchProduct() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "name",
                    value: this.searchValue
                }
            ]
        };
        await ProductModule.fetchProducts(this.params);

        this.dialogFilter = false;
    }

    onPageChange(newPage: any) {
        this.params = {
            ...this.params,
            page: newPage
        };

        this.getListProducts();
    }

    changeRange() {
        this.params = {
            ...this.params,
            between: {
                field: "base_price",
                min:
                    this.priceLowest !== null
                        ? this.priceLowest?.toString()
                        : "0",
                max: +(this.priceHigest !== null)
                    ? this.priceHigest?.toString()
                    : "0"
            }
        };
    }

    changeSort(value: string) {
        this.sort = value;

        this.params = {
            ...this.params,
            sort: {
                field: "base_price",
                value: value === "HIGEST" ? "DESC" : "ASC"
            }
        };
    }

    openDialogProduct(product?: any) {
        this.dialogProduct = false;

        this.$nextTick(() => {
            this.dialogProduct = true;
        });

        if (product && product.id) {
            this.selectedItem = { ...product };
        } else {
            this.selectedItem = Object.assign({}, {});
        }
    }

    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }

    selectProduct(product: any) {
        // emit u/ lempar data ke komponen parent dengan nama param selectProduct
        this.$emit("selectProduct", product);
    }

    closeForm() {
        this.dialogProduct = false;
        this.getListProducts();
    }
}
