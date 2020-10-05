import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
    initParams,
    initRules,
    initUserData
} from "../../../common/utils/initialValue";
import indonesia from "territory-indonesia";
import { UserModule } from "../../../store/modules/user";
import { AuthModule } from "../../../store/modules/auth";
import router from "../../../routes";

@Component({
    name: "MobileRegisterAgent"
})
export default class MobileRegisterAgent extends Vue {
    validForm: boolean = false;
    userAgreement: boolean = false;
    searchValue: string = "";
    showPassword: boolean = false;
    showPasswordConfirmation: boolean = false;
    form: any = Object.assign({}, { ...initUserData });
    rules: any = initRules;

    error: any = Object.assign({}, { ...initUserData });
    success: any = Object.assign({}, { ...initUserData });

    provinces: any = [];
    regions: any = [];
    districts: any = [];
    villages: any = [];

    get isLoadingAction() {
        return (
            UserModule.loadingCreateUser ||
            UserModule.loadingUpdateUser ||
            UserModule.loadingDeleteUser
        );
    }

    get users() {
        return UserModule.users;
    }

    get agentCode() {
        return AuthModule.agent_code;
    }

    @Watch("form.province")
    checkProvinceRegion() {
        this.regions = [];
        this.districts = [];
        this.villages = [];
        this.getRegions();
    }

    @Watch("form.region")
    checkRegionDistrict() {
        this.districts = [];
        this.villages = [];
        this.getDistricts();
    }

    @Watch("form.district")
    checkDistrictVillage() {
        this.villages = [];
        this.getVillages();
    }

    mounted() {
        this.getProvinces();
        if (this.$route.name === "mobile-register-binaan") {
            this.getReferralCode();
        }
    }

    getProvinces() {
        indonesia.getAllProvinces().then((res: any) => {
            this.provinces = res;
        });
    }

    getRegions() {
        indonesia
            .getRegenciesOfProvinceName(this.form.province)
            .then((res: any) => {
                this.regions = res;
            });
    }

    getDistricts() {
        indonesia
            .getDistrictsOfRegencyName(this.form.region)
            .then((res: any) => {
                this.districts = res;
            });
    }

    getVillages() {
        indonesia
            .getVillagesOfDistrictName(this.form.district)
            .then((res: any) => {
                this.villages = res;
            });
    }

    getProvinceID() {
        return indonesia
            .getProvinceByName(this.form.province)
            .then((res: any) => {
                return res.id;
            });
    }

    async getReferralCode() {
        await AuthModule.me().then((res: any) => {
            this.form.referral_code = this.agentCode;
        });
    }

    resetForm() {
        this.form = Object.assign({}, { initUserData });
        (this.$refs.form as any).reset();
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

    async registerUser() {
        const data: any = {
            ...this.form,
            // default password
            password: "password",
            confirmPassword: "password",
            status: "WAIT",
            is_active: false,
            role: "agent",
            province_id: await this.getProvinceID()
        };

        const payload: any = this.checkData(data);

        await UserModule.registerUser(payload);
        //this.resetForm();

    }
}
