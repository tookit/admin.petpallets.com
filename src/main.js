import Vue from 'vue'
import router from './router/'
import store from './store/'
// import './registerServiceWorker'
import '@mdi/font/css/materialdesignicons.css'
import './theme/default.sass'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueTheMask from 'vue-the-mask'
import Lightbox from 'vue-easy-lightbox'
Vue.use(Lightbox)
// import ConfirmDialog from '@/components/dialog/ConfirmDialog'
// Vue.use(ConfirmDialog, { vuetify })
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import 'dropzone/dist/dropzone.css'
import 'jodit/build/jodit.css'
import { VCascader, VFormBuilder } from '@tookit/vma'

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
  vuetify,
  render: (h) => h(App),
})
Vue.prototype.__ = (key, ...parrams) => {
  return app.$vuetify.lang.translator(key, ...parrams)
}
app.$mount('#app')
