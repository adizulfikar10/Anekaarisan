import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
    name: "DatePicker"
})
export default class DatePicker extends Vue {

  @Prop(String) model?: string;
  @Prop(String) label?: string;
  @Prop(String) placeholder?: string;

	date = new Date().toISOString().substr(0, 10);
    menu = false;
    modal = false;
    menu2 = false;


}
