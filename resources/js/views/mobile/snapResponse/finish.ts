import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import { dateTimeTransaction } from '../../../common/format/date';
import { MidtransModule } from '../../../store/modules/midtrans';


@Component({
    name: "Finish",
})
export default class Finish extends Vue {

    order : any = {};

    mounted(){
        const orderid : string = this.$route.query.order_id.toString() 
        this.getOrderStatus(orderid);
    }

    get orderStatus(){
        return MidtransModule.statusOrder
    }

    get loading(){
        return MidtransModule.loading
    }

    async getOrderStatus(order_id : string) {
        await MidtransModule.getStatusOrderMidtrans(order_id);
        
        this.order = {
            ...this.orderStatus,
            transaction_time : dateTimeTransaction(new Date(this.orderStatus.transaction_time), 'LONG')
        }
    }

}
