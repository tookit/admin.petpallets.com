import request from '@/utils/request'

const state = {
  abbrs: [],
  abbrList: [],
}
const getters = {}
const actions = {
  fetchAbbr({ commit }, query) {
    return request({
      url: `/abbr`,
      method: 'get',
      params: query,
    })
  },
  getAbbrById({ commit }, id) {
    return request({
      url: `/abbr/${id}`,
      method: 'get',
    })
  },
  createAbbr({ commit }, data) {
    return request({
      url: `/abbr`,
      method: 'post',
      data: data,
    })
  },
  updateAbbr({ commit }, { id, data }) {
    return request({
      url: `/abbr/${id}`,
      method: 'put',
      data: data,
    })
  },

  deleteAbbr({ commit }, id) {
    return request({
      url: `/abbr/${id}`,
      method: 'delete',
    })
  },
}
const mutations = {
  SET_ABBRS(state, { data }) {
    state.abbrs = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
