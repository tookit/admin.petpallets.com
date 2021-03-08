import request from '@/utils/request'
const state = {
  vendors: []
}
const getters = {}
const actions = {
  fetchQuotes({ commit }, query) {
    return request({
      url: `/mall/quote`,
      method: 'get',
      params: query
    })
  },
  getQuoteById({ commit }, id) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'get'
    })
  },
  updateQuote({ commit }, { id, data }) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'put',
      data: data
    })
  },
  deleteQuote({ commit }, id) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'delete',
    })
  }
}
const mutations = {}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
