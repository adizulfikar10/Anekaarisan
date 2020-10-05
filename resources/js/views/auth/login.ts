import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { initRules } from '../../common/utils/initialValue';
import { AuthModule } from '../../store/modules/auth';
import { isAuth } from '../../common/utils/config';

@Component({
  name: 'Login',
  components: {
  }
})
export default class Login extends Vue {
  showPassword: any = false;
  validForm: boolean = false;
  isError: boolean = false;
  loading: boolean = false;
  rules: any = initRules;

  form: any = {
    email: '',
    password: ''
  }

  get roles() {
    return AuthModule.roles;
  }

  async login() {
    this.isError = false;
    this.loading = true;
    await AuthModule.login(this.form);

    if (!isAuth()) {
      this.$router.push({ name: 'login' });
      this.isError = true;
      this.loading = false;
    } else {
      await AuthModule.me();
      if (this.roles.filter((e: any) => e.name === 'agent').length > 0) {
        this.$router.push({ name: 'mobile-dashboard' });
      } else {
        this.$router.push({ name: 'dashboard' });
      }
      this.loading = false;
    }

  }
}