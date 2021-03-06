import request from '@/utils/request'
const state = {
  vendors: [],
}
const getters = {
  getVendors: (state) =>
    state.vendors.map((item) => {
      return {
        text: item.name,
        value: item.id,
        url: item.website,
        products_count: item.products_count,
      }
    }),
}
const actions = {
  fetchVendors({ commit }, query) {
    return request({
      url: `/mall/vendor`,
      method: 'get',
      params: query,
    }).then((resp) => {
      if (query && query.pageSize == -1) {
        commit('SET_VENDORS', resp.data)
      }
      return resp
    })
  },
  getVendorById({}, id) {
    return request({
      url: `/mall/vendor/${id}`,
      method: 'get',
    })
  },
  createVendor({}, data) {
    return request({
      url: `/mall/vendor`,
      method: 'post',
      data: data,
    })
  },
  updateVendor({}, { id, data }) {
    return request({
      url: `/mall/vendor/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteVendor({}, id) {
    return request({
      url: `/mall/vendor/${id}`,
      method: 'delete',
    })
  },
}
const mutations = {
  SET_VENDORS(state, data) {
    state.vendors = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
