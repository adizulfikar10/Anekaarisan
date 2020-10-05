import { IRoleState, IRoleData } from "../../common/interface/role.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
} from "../../common/api/role";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initRoleData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "RoleModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Role extends VuexModule implements IRoleState {
    roles: any = { ...initResult };
    roleData: any = { ...initRoleData };
    loadingFetchRoles: boolean = false;
    loadingCreateRole: boolean = false;
    loadingUpdateRole: boolean = false;
    loadingDeleteRole: boolean = false;
    eventErrorRole: any = {};
    eventSuccessRole: any = {};

    /* #region Action */
    @Action
    async fetchRoles(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ROLE(true);
            const res: any = await fetchRoles(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_ROLE(false);
                this.SET_ROLES(res.data);
            } else {
                this.SET_LOADING_FETCH_ROLE(false);
                this.SET_ROLES(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ROLE(false);
            this.SET_ROLES(initResult);
            this.SET_ERROR_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneRole(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ROLE(true);
            const res: any = await fetchRoles(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_ROLE(false);
                this.SET_ROLE_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_ROLE(false);
                this.SET_ROLE_DATA(initRoleData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ROLE(false);
            this.SET_ROLE_DATA(initRoleData);
            this.SET_ERROR_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createRole(payload: IRoleData) {
        try {
            this.SET_LOADING_CREATE_ROLE(true);
            const res: any = await createRole(payload);
            if (res && res.data) {
                this.SET_LOADING_CREATE_ROLE(false);
                this.SET_ROLE_DATA(res.data);
                this.SET_SUCCESS_ROLE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Role", "CREATED")
                });
            } else {
                this.SET_LOADING_CREATE_ROLE(false);
            }
        } catch (error) {
            this.SET_LOADING_CREATE_ROLE(false);
            this.SET_ERROR_ROLE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateRole(data: any) {
        try {
            this.SET_LOADING_UPDATE_ROLE(true);
            const res = await updateRole(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_ROLE(false);
                this.SET_ROLE_DATA(res.data);
                this.SET_SUCCESS_ROLE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Role", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_ROLE(false);
                this.SET_ROLE_DATA(initRoleData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_ROLE(false);
            this.SET_ERROR_ROLE({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteRole(event_id: string) {
        try {
            this.SET_LOADING_DELETE_ROLE(true);

            const res = await deleteRole(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_ROLE(false);
                this.SET_SUCCESS_ROLE({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Role", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_ROLE(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_ROLE(false);
            this.SET_ERROR_ROLE({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_ROLE(payload: boolean) {
        this.loadingFetchRoles = payload;
    }

    @Mutation
    SET_LOADING_CREATE_ROLE(payload: boolean) {
        this.loadingCreateRole = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_ROLE(payload: boolean) {
        this.loadingUpdateRole = payload;
    }

    @Mutation
    SET_LOADING_DELETE_ROLE(payload: boolean) {
        this.loadingDeleteRole = payload;
    }

    @Mutation
    SET_ROLES(payload: IResult) {
        this.roles = { ...payload };
    }

    @Mutation
    SET_ROLE_DATA(payload: IRoleData) {
        this.roleData = { ...payload };
    }

    @Mutation
    SET_ERROR_ROLE(payload: any) {
        this.eventErrorRole = payload;
    }

    @Mutation
    SET_SUCCESS_ROLE(payload: any) {
        this.eventSuccessRole = payload;
    }

    @Mutation
    CLEAN_ACTION_ROLE() {
        this.eventErrorRole = { ...initSuccessState };
        this.eventSuccessRole = { ...initErrorState };
    }
    /* #endregion */
}

export const RoleModule = getModule(Role);
