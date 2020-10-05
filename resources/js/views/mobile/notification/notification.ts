import Vue from "vue";
import { Component } from "vue-property-decorator";
import { NoticeModule } from "../../../store/modules/notice";

@Component({
    name: "Notification",
    components: {}
})
export default class App extends Vue {
    get unread() {
        return NoticeModule.noticeUnreadMessage;
    }

    get notices() {
        return NoticeModule.notices;
    }

    async readAll() {
        await NoticeModule.readAllNotif();
        await NoticeModule.fetchNotices();
    }
}
