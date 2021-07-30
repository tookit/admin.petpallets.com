import request from '@/utils/request'

const state = {
  list: [],
  platforms: [],
}
const getters = {
  getPlatformList(state) {
    return state.platforms
  },
}
const actions = {
  fetchSupplierItem({ commit }, query) {
    return request({
      url: `/supplier/item`,
      method: 'get',
      params: query,
    }).then((resp) => {
      return resp
    })
  },
  fetchSupplierPlatform({ commit }, query) {
    return request({
      url: `/supplier/platform`,
      method: 'get',
      params: query,
    }).then((resp) => {
      if (query.pageSize === -1) {
        commit('SET_SUPPLIER_PLATFORM', resp.data)
      }
      return resp
    })
  },
}
const mutations = {
  SET_SUPPLIER_PLATFORM(state, data) {
    state.platforms = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
