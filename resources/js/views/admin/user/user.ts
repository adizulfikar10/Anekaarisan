import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ListUser from '../../../components/listUser/ListUser.vue'
import { UserModule } from '../../../store/modules/user';

@Component({
	name: 'User',
	components: {
		ListUser
	}
})
export default class User extends Vue {
	// inisialisasi awal
	items: any = ['LIST REQUEST AGEN', 'AGEN TERDAFTAR', 'ADMIN'];
	tab: any = null;
	isLoadTab: boolean = false;

	// computed untuk get data dari store
	get loadingFetchUsers() {
		return UserModule.loadingFetchUsers;
	}

	changeTab() {
		this.isLoadTab = true;

		setTimeout(() => {
			this.isLoadTab = false;
		}, 2000);
	}

}
