import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { UserModule } from "../../../../store/modules/user";
import { initRules } from "../../../../common/utils/initialValue";
import { AuthModule } from '../../../../store/modules/auth';

@Component({
    name: "ChangePassaword"
})
export default class Add extends Vue {
    currentPassword: string = '';
    password: string = '';
    passwordConfirmation: string = '';
    successMessage: string = '';
    validForm: boolean = false;
    show: boolean = false;
    show1: boolean = false;
    show2: boolean = false;
    rules: any = initRules;

    alert: boolean = false;
    alertMessage: any = {};
    typeAlert: boolean = false;

    get LoadingSubmit() {
        return UserModule.loadingChangePassword;
    }

    get eventErrorUser() {
        return UserModule.eventErrorUser;
    }

    get eventSuccessUser() {
        return UserModule.eventSuccessUser;
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
    async submit() {
        await UserModule.changePassword({
            id: AuthModule.id,
            current_password: this.currentPassword,
            password: this.password,
            password_confirmation: this.passwordConfirmation
        });

        location.reload();
    }
}
