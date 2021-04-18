import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import pathify from 'vuex-pathify'
import VuexPersistence from 'vuex-persist'

pathify.options.mapping = 'standard'
pathify.options.deep = false

const vuexLocal = new VuexPersistence({
  key: 'kamefiber',
  storage: window.localStorage,
  modules: ['app', 'auth', 'cms', 'product'],
})

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  plugins: [vuexLocal.plugin, pathify.plugin],
})

export default store
