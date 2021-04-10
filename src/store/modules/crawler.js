import request from '@/utils/request'
const state = {
  crawlerTypeList: [
    {
      text: 'Link',
      value: 'link',
    },
    {
      text: 'Item',
      value: 'item',
    },
  ],
  taskStatusList: [
    {
      text: 'ready',
      color: 'default',
    },
    {
      text: 'running',
      color: 'warning',
    },
    {
      text: 'failed',
      color: 'error',
    },
    {
      text: 'finished',
      color: 'success',
    },
  ],
}
const getters = {
  getCrawlerTypeList: (state) => state.crawlerTypeList,
  getTaskStatusColor: (state) => (status) => {
    const item = state.taskStatusList.find((item) => item.text === status)
    return item.color
  },
}
const actions = {
  fetchCrawlerTask({ commit }, query) {
    return request({
      url: `/crawler/task`,
      method: 'get',
      params: query,
    })
  },
  getCrawlerTaskById({ commit }, id) {
    return request({
      url: `/crawler/task/${id}`,
      method: 'get',
    })
  },
  createCrawlerTask({ commit }, data) {
    return request({
      url: `/crawler/task`,
      method: 'post',
      data: data,
    })
  },
  updateCrawlerTask({ commit }, { id, data }) {
    return request({
      url: `/crawler/task/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteCrawlerTask({ commit }, id) {
    return request({
      url: `/crawler/task/${id}`,
      method: 'delete',
    })
  },
  runCrawlerTask({ commit }, id) {
    return request({
      url: `/crawler/task/${id}/run`,
      method: 'post',
    })
  },
  linkProduct({ commit }, { id, data }) {
    return request({
      url: `/crawler/task/${id}/link`,
      method: 'post',
      data: data,
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
