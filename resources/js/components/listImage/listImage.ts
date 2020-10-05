import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ImageModule } from "../../store/modules/image";
import {
    initParams,
    initRules,
    initImageData
} from "../../common/utils/initialValue";
import { IImageData } from "../../common/interface/image.interface";

@Component({
    name: "ListImage"
})
export default class ListImage extends Vue {
    //properti digunakan jika view dijadikan komponen
    @Prop(String) image?: any;

    params: any = initParams;

    validForm: boolean = false;
    file: boolean = false;
    searchValue: string = "";
    loadData: boolean = true;

    loadingUpload: boolean = false;

    dialogApprove: boolean = false;
    dialogCancel: boolean = false;
    form: any = { ...initImageData };
    rules: any = initRules;

    selectedFile: File | undefined;

    // computed untuk get data dari store
    get images() {
        return ImageModule.images;
    }

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListImage();
    }

    async getListImage() {
        this.params = {
            ...this.params
        };
        await ImageModule.fetchImages(this.params);
        this.loadData = await ImageModule.loadingFetchImages;
    }

    selectFile(file: any) {
        this.selectedFile = file;
        console.log(this.selectedFile);
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
        this.image = data;
        console.log(data);
    }

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
}
