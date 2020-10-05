import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { ProductModule } from "../../store/modules/product";
import {
    initProductData,
    initRules,
    initProductDetailData,
    initParams
} from "../../common/utils/initialValue";
import { ProductDetailModule } from "../../store/modules/productDetail";
import { ImageModule } from "../../store/modules/image";

@Component({
    name: "CatalogueDetail"
})
export default class CatalogueDetail extends Vue {
    @Prop(Boolean) readonly readonly?: boolean;
    @Prop(String) readonly productId?: string;
    @Prop({ type: Boolean, default: false }) readonly dashboard?: boolean;

    validForm: boolean = false;
    isOpenForm: boolean = false;
    isAddForm: boolean = false;
    dialogDelete: boolean = false;

    form: any = Object.assign({}, { ...initProductData });
    listProductDetail: any = [];

    listProductImage: any = [];
    selectedImage: any = {};

    error: any = Object.assign({}, { ...initProductData });

    rules: any = initRules;
    params: any = initParams;

    get productData() {
        return ProductModule.productData;
    }

    get productDetails() {
        return ProductDetailModule.productDetails;
    }

    get loadingFetchProducts() {
        return ProductModule.loadingFetchProducts;
    }

    get isLoadingAction() {
        return (
            ProductModule.loadingCreateProduct ||
            ProductModule.loadingUpdateProduct ||
            ProductModule.loadingDeleteProduct
        );
    }

    get imageData() {
        return ImageModule.imageData;
    }

    get images() {
        return ImageModule.images;
    }

    get eventSuccessProduct() {
        return ProductModule.eventSuccessProduct;
    }

    get eventSuccessImage() {
        return ImageModule.eventSuccessImage;
    }

    get eventSuccessProductDetail() {
        return ProductDetailModule.eventSuccessProductDetail;
    }

    @Watch("eventSuccessProduct")
    getSuccessStatusProduct() {
        this.listProductImage = [];
        this.selectedImage = {};
        this.listProductDetail = [];
        this.resetForm();
        this.$emit("closeForm");
    }

    @Watch("eventSuccessImage")
    getSuccessStatusImageUpload() {
        this.listProductImage.push(this.imageData.id);
    }

    @Watch("productId")
    getProductId() {
        this.isOpenForm = false;
        this.isAddForm = false;
        this.resetForm();
        this.setInitData();
    }

    @Watch("form.base_price", { deep: true })
    checkPriceDetail() {
        for (const key in this.listProductDetail) {
            this.checkPrice(key);
        }
    }

    @Watch("listProductImage", { deep: true })
    getImage() {
        if (this.listProductImage.length > 0) {
            this.getListImage();
        }
    }

    mounted() {
        this.setInitData();
    }

    setInitData() {
        if (this.productId !== undefined) {
            this.getProductData();
        } else {
            this.listProductImage = [];
            this.listProductDetail = [];
            this.selectedImage = {};
            this.isOpenForm = true;
            this.isAddForm = true;
        }
    }

    async getProductData() {
        const id: any = this.productId;
        await ProductModule.fetchOneProduct(id);
        this.listProductDetail = this.productData.productdetails;
        this.listProductImage = this.productData.image_ids;
        this.form = { ...this.productData };
    }

    addProductDetail() {
        const formDetail: any = Object.assign({}, { ...initProductDetailData });
        this.listProductDetail.push(formDetail);
    }

    removeProductDetail(index: number) {
        this.listProductDetail.splice(index, 1);
    }

    removeProductImage(index: number) {
        this.listProductImage.splice(index, 1);
    }

    checkPrice(index: any) {
        this.listProductDetail[index].price = (
            this.form.base_price / this.listProductDetail[index].periode
        ).toFixed(2);
    }

    async saveForm() {
        const data: any = {
            ...this.form,
            image_ids: this.listProductImage
        };

        const payload: any = this.checkData(data);

        if (payload.id) {
            await ProductModule.updateProduct({
                ...payload,
                productdetails: this.listProductDetail
            });
            this.isOpenForm = false;
        } else {
            await ProductModule.createProduct({
                ...payload,
                productdetails: this.listProductDetail
            });
        }
    }

    async deleteProduct() {
        await ProductModule.deleteProduct(this.productData.id);
        this.dialogDelete = false;
        this.$emit("closeForm");
    }

    async uploadImage(file: any) {
        let data = new FormData();
        data.append("file", file);
        await ImageModule.uploadImage(data);
    }

    async getListImage() {
        const params: any = {
            where_in: this.listProductImage
        };

        await ImageModule.fetchImages(params);

        this.selectedImage = this.images.data[0];
    }

    priviewImage(index: number) {
        this.selectedImage = this.images.data[index];
    }

    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
    }

    closeForm() {
        this.isOpenForm = false;
        this.setInitData();
    }

    checkData(data: any) {
        Object.keys(data).forEach((el: any) => {
            if (
                data[el] === undefined ||
                data[el] === "" ||
                data[el] === "null" ||
                data[el] === null
            ) {
                delete data[el];
            }
        });

        return data;
    }

    resetForm() {
        this.form = Object.assign({}, { initProductData });
        (this.$refs.form as any).reset();
    }

    selectProduct() {
        this.$emit("selectProduct", this.productData);
    }
}
