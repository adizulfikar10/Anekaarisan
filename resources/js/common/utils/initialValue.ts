import {
    IErrorState,
    ISuccessState,
    IResult
} from "../interface/app.interface";
import { IProductData } from "../interface/product.interface";
import { IArisanData } from "../interface/arisan.interface";
import { IArisanMemberData } from "../interface/arisanMember.interface";
import { IArisanTransactionData } from "../interface/arisanTransaction.interface";
import { IRoleData } from "../interface/role.interface";
import { IUserData } from "../interface/user.interface";
import { IUserRoleData } from "../interface/userRole.interface";
import { IWalletData } from "../interface/wallet.interface";
import { IWithdrawData } from "../interface/withdraw.interface";
import { ICommissionData } from "../interface/commission.interface";
import { IPaymentData } from "../interface/payment.interface";
import { IPromoData } from "../interface/promo.interface";
import { IProductDetailData } from "../interface/productDetail.interface";
import { IImageData } from "../interface/image.interface";
import { IProductPromoData } from "../interface/productPromo.interface";
import { IRequestWalletData } from "../interface/requestWallet.interface";
import { ISaldoData } from "../interface/saldo.interface";
import { ICategoryData } from "../interface/category.interface";

export const initErrorState: IErrorState = {
    statusCode: 0,
    statusText: "",
    message: ""
};

export const initSuccessState: ISuccessState = {
    statusCode: 0,
    statusText: "",
    message: ""
};

export const initResult: IResult = {
    count: 0,
    data: [],
    page: 1,
    pageCount: 1,
    total: 0
};

export const initArisanData: IArisanData = {
    sequence_code: "",
    duration: 0,
    start_date: null,
    end_date: null,
    total_funds: 0,
    average_funds: 0,
    status: "",
    user_id: ""
};

export const initArisanMemberData: IArisanMemberData = {
    name: "",
    product_id: "",
    arisan_id: "",
    status: "",
    meta_product: {}
};

export const initArisanTransactionData: IArisanTransactionData = {
    arisan_id: "",
    payment_id: "",
    payment_amount: "",
    meta_arisan: {},
    meta_product: {},
    status: "",
    shipping_number: "",
    courier: ""
};

export const initPaymentData: IPaymentData = {
    id: "",
    meta: ""
};

export const initProductData: IProductData = {
    name: "",
    base_price: 0,
    commision: 0,
    image_ids: [],
    description: ""
};

export const initProductDetailData: IProductDetailData = {
    product_id: "",
    price: 0,
    periode: 0
};

export const initRoleData: IRoleData = {
    role: ""
};

export const initUserData: IUserData = {
    name: "",
    phone_number: "",
    email: "",
    password: "",
    province: "",
    district: "",
    village: "",
    street: "",
    region: "",
    status: true,
    referral_code: "",
    agent_code: ""
};

export const initUserRoleData: IUserRoleData = {
    user_id: "",
    role_id: ""
};

export const initWalletData: IWalletData = {
    user_id: "",
    amount: 0,
    status: ""
};

export const initWithdrawData: IWithdrawData = {
    user_id: "",
    amount: 0,
    date: null,
    status: ""
};

export const initRules = {
    empty: (v: any) => !!v || "Tidak boleh kosong",
    email: (v: any) => /.+@.+/.test(v) || "Format email salah",
    phone: (v: any) =>
        /^[0-9]{9,13}$/.test(v) || "Format Nomor telfon, (9-13 character)",
    password: (v: any) =>
        /^.{6,}$/.test(v) || "Password harus berisi setidaknya 6 karakter",
    number: (v: any) => /\d/.test(v) || "Format angka salah",
    percent: (v: any) => v <= 100 || "Persentase maksimal 3 digit",
    minmax: (v: any) => (v <= 10 && v >= 5) || "Minimal 5 Maksimal 10 Bulan"
};

export const initAuth = {
    email: "",
    name: "",
    token: "",
    roles: [],
    id: ""
};

export const initParams = {
    page: 1,
    per_page: 10,
    filter: [],
    join: "",
    sort: {}
};

export const initCommissionData: ICommissionData = {
    id: "",
    user_id: "",
    amount: 0,
    status: "",
    category: "",
    bank_account: "",
    notes: "",
    meta_transaction: {}
};

export const initPromoData: IPromoData = {
    id: "",
    name: "",
    status: "",
    banner_status: "",
    date_start: "",
    date_end: "",
    promo_percent: 0,
    image_ids: []
};

export const initImageData: IImageData = {
    id: "",
    name: "",
    ext: "",
    size: 0,
    path: "",
    uploaded_by: ""
};

export const initProductPromoData: IProductPromoData = {
    id: "",
    promo_id: "",
    product_id: ""
};

export const initRequestWalletData: IRequestWalletData = {
    id: "",
    user_id: "",
    amount: 0,
    status: "",
    category: "",
    bank_account: "",
    notes: "",
    meta_transaction: {}
};

export const initSaldoData: ISaldoData = {
    id: "",
    user_id: "",
    saldo: 0
};

export const initCategoryData: ICategoryData = {
    id: "",
    parent_id: "",
    name: ""
};
