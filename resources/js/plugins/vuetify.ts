import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
const opts: any = {
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      dark: {
        primary: '#EFB21E',
        accent:'#5264BF',
        success: '#6DE559',
        danger: '#F22828',
        grey: '#C4C4C4',
        black: '#474747',
        warning: '#FFEB36',
        white: '#FFFFFF',
        background: '#F5F5F5',
      },
      light: {
        primary: '#EFB21E',
        accent:'#5264BF',
        success: '#6DE559',
        danger: '#F22828',
        grey: '#C4C4C4',
        black: '#474747',
        warning: '#FFEB36',
        white: '#FFFFFF',
        background: '#F5F5F5',

      },
    },
  },
};

export default new Vuetify(opts);
