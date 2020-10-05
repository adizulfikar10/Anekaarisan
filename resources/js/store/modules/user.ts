import { IUserState, IUserData } from "../../common/interface/user.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchUsers,
    createUser,
    registerUser,
    updateUser,
    deleteUser,
    resetPassword,
    changePassword
} from "../../common/api/user";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initUserData
} from "../../common/utils/initialValue";
import router from "../../routes";
import { AuthModule } from './auth';

@Module({
    dynamic: true,
    store,
    name: "UserModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class User extends VuexModule implements IUserState {
    users: any = { ...initResult };
    userData: any = { ...initUserData };
    loadingFetchUsers: boolean = false;
    loadingCreateUser: boolean = false;
    loadingUpdateUser: boolean = false;
    loadingDeleteUser: boolean = false;
    loadingChangePassword: boolean = false;
    eventErrorUser: any = {};
    eventSuccessUser: any = {};

    /* #region Action */
    @Action
    async fetchUsers(params: IParams) {
        try {
            this.SET_LOADING_FETCH_USER(true);
            const res: any = await fetchUsers(params);
            if (res) {
                this.SET_LOADING_FETCH_USER(false);
                this.SET_USERS(res);
            } else {
                this.SET_LOADING_FETCH_USER(false);
                this.SET_USERS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_USER(false);
            this.SET_USERS(initResult);
            this.SET_ERROR_USER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneUser(params: IParams) {
        try {
            this.SET_LOADING_FETCH_USER(true);
            const res: any = await fetchUsers(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_USER(false);
                this.SET_USER_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_USER(false);
                this.SET_USER_DATA(initUserData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_USER(false);
            this.SET_USER_DATA(initUserData);
            this.SET_ERROR_USER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createUser(payload: IUserData) {
        try {
            this.SET_LOADING_CREATE_USER(true);
            const res: any = await createUser(payload);
            this.SET_LOADING_CREATE_USER(false);
            this.SET_USER_DATA(res.data);
            this.SET_SUCCESS_USER({
                statusCode: res.status,
                statusText: res.statusText,
                message: "User berhasil dibuat"
            });
        } catch (error) {
            this.SET_LOADING_CREATE_USER(false);
            this.SET_ERROR_USER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async registerUser(payload: IUserData) {
        try {
            this.SET_LOADING_CREATE_USER(true);
            const res: any = await registerUser(payload);
            this.SET_LOADING_CREATE_USER(false);
            this.SET_USER_DATA(res.data);
            this.SET_SUCCESS_USER({
                statusCode: res.status,
                statusText: res.statusText,
                message: "Berhasil membuat user"
            });
            await router.push("/mobile/register_success");
        } catch (error) {
            this.SET_LOADING_CREATE_USER(false);
            this.SET_ERROR_USER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateUser(data: any) {
        try {
            this.SET_LOADING_UPDATE_USER(true);
            const res = await updateUser(data.id, data);

            this.SET_LOADING_UPDATE_USER(false);
            this.SET_USER_DATA(res.data);
            this.SET_SUCCESS_USER({
                statusCode: res.status,
                statusText: res.statusText,
                message: "Data user berhasil diperbarui"
            });
        } catch (error) {
            this.SET_LOADING_UPDATE_USER(false);
            this.SET_ERROR_USER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async resetPassword(data: any) {
        try {
            this.SET_LOADING_UPDATE_USER(true);
            const res = await resetPassword(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_USER(false);
                this.SET_USER_DATA(res.data);
                this.SET_SUCCESS_USER({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "Kata sandi berhasil diperbarui"
                });
            } else {
                this.SET_LOADING_UPDATE_USER(false);
                this.SET_USER_DATA(initUserData);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_USER(false);
            this.SET_ERROR_USER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteUser(event_id: string) {
        try {
            this.SET_LOADING_DELETE_USER(true);

            const res = await deleteUser(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_USER(false);
                this.SET_SUCCESS_USER({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: "User berhasil dihapus"
                });
            } else {
                this.SET_LOADING_DELETE_USER(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_USER(false);
            this.SET_ERROR_USER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async changePassword(data: any) {
        try {
            this.CLEAN_ACTION_USER();
            this.SET_LOADING_CHANGE_PASSWORD(true);
            const res = await changePassword(data.id, data);
            if (res) {
                this.SET_LOADING_CHANGE_PASSWORD(false);
                this.SET_SUCCESS_USER({
                    data: {
                        statusCode: res.status,
                        statusText: res.statusText,
                        message: "Password berhasil diperbarui"
                    }
                });

                AuthModule.resetToken();
            } else {
                this.SET_LOADING_CHANGE_PASSWORD(false);
                this.SET_USER_DATA(initUserData);
            }
        } catch (error) {
            this.SET_LOADING_CHANGE_PASSWORD(false);
            this.SET_ERROR_USER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_USER(payload: boolean) {
        this.loadingFetchUsers = payload;
    }

    @Mutation
    SET_LOADING_CREATE_USER(payload: boolean) {
        this.loadingCreateUser = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_USER(payload: boolean) {
        this.loadingUpdateUser = payload;
    }

    @Mutation
    SET_LOADING_DELETE_USER(payload: boolean) {
        this.loadingDeleteUser = payload;
    }

    @Mutation
    SET_LOADING_CHANGE_PASSWORD(payload: boolean) {
        this.loadingChangePassword = payload;
    }

    @Mutation
    SET_USERS(payload: IResult) {
        this.users = { ...payload };
    }

    @Mutation
    SET_USER_DATA(payload: IUserData) {
        this.userData = { ...payload };
    }

    @Mutation
    SET_ERROR_USER(payload: any) {
        this.eventErrorUser = payload;
    }

    @Mutation
    SET_SUCCESS_USER(payload: any) {
        this.eventSuccessUser = payload;
    }

    @Mutation
    CLEAN_ACTION_USER() {
        this.eventErrorUser = { ...initSuccessState };
        this.eventSuccessUser = { ...initErrorState };
    }
    /* #endregion */
}

export const UserModule = getModule(User);
