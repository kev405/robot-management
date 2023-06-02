import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import es from 'vuetify/lib/locale/es'


export default new Vuetify({
    lang: {
      locales: { es },
      current: 'es',
    },
  })
