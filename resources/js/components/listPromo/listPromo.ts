import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { PromoModule } from '../../store/modules/promo';
import { initParams, initRules, initPromoData } from '../../common/utils/initialValue';
import { IPromoData } from '../../common/interface/promo.interface';

@Component({
  name: 'ListPromo',
})
export default class ListPromo extends Vue {
  //properti digunakan jika view dijadikan komponen
  @Prop(String) readonly status?: string;

  //inisialisasi
  headers: any[] = [
    { text: 'Nama', value: 'name' },
    { text: 'Diskon', value: 'promo_percent' },
    { text: 'Tanggal Mulai', value: 'date_start' },
    { text: 'Tanggal Selesai', value: 'date_end' },
    { text: 'Status', value: 'status' },
    { text: 'Action', value: 'actions', sortable: false, width: 190 },
  ];
  params: any = initParams;

  validForm: boolean = false;
  searchValue: string = '';
  loadData: boolean = true;
  dialogApprove: boolean = false;
  dialogCancel: boolean = false;
  selectedItem: any = {};
  form: any = { ...initPromoData };
  rules: any = initRules;

  // computed untuk get data dari store
  get promos() {
    return PromoModule.promos;
  }

  // di akses saat pertama membuka view
  mounted() {
    this.setInitData();
  }

  setInitData() {
    this.getListPromo();
  }

  async getListPromo() {
    this.params = {
      ...this.params,
      filter: [
        {
          field: 'status',
          value: this.status,
        },
      ],
    }
    await PromoModule.fetchPromos(this.params);
    this.loadData = await PromoModule.loadingFetchPromos;
  }

  async approvePromo() {
    const data: any = {
      ...this.form,
      status: 'APPROVED'
    };
    this.dialogApprove = false;

    const payload: any = this.checkData(data);
    await PromoModule.updatePromo(payload);
    this.getListPromo();
  }

  openDialogApprove(data: IPromoData) {
    this.selectedItem = data;
    this.form = { ...data };
    this.dialogApprove = true;
  }

  async searchPromo() {
    this.params = {
      ...this.params,
      filter: [
        {
          field: 'status',
          value: this.status,
        },
        {
          field: 'name',
          value: this.searchValue,
        },
      ],
    }
    await PromoModule.fetchPromos(this.params);

  }

  onPageChange(newPage: any) {
    this.params = {
      ...this.params,
      page: newPage,
    };

    this.getListPromo();
  }

  checkData(data: any) {
    if (data.referral_code === null || data.referral_code === '') {
      delete data.referral_code;
    }

    return data;
  }

}
