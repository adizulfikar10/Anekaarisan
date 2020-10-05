import Vue from "vue";
import { Component } from "vue-property-decorator";
import DatePicker from "../../../../components/datePicker/DatePicker.vue";
import ListImage from "../../../../components/listImage/ListImage.vue";
import ListProductPromo from "../../../../components/listProductPromo/ListProductPromo.vue";
import { ImageModule } from "../../../../store/modules/image";

import {
    initParams,
    initRules,
    initImageData,
    initPromoData
} from "../../../../common/utils/initialValue";
import { IImageData } from "../../../../common/interface/image.interface";
import { PromoModule } from "../../../../store/modules/promo";
import { ProductModule } from "../../../../store/modules/product";
import { ProductPromoModule } from "../../../../store/modules/productPromo";

@Component({
    name: "PromoAdd",
    components: {
        ListImage,
        DatePicker,
        ListProductPromo
    }
})
export default class Add extends Vue {
    start_date = new Date().toISOString().substr(0, 10);
    end_date = new Date().toISOString().substr(0, 10);
    params: any = initParams;
    isAdd = true;

    //image
    file: boolean = false;
    image: any;
    loadingUpload: boolean = false;
    selectedFile: File | undefined;
    selectedImage: any = null;
    dialogUpload: boolean = false;
    //image end

    //product
    headers: any[] = [
        { text: "Nama Barang", value: "name" },
        { text: "Harga", value: "base_price" },
        { text: "Action", value: "actions", sortable: false, width: 190 }
    ];
    selectedProducts: any = [];
    selectedProduct: any = null;
    loadData: boolean = false;
    dialogProduct: boolean = false;
    isRedundant = false;
    //pproduct end

    validForm = false;
    form: any = Object.assign({}, { ...initPromoData });
    rules: any = initRules;
    error: any = Object.assign({}, { ...initPromoData });

    get loadingFetchImages() {
        return ImageModule.loadingFetchImages;
    }

    openDialogMedia() {
        this.getListImage();
        this.dialogUpload = true;
    }

    submit() {


    }

    // computed untuk get data dari store
    get images() {
        return ImageModule.images;
    }

    get products() {
        return ProductModule.products;
    }

    get productData() {
        return PromoModule.promoData;
    }

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.form.date_start = new Date().toISOString().substr(0, 10);
        this.form.date_end = new Date().toISOString().substr(0, 10);
        if (this.$route.params.id != null) {
            this.isAdd = false;
            this.getProductData();
        }
    }

    async getProductData() {
        const producId: string = this.$route.params.id;
        await PromoModule.fetchOnePromo(producId);
        console.log(...this.productData);
        // this.form = { ...this.productData };
    }

    async getListImage() {
        this.params = {
            ...this.params
        };
        await ImageModule.fetchImages(this.params);
        this.loadData = await ImageModule.loadingFetchImages;
    }

    selectFile(file: any) {
        var _this = this;
        this.selectedFile = file;
        console.log(this.selectedFile);
    }

    async savePromo() {
        var id = [this.selectedImage.id];
        var banner_status = "ENABLE";
        if (this.selectedFile == undefined) {
            var id = [];
            var banner_status = "DISABLE";
        }
        const data: any = {
            ...this.form,
            status: "ENABLE",
            banner_status: banner_status,
            image_ids: id
        };
        const payload: any = this.checkData(data);

        await PromoModule.createPromo(payload);
        if (PromoModule.loadingCreatePromo == false) {
            window.history.back();
        }
    }

    async validate() {
        this.loadingUpload = true;
        console.log(this.selectedFile);
        if (this.selectedFile == undefined) {
            console.log("Undefined");
        } else {
            let data = new FormData();
            data.append("name", "my-picture");
            data.append("file", this.selectedFile);
            this.loadingUpload = false;
            await ImageModule.uploadImage(data);
            this.loadingUpload = ImageModule.loadingCreateImage;
            this.getListImage();
        }
    }

    selectImage(data: any) {
        this.selectedImage = data;
        this.dialogUpload = false;
    }

    selectProduct(data: any) {
        this.selectedProduct = data;
        this.isRedundant = this.checkRedundant(data);
        console.log(this.isRedundant);
        if (!this.isRedundant) {
            this.selectedProducts.push(data);
            this.dialogProduct = false;
        }
    }

    // deleteItem(data:any){
    //     const index = this.selectedProducts.indexOf(data, 0);
    //     if (index > -1) {
    //         this.selectedProducts.splice(index, 1);
    //     }
    // }

    async searchImage() {
        this.params = {
            ...this.params
        };
        await ImageModule.fetchImages(this.params);
    }

    checkData(data: any) {
        Object.keys(data).forEach((el: any) => {
            if (
                data[el] === undefined ||
                data[el] === "" ||
                data[el] === null
            ) {
                delete data[el];
            }
        });
        return data;
    }

    checkRedundant(data: any) {
        var isRedundant = false;
        this.selectedProducts.forEach(function (value: any) {
            console.log(value.id + " == " + data.id);
            if (value.id == data.id) {
                isRedundant = true;
            }
        });
        return isRedundant;
    }
}
