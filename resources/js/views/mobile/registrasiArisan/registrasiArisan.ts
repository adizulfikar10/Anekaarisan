import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import {
    initArisanData,
    initRules,
    initArisanMemberData
} from "../../../common/utils/initialValue";
import moment from "moment";
import Catalogue from "../../../components/catalogue/Catalogue.vue";
import Wrapper from "../../../components/mobile/wrapper/Wrapper.vue";
import { ArisanMemberModule } from "../../../store/modules/arisanMember";
import { AuthModule } from "../../../store/modules/auth";

@Component({
    name: "registrasiArisan",
    components: {
        Catalogue,
        Wrapper
    }
})
export default class registrasiArisan extends Vue {
    validForm: boolean = false;
    dialogForm: boolean = false;
    dialogProduct: boolean = false;
    validAnggota: boolean = false;

    rules: any = initRules;

    form: any = Object.assign({}, { ...initArisanData });
    error: any = Object.assign({}, { ...initArisanData });

    formAnggota: {} = Object.assign({}, { ...initArisanMemberData });
    selectedIndex: number = 0;
    errorAnggota: {} = Object.assign({}, { ...initArisanMemberData });
    listAnggota: any[] = [];

    @Watch("listAnggota", { deep: true })
    checkListAnggota() {
    }

    mounted() {
        console.log("ini");
    }

    countAnggota() {
        if (
            Number(this.form.duration) >= 5 &&
            Number(this.form.duration) <= 10
        ) {
            this.listAnggota = [];
            for (let index = 0; index < Number(this.form.duration); index++) {
                this.listAnggota.push(this.formAnggota);
            }
            this.countDate();
        } else {
            this.listAnggota = [];
            this.form = {
                ...this.form,
                end_date: null
            };
        }
    }

    countDate() {
        if (this.form.start_date !== null) {
            const res = moment(this.form.start_date)
                .add(this.form.duration - 1, "months")
                .calendar();
            this.form = {
                ...this.form,
                end_date: moment(res).format("YYYY-MM-DD")
            };
        }
    }

    openDialog(index: number, data?: any) {
        this.dialogForm = true;
        this.selectedIndex = index;
        if (data) {
            this.formAnggota = { ...data };
        }
    }

    closeDialog() {
        this.dialogForm = false;
    }

    submitAnggota() {
        this.listAnggota[this.selectedIndex] = { ...this.formAnggota };
        this.countNominal();
        this.dialogForm = false;

        const even = (element: any) => element.name !== '' && element.product_id !== '';
        this.validAnggota = this.listAnggota.every(even);

    }

    countNominal() {
        let totalFund: number = 0;
        let averageFund: number = 0;
        this.listAnggota.forEach((el: any) => {
            totalFund += Number(
                el.meta_product.id ? el.meta_product.base_price : 0
            );
            averageFund +=
                Number(el.meta_product.id ? el.meta_product.base_price : 0) /
                this.form.duration;
        });

        this.form = {
            ...this.form,
            total_funds: totalFund,
            average_funds: averageFund
        };
    }

    selectProduct(data: any) {
        this.formAnggota = {
            ...this.formAnggota,
            meta_product: data,
            product_id: data.id
        };

        this.dialogProduct = false;
    }

    async submit() {
        const modifyAnggota = this.listAnggota.map((el: any) => {
            return {
                ...el,
                status: true,
                meta_product: el.meta_product
            };
        });

        // const endDate = new Date(this.form.end_date);

        const arisan = {
            ...this.form,
            status: "PROGRESS",
            user_id: AuthModule.id,
            arisanmembers: modifyAnggota
        };

        const fixData: any = this.checkData(arisan);

        await ArisanMemberModule.createArisanAndArisanMembers(fixData);

        this.$router.push({ name: 'mobile-dashboard' });
    }

    formatMoney(nominal: number) {
        return "Rp" + nominal.toLocaleString("id-ID");
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
}
