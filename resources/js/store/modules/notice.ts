import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult
} from "../../common/utils/initialValue";
import { fetchNotices, readNotices } from "../../common/api/notices";
import {
    INoticeState,
    INoticeData
} from "../../common/interface/notice.interface";
import { formatErrorMessage } from "../../common/utils/helper";

@Module({
    dynamic: true,
    store,
    name: "NoticeModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Notice extends VuexModule implements INoticeState {
    notices: any = { ...initResult };
    noticeData: any = {};
    noticeUnreadMessage: number = 0;
    loadingFetchNotices: boolean = false;
    eventErrorNotice: any = {};
    eventSuccessNotice: any = {};

    /* #region Action */
    @Action
    async fetchNotices(params?: IParams) {
        try {
            this.SET_LOADING_FETCH_NOTICE(true);
            const res: any = await fetchNotices();
            if (res && res.data) {
                const data: any[] = res.data;
                const unread = data.filter((el: any) => el.is_read === 0);
                this.SET_NOTICES_COUNT(unread.length);
                this.SET_NOTICES(res.data);
            }
            this.SET_LOADING_FETCH_NOTICE(false);
        } catch (error) {
            this.SET_LOADING_FETCH_NOTICE(false);
            this.SET_NOTICES(initResult);
            this.SET_NOTICE_DATA({});
            this.SET_ERROR_NOTICE({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async readAllNotif(params?: IParams) {
        try {
            this.SET_LOADING_FETCH_NOTICE(true);
            const res: any = await readNotices();
            this.SET_LOADING_FETCH_NOTICE(false);
        } catch (error) {
            this.SET_LOADING_FETCH_NOTICE(false);
            this.SET_NOTICES(initResult);
            this.SET_ERROR_NOTICE({ data: formatErrorMessage(error) });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_NOTICE(payload: boolean) {
        this.loadingFetchNotices = payload;
    }

    @Mutation
    SET_NOTICES(payload: IResult) {
        this.notices = { ...payload };
    }

    @Mutation
    SET_NOTICES_COUNT(payload: number) {
        this.noticeUnreadMessage = payload;
    }

    @Mutation
    SET_NOTICE_DATA(payload: any) {
        this.noticeData = { ...payload };
    }

    @Mutation
    SET_ERROR_NOTICE(payload: any) {
        this.eventErrorNotice = payload;
    }

    @Mutation
    SET_SUCCESS_NOTICE(payload: any) {
        this.eventSuccessNotice = payload;
    }

    @Mutation
    CLEAN_ACTION_ARISAN() {
        this.eventErrorNotice = { ...initSuccessState };
        this.eventSuccessNotice = { ...initErrorState };
    }
    /* #endregion */
}

export const NoticeModule = getModule(Notice);
