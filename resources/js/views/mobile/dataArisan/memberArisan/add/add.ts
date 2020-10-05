import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { initParams, initRules, initArisanMemberData } from '../../../../../common/utils/initialValue';

@Component({
	name: 'AddMember',
	components: {
		
	}
})
export default class AddMember extends Vue { 
//   form: any = Object.assign({}, { ...initUserData });
    namaMember:string = "";
  rules: any = initRules;

    
}
