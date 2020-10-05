import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Navigation from "./Navigation.vue";
import Wrapper from "../components/mobile/wrapper/Wrapper.vue";
import MobileLayout from "../components/mobile/layout/MobileLayout.vue";
import { AuthModule } from "../store/modules/auth";
import { UserModule } from "../store/modules/user";
import { ProductModule } from "../store/modules/product";
import { ArisanModule } from "../store/modules/arisan";
import { ArisanMemberModule } from "../store/modules/arisanMember";
import { ArisanTransactionModule } from "../store/modules/arisanTransaction";
import { CategoryModule } from "../store/modules/category";
import { CommissionModule } from "../store/modules/commission";
import { ImageModule } from "../store/modules/image";
import { PaymentModule } from "../store/modules/payment";
import { ProductDetailModule } from "../store/modules/productDetail";
import { ProductPromoModule } from "../store/modules/productPromo";
import { PromoModule } from "../store/modules/promo";
import { RequestWalletModule } from "../store/modules/requestWallet";
import { RoleModule } from "../store/modules/role";
import { SaldoModule } from "../store/modules/saldo";
import { UserRoleModule } from "../store/modules/userRole";
import { WalletModule } from "../store/modules/wallet";
import { WithdrawModule } from "../store/modules/withdraw";
import jsPDF from 'jspdf';
import { initParams } from '../common/utils/initialValue';

@Component({
    name: "App",
    components: {
        Navigation,
        MobileLayout,
        Wrapper
    }
})
export default class App extends Vue {
    drawer: any = null;
    bottomNav: boolean = false;
    buttonNav = 1;

    alert: boolean = true;
    alertMessage: any = {};
    typeAlert: boolean = true;

    doc: jsPDF = new jsPDF("p", "pt", "a4");
    countRendered = 0;

    get product() {
        return ProductModule.productData;
    }
    get products() {
        return ProductModule.products;
    }

    get loadingProducts() {
        return ProductModule.loadingFetchProducts;
    }
    //---

    get eventSuccessUser() {
        return UserModule.eventSuccessUser;
    }

    get eventErrorUser() {
        return UserModule.eventErrorUser;
    }

    get eventSuccessProduct() {
        return ProductModule.eventSuccessProduct;
    }

    get eventErrorProduct() {
        return ProductModule.eventErrorProduct;
    }

    get eventSuccessArisan() {
        return ArisanModule.eventSuccessArisan;
    }

    get eventErrorArisan() {
        return ArisanModule.eventErrorArisan;
    }

    get eventSuccessArisanMember() {
        return ArisanMemberModule.eventSuccessArisanMember;
    }

    get eventErrorArisanMember() {
        return ArisanMemberModule.eventErrorArisanMember;
    }

    get eventSuccessArisanTransaction() {
        return ArisanTransactionModule.eventSuccessArisanTransaction;
    }

    get eventErrorArisanTransaction() {
        return ArisanTransactionModule.eventErrorArisanTransaction;
    }

    get eventSuccesCategory() {
        return CategoryModule.eventSuccessCategory;
    }

    get eventErroCategory() {
        return CategoryModule.eventErrorCategory;
    }

    get eventSuccesCommission() {
        return CommissionModule.eventSuccessCommission;
    }

    get eventErroCommission() {
        return CommissionModule.eventErrorCommission;
    }

    get eventSuccesImage() {
        return ImageModule.eventSuccessImage;
    }

    get eventErrorImage() {
        return ImageModule.eventErrorImage;
    }

    get eventSuccesPayment() {
        return PaymentModule.eventSuccessPayment;
    }

    get eventErroPayment() {
        return PaymentModule.eventErrorPayment;
    }

    get eventSuccesProductDetail() {
        return ProductDetailModule.eventSuccessProductDetail;
    }

    get eventErroProductDetail() {
        return ProductDetailModule.eventErrorProductDetail;
    }

    get eventSuccesProductPromo() {
        return ProductPromoModule.eventSuccessProductPromo;
    }

    get eventErroProductPromo() {
        return ProductPromoModule.eventErrorProductPromo;
    }

    get eventSuccesPromo() {
        return PromoModule.eventSuccessPromo;
    }

    get eventErroPromo() {
        return PromoModule.eventErrorPromo;
    }

    // get eventSuccessRequestWallet() {
    //     return RequestWalletModule.eventSuccessRequestWallet;
    // }

    // get eventErroRequestWallet() {
    //     return RequestWalletModule.eventErrorRequestWallet;
    // }

    get eventSuccesRole() {
        return RoleModule.eventSuccessRole;
    }

    get eventErroRole() {
        return RoleModule.eventErrorRole;
    }

    get eventSuccesSaldo() {
        return SaldoModule.eventSuccessSaldo;
    }

    get eventErroSaldo() {
        return SaldoModule.eventErrorSaldo;
    }

    get eventSuccesUserRole() {
        return UserRoleModule.eventSuccessUserRole;
    }

    get eventErroUserRole() {
        return UserRoleModule.eventErrorUserRole;
    }

    get eventSuccesWallet() {
        return WalletModule.eventSuccessWallet;
    }

    get eventErroWallet() {
        return WalletModule.eventErrorWallet;
    }

    get eventSuccesWithdraw() {
        return WithdrawModule.eventSuccessWithdraw;
    }

    get eventErroWithdraw() {
        return WithdrawModule.eventErrorWithdraw;
    }

    get eventSuccessRequestWallet() {
        return RequestWalletModule.eventSuccessRequestWallet;
    }

    get eventErrorRequestWallet() {
        return RequestWalletModule.eventErrorRequestWallet;
    }

    get auth() {
        return AuthModule.id;
    }

    @Watch("eventSuccessUser")
    showEventSuccessUser() {
        if (this.eventSuccessUser && this.eventSuccessUser.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccessUser;
        }
    }

    @Watch("eventErrorUser")
    showEventErrorUser() {
        if (this.eventErrorUser && this.eventErrorUser.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorUser;
        }
    }

    @Watch("eventSuccessProduct")
    showEventSuccessProduct() {
        if (this.eventSuccessProduct && this.eventSuccessProduct.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccessProduct;
        }
    }

    @Watch("eventErrorProduct")
    showEventErrorProduct() {
        if (this.eventErrorProduct && this.eventErrorProduct.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorProduct;
        }
    }

    @Watch("eventSuccessArisan")
    showEventSuccessArisan() {
        if (this.eventSuccessArisan && this.eventSuccessArisan.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccessArisan;
        }
    }

    @Watch("eventErrorArisan")
    showEventErrorArisan() {
        if (this.eventErrorArisan && this.eventErrorArisan.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorArisan;
        }
    }

    @Watch("eventSuccessArisanMember")
    showEventSuccessArisanMember() {
        if (
            this.eventSuccessArisanMember &&
            this.eventSuccessArisanMember.message
        ) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccessArisanMember;
        }
    }

    @Watch("eventErrorArisanMember")
    showEventErrorArisanMember() {
        if (
            this.eventErrorArisanMember &&
            this.eventErrorArisanMember.message
        ) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorArisanMember;
        }
    }

    @Watch("eventSuccessArisanTransaction")
    showEventSuccessArisanTransaction() {
        if (
            this.eventSuccessArisanTransaction &&
            this.eventSuccessArisanTransaction.message
        ) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventSuccessArisanTransaction;
        }
    }

    @Watch("eventErrorArisanTransaction")
    showEventErrorArisanTransaction() {
        if (
            this.eventErrorArisanTransaction &&
            this.eventErrorArisanTransaction.message
        ) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorArisanTransaction;
        }
    }

    @Watch("eventSuccesCategory")
    showEventSuccessCategory() {
        if (this.eventSuccesCategory && this.eventSuccesCategory.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesCategory;
        }
    }

    @Watch("eventErrorCategory")
    showEventErrorCategory() {
        if (this.eventErroCategory && this.eventErroCategory.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroCategory;
        }
    }

    @Watch("eventSuccesCommission")
    showEventSuccessCommission() {
        if (this.eventSuccesCommission && this.eventSuccesCommission.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesCommission;
        }
    }

    @Watch("eventErrorCommission")
    showEventErrorCommission() {
        if (this.eventErroCommission && this.eventErroCommission.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroCommission;
        }
    }

    @Watch("eventSuccesImage")
    showEventSuccessImage() {
        if (this.eventSuccesImage && this.eventSuccesImage.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesImage;
        }
    }

    @Watch("eventErrorImage")
    showEventErrorImage() {
        if (this.eventErrorImage && this.eventErrorImage.data) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorImage.data;
        }
    }

    @Watch("eventSuccesPayment")
    showEventSuccessPayment() {
        if (this.eventSuccesPayment && this.eventSuccesPayment.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesPayment;
        }
    }

    @Watch("eventErrorPayment")
    showEventErrorPayment() {
        if (this.eventErroPayment && this.eventErroPayment.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroPayment;
        }
    }

    @Watch("eventSuccesProductDetail")
    showEventSuccessProductDetail() {
        if (
            this.eventSuccesProductDetail &&
            this.eventSuccesProductDetail.message
        ) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesProductDetail;
        }
    }

    @Watch("eventErrorProductDetail")
    showEventErrorProductDetail() {
        if (
            this.eventErroProductDetail &&
            this.eventErroProductDetail.message
        ) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroProductDetail;
        }
    }

    @Watch("eventSuccesProductPromo")
    showEventSuccessProductPromo() {
        if (
            this.eventSuccesProductPromo &&
            this.eventSuccesProductPromo.message
        ) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesProductPromo;
        }
    }

    @Watch("eventErrorProductPromo")
    showEventErrorProductPromo() {
        if (this.eventErroProductPromo && this.eventErroProductPromo.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroProductPromo;
        }
    }

    @Watch("eventSuccesPromo")
    showEventSuccessPromo() {
        if (this.eventSuccesPromo && this.eventSuccesPromo.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesPromo;
        }
    }

    @Watch("eventErrorPromo")
    showEventErrorPromo() {
        if (this.eventErroPromo && this.eventErroPromo.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroPromo;
        }
    }

    @Watch("eventSuccessRequestWallet")
    showEventSuccessRequestWallet() {
        if (
            this.eventSuccessRequestWallet &&
            this.eventSuccessRequestWallet.message
        ) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccessRequestWallet;
        }
    }

    @Watch("eventErrorRequestWallet")
    showEventErrorRequestWallet() {
        if (
            this.eventErrorRequestWallet &&
            this.eventErrorRequestWallet.message
        ) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErrorRequestWallet;
        }
    }

    @Watch("eventSuccesRole")
    showEventSuccessRole() {
        if (this.eventSuccesRole && this.eventSuccesRole.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesRole;
        }
    }

    @Watch("eventErrorRole")
    showEventErrorRole() {
        if (this.eventErroRole && this.eventErroRole.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroRole;
        }
    }

    @Watch("eventSuccesSaldo")
    showEventSuccessSaldo() {
        if (this.eventSuccesSaldo && this.eventSuccesSaldo.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesSaldo;
        }
    }

    @Watch("eventErrorSaldo")
    showEventErrorSaldo() {
        if (this.eventErroSaldo && this.eventErroSaldo.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroSaldo;
        }
    }

    @Watch("eventSuccesUserRole")
    showEventSuccessUserRole() {
        if (this.eventSuccesUserRole && this.eventSuccesUserRole.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesUserRole;
        }
    }

    @Watch("eventErrorUserRole")
    showEventErrorUserRole() {
        if (this.eventErroUserRole && this.eventErroUserRole.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroUserRole;
        }
    }

    @Watch("eventSuccesWallet")
    showEventSuccessWallet() {
        if (this.eventSuccesWallet && this.eventSuccesWallet.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesWallet;
        }
    }

    @Watch("eventErrorWallet")
    showEventErrorWallet() {
        if (this.eventErroWallet && this.eventErroWallet.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroWallet;
        }
    }

    @Watch("eventSuccesWithdraw")
    showEventSuccessWithdraw() {
        if (this.eventSuccesWithdraw && this.eventSuccesWithdraw.message) {
            this.alert = true;
            this.typeAlert = true;
            this.alertMessage = this.eventSuccesWithdraw;
        }
    }

    @Watch("eventErrorWithdraw")
    showEventErrorWithdraw() {
        if (this.eventErroWithdraw && this.eventErroWithdraw.message) {
            this.alert = true;
            this.typeAlert = false;
            this.alertMessage = this.eventErroWithdraw;
        }
    }

    menus: any[] = [
        // {
        //     text: "Ubah Profil",
        //     route: "/mobile/dashboard"
        // },
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

    resetPassword() {
        this.$router.push({ name: "change-password" });
    }

    logout() {
        AuthModule.logout();
        this.$router.push({ name: "home" });
    }

    goBack() {
        this.$router.go(-1);
    }

    async getProducts() {
        const params = {
            ...initParams,
            loadMore: true,
            join: "productpromos.promo"
        };
        await ProductModule.fetchProducts(params);
    }
    printPDF() {
        this.doc.setFillColor(245, 245, 245);
        let pdfName = "test";
        let width = this.doc.internal.pageSize.width;
        let height = this.doc.internal.pageSize.height;
        let i = 0;
        let posx = this.toPoint(2);
        let posy = this.toPoint(2);
        for (i = 0; i < this.products.data.length; i++) {
            let image =
                this.products.data[i].images != null
                    ? this.products.data[i].images[0].path
                    : "";
            this.drawCard(
                i,
                posx,
                posy,
                image,
                this.products.data[i].name,
                this.products.data[i].base_price
            );
            if ((i + 1) % 3 == 0) {
                posx = this.toPoint(2);
                posy += this.toPoint(10);
            } else {
                posx += this.toPoint(6);
            }
        }

        // doc.save(pdfName + '.pdf');
        // var string = this.doc.output('datauristring');
        // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
        // var x = window.open();
        // x?.document.open();
        // x?.document.write(embed);
        // x?.document.close();
    }

    toPoint(cm: number): number {
        return cm / 0.0352778;
    }

    drawCard(
        iterasi: number,
        posX: number,
        posY: number,
        image: string,
        name: string,
        price: number
    ) {
        this.doc.setDrawColor(230,230,230)
        this.doc.setFillColor(255, 255, 255)
        this.doc.roundedRect(posX, posY, this.toPoint(5.5), this.toPoint(8),this.toPoint(0.3), this.toPoint(0.3), 'D')
        let posNameX = posX + this.toPoint(0.5);
        let posNameY = posY + this.toPoint(5.5);
        this.doc.setTextColor(0, 0, 0)
        let lineName = this.doc.setFont('Helvetica', '')
        .setFontSize(12)
        .splitTextToSize(name, this.toPoint(5.4))
        this.doc.text(lineName ,posNameX,posNameY)

        let posPriceX = posNameX;
        let posPriceY = posNameY + this.doc.getTextDimensions(lineName).h + this.toPoint(0.2);

        this.doc.setTextColor(239, 178, 30)
        let linePrice = this.doc.setFont('Helvetica', '')
        .setFontSize(12)
        .splitTextToSize("Rp. "+price.toLocaleString(), this.toPoint(5.4))
        this.doc.text(linePrice ,posPriceX,posPriceY)

        this.toDataURL(image, posX, posY, iterasi);

    }

    toDataURL(url: string, posX: number, posY: number, iterasi: number) {
        let imageurl = window.location.origin + url;
        var xhr = new XMLHttpRequest();
        let doc = this.doc;
        let _this = this;
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                let image =
                    reader.result == null ? "" : reader.result.toString();

                if (url != null && url != "") {
                    doc.addImage(
                        image,
                        "JPEG",
                        100,
                        100,
                        100,
                        100,
                        "GATAU",
                        undefined,
                        0
                    );
                }
                _this.countRendered++;
                if (_this.countRendered == _this.products.data.length) {
                    _this.save();
                    console.log(_this.countRendered);
                }
                // let data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQIAAAAwCAIAAAB16OMVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGZWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA5LTIwVDE2OjEzOjE2KzA3OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA5LTIwVDE2OjEzOjE2KzA3OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOS0yMFQxNjoxMzoxNiswNzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5OGY4NGVlMC00NzAwLTA4NGUtOGE4Ny05NWU2MmRkMGJjOTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkNWY1MTZhZS01ZDI4LWFmNDktOGJlMy0xNTRhMzljY2E1OGUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5NzFjMzllMC1jMzBmLWQ2NDEtOThmZC01YzM3MjcyMzVhOTIiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NzFjMzllMC1jMzBmLWQ2NDEtOThmZC01YzM3MjcyMzVhOTIiIHN0RXZ0OndoZW49IjIwMjAtMDktMjBUMTY6MTM6MTYrMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OThmODRlZTAtNDcwMC0wODRlLThhODctOTVlNjJkZDBiYzkwIiBzdEV2dDp3aGVuPSIyMDIwLTA5LTIwVDE2OjEzOjE2KzA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iQW5la2EgQXJpc2FuIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJBbmVrYSBBcmlzYW4iLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp+xOCoAAA4kSURBVHic7Zx9TBRnGsCfZWGX3eGjgIuirV288aOuSrg7s0KJ2AMi3sVAUzT0Ak3a1SxgQm3vki7NmcZrLCQ1PWNSKvG4Ji1pjay5teYsRtY7DFH32tMgUCGsBsUP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"
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", imageurl);
        xhr.responseType = "blob";
        xhr.send();
    }

    save() {
        // var string = this.doc.output("datauristring");
        // var embed = "<embed width='100%' height='100%' src='" + string + "'/>";
        // var x = window.open();
        // x?.document.open();
        // x?.document.write(embed);
        // x?.document.close();
        this.doc.save("Catalogue" + '.pdf');

    }
}
