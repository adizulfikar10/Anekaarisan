import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Catalogue from '../../../components/catalogue/Catalogue.vue';
import { ProductModule } from '../../../store/modules/product';

@Component({
	name: 'Product',
	components: {
		Catalogue
	}
})
export default class Product extends Vue {

	get loadingFetchProducts() {
		return ProductModule.loadingFetchProducts;
	}
}
