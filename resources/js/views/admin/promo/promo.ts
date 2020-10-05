import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ListPromo from '../../../components/listPromo/ListPromo.vue'
import { PromoModule } from '../../../store/modules/promo';

@Component({
	name: 'Promo',
	components: {
		ListPromo
	}
})
export default class Promo extends Vue { 

	get loadingFetchPromos() {
		return PromoModule.loadingFetchPromos;
	}

}
