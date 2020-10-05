import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
// import { IProductData } from "../common/interface/product.interface";
// import { IUserData } from "../common/interface/user.interface";
// import { IArisanData } from "../common/interface/arisan.interface";
// import { IArisanMemberData } from "../common/interface/arisanMember.interface";
// import { IArisanTransactionData } from "../common/interface/arisanTransaction.interface";
// import { IPaymentData } from "../common/interface/payment.interface";
// import { IRoleData } from "../common/interface/role.interface";
// import { IUserRoleData } from "../common/interface/userRole.interface";
// import { IWalletData } from "../common/interface/wallet.interface";
// import { IWithdrawData } from "../common/interface/withdraw.interface";
// import { ISaldoData } from "../common/interface/saldo.interface";
// import { ICategoryData } from "../common/interface/category.interface";

Vue.use(Vuex);

// export interface IRootState {
//     arisan: IArisanData;
//     arisanMember: IArisanMemberData;
//     arisanTransaction: IArisanTransactionData;
//     payment: IPaymentData;
//     product: IProductData;
//     role: IRoleData;
//     user: IUserData;
//     userRole: IUserRoleData;
//     wallet: IWalletData;
//     withdraw: IWithdrawData;
//     saldo: ISaldoData;
//     category: ICategoryData;
// }

//vue persist
const vuexLocal = new VuexPersistence({
    key: "vuex",
    storage: window.localStorage
});

// Declare empty store first, dynamically register all modules later.
const store = new Vuex.Store({
    plugins: [vuexLocal.plugin]
});

export default store;
