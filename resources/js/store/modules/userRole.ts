import {
    IUserRoleState,
    IUserRoleData
} from "../../common/interface/userRole.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchUserRoles,
    createUserRole,
    updateUserRole,
    deleteUserRole
} from "../../common/api/userRole";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initUserRoleData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "UserRoleModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class UserRole extends VuexModule implements IUserRoleState {
    userRoles: any = { ...initResult };
    userRoleData: any = { ...initUserRoleData };
    loadingFetchUserRoles: boolean = false;
    loadingCreateUserRole: boolean = false;
    loadingUpdateUserRole: boolean = false;
    loadingDeleteUserRole: boolean = false;
    eventErrorUserRole: any = {};
    eventSuccessUserRole: any = {};

    /* #region Action */
    @Action
    async fetchUserRoles(params: IParams) {
        try {
            this.SET_LOADING_FETCH_USER_ROLE(true);
            const res: any = await fetchUserRoles(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_USER_ROLE(false);
                this.SET_USER_ROLES(res.data);
            } else {
                this.SET_LOADING_FETCH_USER_ROLE(false);
                this.SET_USER_ROLES(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_USER_ROLE(false);
            this.SET_USER_ROLES(initResult);
            this.SET_ERROR_USER_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneUserRole(params: IParams) {
        try {
            this.SET_LOADING_FETCH_USER_ROLE(true);
            const res: any = await fetchUserRoles(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_USER_ROLE(false);
                this.SET_USER_ROLE_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_USER_ROLE(false);
                this.SET_USER_ROLE_DATA(initUserRoleData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_USER_ROLE(false);
            this.SET_USER_ROLE_DATA(initUserRoleData);
            this.SET_ERROR_USER_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createUserRole(payload: IUserRoleData) {
        try {
            this.SET_LOADING_CREATE_USER_ROLE(true);
            const res: any = await createUserRole(payload);
            this.SET_LOADING_CREATE_USER_ROLE(false);
            this.SET_USER_ROLE_DATA(res.data);
            this.SET_SUCCESS_USER_ROLE({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Role pengguna", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_USER_ROLE(false);
            this.SET_ERROR_USER_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateUserRole(data: any) {
        try {
            this.SET_LOADING_UPDATE_USER_ROLE(true);
            const res = await updateUserRole(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_USER_ROLE(false);
                this.SET_USER_ROLE_DATA(res.data);
                this.SET_SUCCESS_USER_ROLE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Role pengguna", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_USER_ROLE(false);
                this.SET_USER_ROLE_DATA(initUserRoleData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_USER_ROLE(false);
            this.SET_ERROR_USER_ROLE({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteUserRole(event_id: string) {
        try {
            this.SET_LOADING_DELETE_USER_ROLE(true);

            const res = await deleteUserRole(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_USER_ROLE(false);
                this.SET_SUCCESS_USER_ROLE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Role pengguna", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_USER_ROLE(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_USER_ROLE(false);
            this.SET_ERROR_USER_ROLE({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_USER_ROLE(payload: boolean) {
        this.loadingFetchUserRoles = payload;
    }

    @Mutation
    SET_LOADING_CREATE_USER_ROLE(payload: boolean) {
        this.loadingCreateUserRole = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_USER_ROLE(payload: boolean) {
        this.loadingUpdateUserRole = payload;
    }

    @Mutation
    SET_LOADING_DELETE_USER_ROLE(payload: boolean) {
        this.loadingDeleteUserRole = payload;
    }

    @Mutation
    SET_USER_ROLES(payload: IResult) {
        this.userRoles = { ...payload };
    }

    @Mutation
    SET_USER_ROLE_DATA(payload: IUserRoleData) {
        this.userRoleData = { ...payload };
    }

    @Mutation
    SET_ERROR_USER_ROLE(payload: any) {
        this.eventErrorUserRole = payload;
    }

    @Mutation
    SET_SUCCESS_USER_ROLE(payload: any) {
        this.eventSuccessUserRole = payload;
    }

    @Mutation
    CLEAN_ACTION_USER_ROLE() {
        this.eventErrorUserRole = { ...initSuccessState };
        this.eventSuccessUserRole = { ...initErrorState };
    }
    /* #endregion */
}

export const UserRoleModule = getModule(UserRole);
