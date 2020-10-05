import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import ListArisan from '../../../components/mobile/listArisan/ListArisan.vue'


@Component({
    name: "DataArisan",
    components: {
		ListArisan
	}
})
export default class DataArisan extends Vue {
    menu: string= "";

    mounted(){

        if(this.$route.name == 'mobile-data-arisan'){
            this.menu = 'member'; 
        }else{
            this.menu = 'bayar'; 
        }
    }
    
}
