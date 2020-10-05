import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import CatalogueDetail from '../../../components/catalogue/CatalogueDetail.vue';
import { ProductModule } from '../../../store/modules/product';

@Component({
	name: 'Product',
	components: {
		CatalogueDetail
	}
})
export default class Product extends Vue {

	get loadingFetchProducts() {
		return ProductModule.loadingFetchProducts;
	}
}
