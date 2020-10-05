import {
    IArisanMemberState,
    IArisanMemberData
} from "../../common/interface/arisanMember.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchArisanMembers,
    createArisanMember,
    updateArisanMember,
    deleteArisanMember,
    fetchOneArisanMember
} from "../../common/api/arisanMember";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initArisanMemberData
} from "../../common/utils/initialValue";
import { createArisan } from "../../common/api/arisan";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ArisanMemberModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class ArisanMember extends VuexModule implements IArisanMemberState {
    arisanMembers: any = { ...initResult };
    arisanMemberData: any = { ...initArisanMemberData };
    loadingFetchArisanMembers: boolean = false;
    loadingCreateArisanMember: boolean = false;
    loadingUpdateArisanMember: boolean = false;
    loadingDeleteArisanMember: boolean = false;
    eventErrorArisanMember: any = {};
    eventSuccessArisanMember: any = {};

    /* #region Action */
    @Action
    async fetchArisanMembers(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ARISAN_MEMBER(true);
            const res: any = await fetchArisanMembers(params);
            if (res && res.data) {
                // const mapArisan = res.data.map((element: any) => {
                //     return {
                //         ...element,
                //         meta_product: element.meta_product
                //     };
                // });
                this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBERS(res.data);
            } else {
                this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBERS(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
            this.SET_ARISAN_MEMBERS(initResult);
            this.SET_ERROR_ARISAN_MEMBER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneArisanMember(id: string) {
        try {
            this.SET_LOADING_FETCH_ARISAN_MEMBER(true);
            const res: any = await fetchOneArisanMember(id);
            if (res && res.data) {
                const mapArisan = res.data.map((element: any) => {
                    return {
                        ...element,
                        meta_product: element.meta_product
                    };
                });
                this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBER_DATA(mapArisan);
            } else {
                this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBER_DATA(initArisanMemberData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN_MEMBER(false);
            this.SET_ARISAN_MEMBER_DATA(initArisanMemberData);
            this.SET_ERROR_ARISAN_MEMBER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async setSelectedArisanMember(data: any) {
        try {
            this.SET_ARISAN_MEMBER_DATA(data);
        } catch (error) {
            this.SET_ERROR_ARISAN_MEMBER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createArisanMember(payload: IArisanMemberData) {
        try {
            this.SET_LOADING_CREATE_ARISAN_MEMBER(true);
            const res: any = await createArisanMember(payload);
            this.SET_LOADING_CREATE_ARISAN_MEMBER(false);
            this.SET_ARISAN_MEMBER_DATA(res.data);
            this.SET_SUCCESS_ARISAN_MEMBER({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Anggota arisan", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_ARISAN_MEMBER(false);
            this.SET_ERROR_ARISAN_MEMBER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createArisanAndArisanMembers(payload: any) {
        try {
            this.SET_LOADING_CREATE_ARISAN_MEMBER(true);
            const res: any = await createArisan(payload);

            this.SET_LOADING_CREATE_ARISAN_MEMBER(false);
        } catch (error) {
            this.SET_LOADING_CREATE_ARISAN_MEMBER(false);
            this.SET_ERROR_ARISAN_MEMBER({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateArisanMember(data: any) {
        try {
            this.SET_LOADING_UPDATE_ARISAN_MEMBER(true);
            const res = await updateArisanMember(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBER_DATA(res.data);
                this.SET_SUCCESS_ARISAN_MEMBER({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Anggota arisan", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_ARISAN_MEMBER(false);
                this.SET_ARISAN_MEMBER_DATA(initArisanMemberData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_ARISAN_MEMBER(false);
            this.SET_ERROR_ARISAN_MEMBER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteArisanMember(event_id: string) {
        try {
            this.SET_LOADING_DELETE_ARISAN_MEMBER(true);

            const res = await deleteArisanMember(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_ARISAN_MEMBER(false);
                this.SET_SUCCESS_ARISAN_MEMBER({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Anggota arisan", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_ARISAN_MEMBER(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_ARISAN_MEMBER(false);
            this.SET_ERROR_ARISAN_MEMBER({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_ARISAN_MEMBER(payload: boolean) {
        this.loadingFetchArisanMembers = payload;
    }

    @Mutation
    SET_LOADING_CREATE_ARISAN_MEMBER(payload: boolean) {
        this.loadingCreateArisanMember = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_ARISAN_MEMBER(payload: boolean) {
        this.loadingUpdateArisanMember = payload;
    }

    @Mutation
    SET_LOADING_DELETE_ARISAN_MEMBER(payload: boolean) {
        this.loadingDeleteArisanMember = payload;
    }

    @Mutation
    SET_ARISAN_MEMBERS(payload: IResult) {
        this.arisanMembers = { ...payload };
    }

    @Mutation
    SET_ARISAN_MEMBER_DATA(payload: IArisanMemberData) {
        this.arisanMemberData = { ...payload };
    }

    @Mutation
    SET_ERROR_ARISAN_MEMBER(payload: any) {
        this.eventErrorArisanMember = payload;
    }

    @Mutation
    SET_SUCCESS_ARISAN_MEMBER(payload: any) {
        this.eventSuccessArisanMember = payload;
    }

    @Mutation
    CLEAN_ACTION_ARISAN_MEMBER() {
        this.eventErrorArisanMember = { ...initSuccessState };
        this.eventSuccessArisanMember = { ...initErrorState };
    }
    /* #endregion */
}

export const ArisanMemberModule = getModule(ArisanMember);
