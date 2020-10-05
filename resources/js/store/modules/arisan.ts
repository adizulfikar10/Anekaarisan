import {
    IArisanState,
    IArisanData
} from "../../common/interface/arisan.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchArisans,
    createArisan,
    updateArisan,
    deleteArisan,
    fetchArisanReminders,
    fetchOneArisan
} from "../../common/api/arisan";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initArisanData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "ArisanModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Arisan extends VuexModule implements IArisanState {
    arisans: any = { ...initResult };
    arisanReminders: any[] = [];
    arisanData: any = { ...initArisanData };
    loadingFetchArisans: boolean = false;
    loadingCreateArisan: boolean = false;
    loadingUpdateArisan: boolean = false;
    loadingDeleteArisan: boolean = false;
    eventErrorArisan: any = {};
    eventSuccessArisan: any = {};

    /* #region Action */
    @Action
    async fetchArisans(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ARISAN(true);
            const res: any = await fetchArisans(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_ARISAN(false);
                this.SET_ARISANS(res);
                this.SET_ARISAN_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_ARISAN(false);
                this.SET_ARISANS(initResult);
                this.SET_ARISAN_DATA(initArisanData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN(false);
            this.SET_ARISANS(initResult);
            this.SET_ARISAN_DATA(initArisanData);
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneArisan(id: string) {
        try {
            this.SET_LOADING_FETCH_ARISAN(true);
            const res: any = await fetchOneArisan(id);
            if (res) {
                this.SET_LOADING_FETCH_ARISAN(false);
                this.SET_ARISAN_DATA(res);
            } else {
                this.SET_LOADING_FETCH_ARISAN(false);
                this.SET_ARISAN_DATA(initArisanData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN(false);
            this.SET_ARISAN_DATA(initArisanData);
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async setSelectedArisan(data: any) {
        try {
            this.SET_ARISAN_DATA(data);
        } catch (error) {
            this.SET_ERROR_ARISAN({
                data: formatErrorMessage(error)
            });
        }
    }

    @Action
    async createArisan(payload: IArisanData) {
        try {
            this.SET_LOADING_CREATE_ARISAN(true);
            const res: any = await createArisan(payload);
            if (res && res.data) {
                this.SET_LOADING_CREATE_ARISAN(false);
                this.SET_ARISAN_DATA(res.data);
                this.SET_SUCCESS_ARISAN({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Arisan", "CREATED")
                });
            } else {
                this.SET_LOADING_CREATE_ARISAN(false);
            }
        } catch (error) {
            this.SET_LOADING_CREATE_ARISAN(false);
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateArisan(data: any) {
        try {
            this.SET_LOADING_UPDATE_ARISAN(true);
            const res = await updateArisan(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_ARISAN(false);
                this.SET_ARISAN_DATA(res.data);
                this.SET_SUCCESS_ARISAN({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Arisan", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_ARISAN(false);
                this.SET_ARISAN_DATA(initArisanData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_ARISAN(false);
            this.SET_ERROR_ARISAN({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteArisan(event_id: string) {
        try {
            this.SET_LOADING_DELETE_ARISAN(true);

            const res = await deleteArisan(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_ARISAN(false);
                this.SET_SUCCESS_ARISAN({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Arisan", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_ARISAN(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_ARISAN(false);
            this.SET_ERROR_ARISAN({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async fetchArisanReminders(params: IParams) {
        try {
            this.SET_LOADING_FETCH_ARISAN(true);
            const res: any = await fetchArisanReminders(params);
            this.SET_LOADING_FETCH_ARISAN(false);
            this.SET_ARISAN_REMINDERS(res);
        } catch (error) {
            this.SET_LOADING_FETCH_ARISAN(false);
            this.SET_ARISAN_REMINDERS([]);
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
        finally {
            this.SET_LOADING_FETCH_ARISAN(false);
        }
    }

    @Action
    async selectOneArisan(payload: any) {
        try {
            this.SET_ARISAN_DATA(payload);
        } catch (error) {
            this.SET_ARISAN_DATA(initArisanData);
            this.SET_ERROR_ARISAN({ data: formatErrorMessage(error) });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_ARISAN(payload: boolean) {
        this.loadingFetchArisans = payload;
    }

    @Mutation
    SET_LOADING_CREATE_ARISAN(payload: boolean) {
        this.loadingCreateArisan = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_ARISAN(payload: boolean) {
        this.loadingUpdateArisan = payload;
    }

    @Mutation
    SET_LOADING_DELETE_ARISAN(payload: boolean) {
        this.loadingDeleteArisan = payload;
    }

    @Mutation
    SET_ARISANS(payload: IResult) {
        this.arisans = { ...payload };
    }

    @Mutation
    SET_ARISAN_DATA(payload: IArisanData) {
        this.arisanData = { ...payload };
    }

    @Mutation
    SET_ARISAN_REMINDERS(payload: any[]) {
        this.arisanReminders = payload;
    }

    @Mutation
    SET_ERROR_ARISAN(payload: any) {
        this.eventErrorArisan = payload;
    }

    @Mutation
    SET_SUCCESS_ARISAN(payload: any) {
        this.eventSuccessArisan = payload;
    }

    @Mutation
    CLEAN_ACTION_ARISAN() {
        this.eventErrorArisan = { ...initSuccessState };
        this.eventSuccessArisan = { ...initErrorState };
    }
    /* #endregion */
}

export const ArisanModule = getModule(Arisan);
