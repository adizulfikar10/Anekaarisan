import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ListCommission from '../../../components/listCommission/ListCommission.vue'
import { CommissionModule } from '../../../store/modules/commission';

@Component({
	name: 'Commission',
	components: {
		ListCommission
	}
})
export default class Commission extends Vue { 
	items: any = ['LIST REQUEST KOMISI', 'KOMISI TERKIRIM'];
	tab: any = null;
	isLoadTab: boolean = false;

	get loadingFetchCommissions() {
		return CommissionModule.loadingFetchCommissions;
	}

	changeTab() {
		this.isLoadTab = true;

		setTimeout(() => {
			this.isLoadTab = false;
		}, 1000);
	}
}
