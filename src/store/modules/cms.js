import request from '@/utils/request'
const state = {
  newsList: [],
  categories: [],
  tags: [],
  tagTypes: [],
}
const getters = {
  getNewsList: (state) => state.newsList,
  getCmsCategories: (state) => {
    return state.categories.map((item) => {
      return {
        text: item.name,
        value: item.id,
      }
    })
  },
  getTagsByType: (state) => (type) => {
    return state.tags
      .filter((item) => item.type === type)
      .map((item) => {
        return {
          text: item.name,
          value: item.name,
        }
      })
  },
  getTagTypes: (state) => {
    return state.tagTypes
  },
  getTagList: (state) => {
    return state.tags
  },
}
const actions = {
  fetchNews({ commit, getters }, query) {
    return request({
      url: `/cms/post`,
      method: 'get',
      params: query,
    }).then((resp) => {
      commit('SET_NEWS_LIST', resp.data)
      resp.data = getters.getNewsList
      return resp
    })
  },
  fetchTags({ commit }, query) {
    return request({
      url: `/cms/tag`,
      method: 'get',
      params: query,
    }).then((resp) => {
      if (query && query.pageSize == -1) {
        commit('SET_CMS_TAGS', resp.data)
      }
      return resp
    })
  },
  createNews({}, data) {
    return request({
      url: `/cms/post`,
      method: 'post',
      data: data,
    })
  },
  createTag({}, data) {
    return request({
      url: `/cms/tag`,
      method: 'post',
      data: data,
    })
  },
  updateNews({ commit }, { id, data }) {
    return request({
      url: `/cms/post/${id}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      commit('UPDATE_NEWS_LIST', resp.data)
      return resp
    })
  },
  deleteNews({}, id) {
    return request({
      url: `/cms/post/${id}`,
      method: 'delete',
    })
  },
  updateTag({}, { id, data }) {
    return request({
      url: `/cms/tag/${id}`,
      method: 'put',
      data: data,
    })
  },
  getNewsById({}, id) {
    return request({
      url: `/cms/post/${id}`,
      method: 'get',
    })
  },
  getTagById({}, id) {
    return request({
      url: `/cms/tag/${id}`,
      method: 'get',
    })
  },
  deleteTag({}, id) {
    return request({
      url: `/cms/tag/${id}`,
      method: 'delete',
    })
  },

  fetchNewsCategory({ commit }, query) {
    return request({
      url: `/cms/category`,
      method: 'get',
      params: query,
    }).then((resp) => {
      if (query && query.pageSize == -1) {
        commit('SET_NEWS_CATEGORIES', resp.data)
      }
      return resp
    })
  },
  createNewsCategory({}, data) {
    return request({
      url: `/cms/category`,
      method: 'post',
      data: data,
    })
  },
  updateNewsCategory({}, { id, data }) {
    return request({
      url: `/cms/category/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteNewsCategory({}, id) {
    return request({
      url: `/cms/category/${id}`,
      method: 'delete',
    })
  },

  getNewsCategoryById({}, id) {
    return request({
      url: `/cms/category/${id}`,
      method: 'get',
    })
  },

  createSlider({}, data) {
    return request({
      url: `/cms/slider`,
      method: 'get',
      data: data,
    })
  },
  updateSlider({}, { id, data }) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'put',
      data: data,
    })
  },

  getSliderById({}, id) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'get',
    })
  },
  deleteSliderById({}, id) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'delete',
    })
  },
  fetchSlider({}, query) {
    return request({
      url: `/cms/slider`,
      method: 'get',
      query,
    })
  },
}
const mutations = {
  SET_NEWS_CATEGORIES(state, data) {
    state.categories = data
  },
  SET_CMS_TAGS(state, data) {
    state.tags = data.map(({ id, name, type }) => {
      return {
        id,
        name,
        type,
      }
    })
  },
  SET_NEWS_LIST(state, data) {
    state.newsList = data
  },
  UPDATE_NEWS_LIST(state, data) {
    console.log(data)
    const find = state.newsList.find((item) => item.id === data.id)
    Object.assign(find, data)
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
