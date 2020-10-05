import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ProductPromoModule } from '../../store/modules/productPromo';
import { initParams, initRules, initProductPromoData } from '../../common/utils/initialValue';
import { IProductPromoData } from '../../common/interface/productPromo.interface';
import Catalogue from "../catalogue/Catalogue.vue";


@Component({
  name: 'ListProductPromo',
  components: {
    // import catalog
    Catalogue,
  }
})
export default class ListProductPromo extends Vue {
  //properti digunakan jika view dijadikan komponen
  @Prop(String) readonly status?: string;


  //inisialisasi
  headers: any[] = [
    { text: 'Nama', value: 'product_id' },
    { text: 'Harga', value: 'promo_id' },
    { text: 'Action', value: 'actions', sortable: false, width: 190 },
  ];
  params: any = initParams;

  validForm: boolean = false;
  searchValue: string = '';
  loadData: boolean = true;
  dialogDelete: boolean = false;
  selectedItem: any = {};
  form: any = { ...initProductPromoData };
  rules: any = initRules;

  modalCatalogue: boolean = false;
  listProduct: any[] = [];

  // computed untuk get data dari store
  get productPromos() {
    return ProductPromoModule.productPromos;
  }

  // di akses saat pertama membuka view
  mounted() {
    this.setInitData();
  }

  setInitData() {
    this.getListProductPromo();
  }

  async getListProductPromo() {
    this.params = {
      ...this.params,
    }
    await ProductPromoModule.fetchProductPromos(this.params);
    this.loadData = await ProductPromoModule.loadingFetchProductPromos;
  }

  async openDialogDelete(data: IProductPromoData) {
    await ProductPromoModule.deleteProductPromo(data.id);
    this.dialogDelete = true;
  }


  async searchProductPromo() {
    this.params = {
      ...this.params,
      filter: [
        {
          field: 'name',
          value: this.searchValue,
        },
      ],
    }
    await ProductPromoModule.fetchProductPromos(this.params);

  }

  onPageChange(newPage: any) {
    this.params = {
      ...this.params,
      page: newPage,
    };

    this.getListProductPromo();
  }

  checkData(data: any) {
    if (data.referral_code === null || data.referral_code === '') {
      delete data.referral_code;
    }

    return data;
  }

  pilihBarang(data: any) {
    this.listProduct.push(data);
    this.modalCatalogue = false;
  }

}
