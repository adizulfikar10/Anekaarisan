import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { UserModule } from "../../store/modules/user";
import {
    initParams,
    initRules,
    initUserData
} from "../../common/utils/initialValue";
import { IUserData } from "../../common/interface/user.interface";
import indonesia from "territory-indonesia";

@Component({
    name: "ListUser"
})
export default class ListUser extends Vue {
    //properti digunakan jika view dijadikan komponen
    @Prop(String) readonly status?: string;
    @Prop(String) readonly role?: string;

    //inisialisasi
    headers: any[] = [
        { text: "Nama", value: "name" },
        { text: "Email", value: "email" },
        { text: "Telefon/WA", value: "phone_number" },
        { text: "Kode Referral", value: "referral_code" },
        { text: "Action", value: "actions", sortable: false, width: 190 }
    ];
    params: any = initParams;

    validForm: boolean = false;
    searchValue: string = "";

    isAdd: boolean = false;
    isEdit: boolean = false;
    dialogReject: boolean = false;
    dialogForm: boolean = false;
    showPassword: boolean = false;
    showPasswordConfirmation: boolean = false;
    selectedItem: any = {};
    form: any = Object.assign({}, { ...initUserData });
    rules: any = initRules;

    error: any = Object.assign({}, { ...initUserData });

    provinces: any = [];
    regions: any = [];
    districts: any = [];
    villages: any = [];

    // computed untuk get data dari store
    get users() {
        return UserModule.users;
    }

    get isLoadingAction() {
        return (
            UserModule.loadingCreateUser ||
            UserModule.loadingUpdateUser ||
            UserModule.loadingDeleteUser
        );
    }

    @Watch("form.password_confirmation")
    checkPassword() {
        if (this.form.password !== this.form.password_confirmation) {
            this.error = {
                ...this.error,
                password_confirmation: "Password tidak sama"
            };
        } else {
            this.error = {
                ...this.error,
                password_confirmation: ""
            };
        }
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

    // di akses saat pertama membuka view
    mounted() {
        this.setInitData();
    }

    setInitData() {
        this.getListUsers();
        this.getProvinces();
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

    async getListUsers() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                }
            ],
            join: "roles",
            where_roles: this.role
        };
        await UserModule.fetchUsers(this.params);
    }

    async rejectUser() {
        const data: any = {
            ...this.selectedItem,
            is_active: false,
            status: "REJECT"
        };

        const payload: any = this.checkData(data);

        await UserModule.updateUser(payload);

        this.dialogReject = false;
        this.getListUsers();

        const phone: string = this.changeFormatNumber(data.phone_number);
        const message: string = `Hai,${data.name}
    %0AMohon maaf proses pendaftaran agen Aneka Arisan belum bisa dilanjutkan dikarenakan data tidak valid.
    %0ASilahkan mendaftar ulang dan masukan data anda yang valid.
    %0A%0ATerimakasih, *Aneka Arisan*`;
        window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
        );
    }

    async approveUser() {
        const data: any = {
            ...this.form,
            is_active: true,
            status: "APPROVED",
            role: this.role
        };

        const payload: any = this.checkData(data);

        await UserModule.updateUser(payload);

        await UserModule.resetPassword(payload);

        const phone: string = this.changeFormatNumber(data.phone_number);
        const message: string = `Hai,${data.name}
        %0AAkun anda disetujui,
        %0ABerikut informasi akun anda untuk mengakses aplikasi aneka arisan :
        %0A*email:${data.email}*
        %0A*password:${data.password}*.
        %0AUntuk menjaga keamanan segera lakukan perubahan password anda.
        %0A%0ATerimakasih, *Aneka Arisan*`;
        window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
        );

        this.resetForm();
        this.getListUsers();
    }

    openDialogApprove(data: IUserData) {
        this.form = { ...data };
        this.dialogForm = true;
    }

    addUser() {
        this.isAdd = true;
        this.dialogForm = true;
    }

    async createUser() {
        const data: any = {
            ...this.form,
            status: "APPROVED",
            is_active: true,
            role: this.role,
            province_id: await this.getProvinceID()
        };

        const payload: any = this.checkData(data);

        await UserModule.createUser(payload);

        const phone: string = this.changeFormatNumber(data.phone_number);
        const message: string = `Hai,${data.name}
        %0AAkun anda disetujui,
        %0ABerikut informasi akun anda untuk mengakses aplikasi aneka arisan :
        %0A*email:${data.email}*
        %0A*password:${data.password}*.
        %0AUntuk menjaga keamanan segera lakukan perubahan password anda.
        %0A%0ATerimakasih, *Aneka Arisan*`;
        window.open(
            `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
        );

        this.resetForm();
        this.getListUsers();
    }

    getProvinceID() {
        return indonesia
            .getProvinceByName(this.form.province)
            .then((res: any) => {
                return res.id;
            });
    }

    editUser(data: IUserData) {
        this.form = { ...data };
        this.dialogForm = true;
        this.isEdit = true;
    }

    async updateUser() {
        const data: any = {
            ...this.form
        };

        const payload: any = this.checkData(data);

        await UserModule.updateUser(payload);

        if (data.password) {
            await UserModule.resetPassword(payload);

            const phone: string = this.changeFormatNumber(data.phone_number);
            const message: string = `Hai,${data.name}
      %0AAkun anda berhasil di reset,
      %0ABerikut informasi akun anda untuk mengakses aplikasi aneka arisan:
      %0A*email:${data.email}*
      %0A*password:${data.password}*.
      %0AUntuk menjaga keamanan segera lakukan perubahan password anda.
      %0A%0ATerimakasih, *Aneka Arisan*`;
            window.open(
                `https://api.whatsapp.com/send?phone=${phone}&text=${message}`
            );
        }

        this.resetForm();
        this.getListUsers();
    }

    async searchUser() {
        this.params = {
            ...this.params,
            filter: [
                {
                    field: "status",
                    value: this.status
                },
                {
                    field: "name",
                    value: this.searchValue
                }
            ],
            join: "roles",
            where_roles: this.role
        };
        await UserModule.fetchUsers(this.params);
    }

    onPageChange(newPage: any) {
        this.params = {
            ...this.params,
            page: newPage
        };

        this.getListUsers();
    }

    resetForm() {
        this.dialogForm = false;
        this.isEdit = false;
        this.isAdd = false;
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

    changeFormatNumber(no: string) {
        const charLength = no.length;
        if (no.charAt(0) === "0") {
            return "+62" + no.substring(1, charLength);
        } else {
            return no;
        }
    }
}
