import request from '@/utils/request'

const state = {
  abbrs: [],
  abbrList: [],
}
const getters = {
  getAbbrList: (state) => state.abbrList,
}
const actions = {
  fetchAbbr({ commit, getters }, query) {
    return request({
      url: `/abbr`,
      method: 'get',
      params: query,
    }).then((resp) => {
      commit('SET_ABBR_LIST', resp.data)
      resp.data = getters.getAbbrList
      return resp
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
    }).then((resp) => {
      commit('DELETE_ITEM_ABBR_LIST', id)
      return resp
    })
  },
}
const mutations = {
  SET_ABBR_LIST(state, data) {
    state.abbrList = data
  },
  DELETE_ITEM_ABBR_LIST(state, id) {
    const filtered = state.abbrList.filter((item) => item.id !== id)
    state.abbrList = filtered
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
