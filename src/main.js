import Vue from 'vue'
import router from './router/'
import store from './store/'
// import './registerServiceWorker'
import '@mdi/font/css/materialdesignicons.css'
import './theme/default.sass'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import VueTheMask from 'vue-the-mask'
import Lightbox from 'vue-easy-lightbox'
Vue.use(Lightbox)
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import 'dropzone/dist/dropzone.css'
import 'jodit/build/jodit.css'

import VFormBuilder from '@/components/form-builder/VFormBuilder'
import VCascader from '@/components/cascader/VCascader'
// register global component

Vue.component('VCascader', VCascader)
Vue.component('VFormBuilder', VFormBuilder)
Vue.use(VFormBuilder)
Vue.use(PerfectScrollbar)
Vue.use(VueTheMask)
Vue.config.productionTip = false
const app = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
})
app.$mount('#app')
