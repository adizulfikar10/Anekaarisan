import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import { login, logout, me, refresh } from "../../common/api/auth";
import { IAuth, IAuthState } from "../../common/interface/auth.interface";
import {
    getToken,
    removeToken,
    setToken,
    getLoginDate,
    setLoginDate,
    removeLoginDate
} from "../../common/utils/cookie";
import store from "../../store";
import { initAuth } from "../../common/utils/initialValue";

@Module({
    dynamic: true,
    store,
    name: "AuthModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Auth extends VuexModule implements IAuthState {
    token =
        (getToken() !== undefined ? JSON.parse(getToken()).access_token : "") ||
        "";
    // token = getToken() || '';
    name = "";
    roles: string[] = [];
    email = "";
    id = "";
    agent_code = "";
    userData = {};
    token_expired =
        (getToken() !== undefined ? JSON.parse(getToken()).expires_in : 0) || 0;
    // token_expired = getToken() || 0;
    login_date = getLoginDate() || new Date();
    rto: boolean = false;

    @Action
    async login(data: IAuth) {
        try {
            const { phone_number, password } = data;
            const res: any = await login({ phone_number, password });
            setToken(res);
            setLoginDate(new Date());
            this.SET_TOKEN(res.access_token);
            this.SET_EXPIRED(res.expires_in);
        } catch (err) {
            console.info(err);
        }
    }

    @Action
    async me() {
        try {
            const res: any = await me();
            this.SET_USER(res);
        } catch (err) { }
    }

    @Action
    async refresh() {
        try {
            const res: any = await refresh();
            setToken(res);
            setLoginDate(new Date());
            this.SET_TOKEN(res.access_token);
            this.SET_EXPIRED(res.expires_in);
        } catch (err) {
            console.info(err);
        }
    }

    @Action
    resetToken() {
        removeToken();
        removeLoginDate();
        this.SET_TOKEN("");
    }

    @Action
    async logout() {
        localStorage.removeItem("vuex");
        removeToken();
        removeLoginDate();
        this.SET_USER(initAuth);
        this.SET_TOKEN("");
        await logout();
    }

    @Mutation
    SET_TOKEN(token: string) {
        this.token = token;
    }

    @Mutation
    SET_EXPIRED(expires: number) {
        this.token_expired = expires;
        this.login_date = new Date();
    }

    @Mutation
    SET_USER(payload: any) {
        this.id = payload.id;
        this.name = payload.name;
        this.email = payload.email;
        this.roles = payload.roles;
        this.agent_code = payload.agent_code;
        this.userData = payload;
    }
}

export const AuthModule = getModule(Auth);
