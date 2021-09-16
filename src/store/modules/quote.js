import request from '@/utils/request'
const state = {
  vendors: [],
}
const getters = {}
const actions = {
  fetchQuotes({}, query) {
    return request({
      url: `/mall/quote`,
      method: 'get',
      params: query,
    })
  },
  getQuoteById({}, id) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'get',
    })
  },
  updateQuote({}, { id, data }) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteQuote({}, id) {
    return request({
      url: `/mall/quote/${id}`,
      method: 'delete',
    })
  },
}
const mutations = {}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
