import {
    ICategoryState,
    ICategoryData
} from "../../common/interface/category.interface";
import {
    Action,
    getModule,
    Module,
    Mutation,
    VuexModule
} from "vuex-module-decorators";
import store from "..";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchOneCategory
} from "../../common/api/category";
import { formatErrorMessage } from "../../common/utils/helper";
import { IResult, IParams } from "../../common/interface/app.interface";
import {
    initSuccessState,
    initErrorState,
    initResult,
    initCategoryData
} from "../../common/utils/initialValue";
import { messageAPI } from "../../common/format/actionMessage";

@Module({
    dynamic: true,
    store,
    name: "CategoryModule",
    preserveState: localStorage.getItem("vuex") !== null
})
class Category extends VuexModule implements ICategoryState {
    categories: any = { ...initResult };
    categoryData: any = { ...initCategoryData };
    loadingFetchCategory: boolean = false;
    loadingCreateCategory: boolean = false;
    loadingUpdateCategory: boolean = false;
    loadingDeleteCategory: boolean = false;
    eventErrorCategory: any = {};
    eventSuccessCategory: any = {};

    /* #region Action */
    @Action
    async fetchCategories(params: IParams) {
        try {
            this.SET_LOADING_FETCH_CATEGORY(true);
            const res: any = await fetchCategories(params);
            if (res && res.data) {
                this.SET_LOADING_FETCH_CATEGORY(false);
                this.SET_CATEGORIES(res);
            } else {
                this.SET_LOADING_FETCH_CATEGORY(false);
                this.SET_CATEGORIES(initResult);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_CATEGORY(false);
            this.SET_CATEGORIES(initResult);
            this.SET_ERROR_CATEGORY({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async fetchOneCategory(id: string) {
        try {
            this.SET_LOADING_FETCH_CATEGORY(true);
            const res: any = await fetchOneCategory(id);
            if (res && res.data) {
                this.SET_LOADING_FETCH_CATEGORY(false);
                this.SET_CATEGORY_DATA(res.data);
            } else {
                this.SET_LOADING_FETCH_CATEGORY(false);
                this.SET_CATEGORY_DATA(initCategoryData);
            }
        } catch (error) {
            this.SET_LOADING_FETCH_CATEGORY(false);
            this.SET_CATEGORY_DATA(initCategoryData);
            this.SET_ERROR_CATEGORY({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async createCategory(payload: ICategoryData) {
        try {
            this.SET_LOADING_CREATE_CATEGORY(true);
            const res: any = await createCategory(payload);
            this.SET_LOADING_CREATE_CATEGORY(false);
            this.SET_CATEGORY_DATA(res.data);
            this.SET_SUCCESS_CATEGORY({
                statusCode: res.status,
                statusText: res.statusText,
                message: messageAPI("Kategori", "CREATED")
            });
        } catch (error) {
            this.SET_LOADING_CREATE_CATEGORY(false);
            this.SET_ERROR_CATEGORY({ data: formatErrorMessage(error) });
        }
    }

    @Action
    async updateCategory(data: any) {
        try {
            this.SET_LOADING_UPDATE_CATEGORY(true);
            const res = await updateCategory(data.id, data);
            if (res && res.data) {
                this.SET_LOADING_UPDATE_CATEGORY(false);
                this.SET_CATEGORY_DATA(res.data);
                this.SET_SUCCESS_CATEGORY({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Kategori", "UPDATED")
                });
            } else {
                this.SET_LOADING_UPDATE_CATEGORY(false);
                this.SET_CATEGORY_DATA(initCategoryData);
            }
        } catch (error) {
            this.SET_LOADING_UPDATE_CATEGORY(false);
            this.SET_ERROR_CATEGORY({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }

    @Action
    async deleteCategory(event_id: string) {
        try {
            this.SET_LOADING_DELETE_CATEGORY(true);

            const res = await deleteCategory(event_id);

            if (res && res.status === 200) {
                this.SET_LOADING_DELETE_CATEGORY(false);
                this.SET_SUCCESS_CATEGORY({
                    statusCode: res.status,
                    statusText: res.statusText,
                    message: messageAPI("Kategori", "DELETED")
                });
            } else {
                this.SET_LOADING_DELETE_CATEGORY(false);
            }
        } catch (error) {
            this.SET_LOADING_DELETE_CATEGORY(false);
            this.SET_ERROR_CATEGORY({
                data: formatErrorMessage(error),
                status: true
            });
        }
    }
    /* #endregion */

    /* #region  Mutation */
    @Mutation
    SET_LOADING_FETCH_CATEGORY(payload: boolean) {
        this.loadingFetchCategory = payload;
    }

    @Mutation
    SET_LOADING_CREATE_CATEGORY(payload: boolean) {
        this.loadingCreateCategory = payload;
    }

    @Mutation
    SET_LOADING_UPDATE_CATEGORY(payload: boolean) {
        this.loadingUpdateCategory = payload;
    }

    @Mutation
    SET_LOADING_DELETE_CATEGORY(payload: boolean) {
        this.loadingDeleteCategory = payload;
    }

    @Mutation
    SET_CATEGORIES(payload: IResult) {
        this.categories = { ...payload };
    }

    @Mutation
    SET_CATEGORY_DATA(payload: ICategoryData) {
        this.categoryData = { ...payload };
    }

    @Mutation
    SET_ERROR_CATEGORY(payload: any) {
        this.eventErrorCategory = payload;
    }

    @Mutation
    SET_SUCCESS_CATEGORY(payload: any) {
        this.eventSuccessCategory = payload;
    }

    @Mutation
    CLEAN_ACTION_CATEGORY() {
        this.eventErrorCategory = { ...initSuccessState };
        this.eventSuccessCategory = { ...initErrorState };
    }
    /* #endregion */
}

export const CategoryModule = getModule(Category);
