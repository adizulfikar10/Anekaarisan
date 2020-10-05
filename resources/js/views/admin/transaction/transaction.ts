import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { ArisanTransactionModule } from '../../../store/modules/arisanTransaction';
import ListArisanTransaction from '../../../components/listArisanTransaction/ListArisanTransaction.vue'


@Component({
	name: 'Transaction',
	components: {
		ListArisanTransaction
	}
})
export default class Transaction extends Vue {
	// inisialisasi awal
	items: any = ['WAIT PAYMENT', 'PAID', 'SENDING', 'FINISH'];
	tab: any = null;
	isLoadTab: boolean = false;

	// computed untuk get data dari store
	get loadingFetchArisanTransactions() {
		return ArisanTransactionModule.loadingFetchArisanTransactions;
	}

	changeTab() {
		this.isLoadTab = true;

		setTimeout(() => {
			this.isLoadTab = false;
		}, 2000);
	}
}
