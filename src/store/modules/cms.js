import request from '@/utils/request'
const state = {
  newsList: [],
  categories: [],
  tags: [],
  tagTypes: [],
}
const getters = {
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
  fetchNews({ commit }, query) {
    return request({
      url: `/cms/post`,
      method: 'get',
      params: query,
    }).then((resp) => {
      commit('SET_NEWS_LIST', resp.data)
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
  createNews({ commit }, data) {
    return request({
      url: `/cms/post`,
      method: 'post',
      data: data,
    })
  },
  createTag({ commit }, data) {
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
    })
  },
  deleteNews({ commit }, id) {
    return request({
      url: `/cms/post/${id}`,
      method: 'delete',
    })
  },
  updateTag({ commit }, { id, data }) {
    return request({
      url: `/cms/tag/${id}`,
      method: 'put',
      data: data,
    })
  },
  getNewsById({ commit }, id) {
    return request({
      url: `/cms/post/${id}`,
      method: 'get',
    })
  },
  getTagById({ commit }, id) {
    return request({
      url: `/cms/tag/${id}`,
      method: 'get',
    })
  },
  deleteTag({ commit }, id) {
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
  createNewsCategory({ commit }, data) {
    return request({
      url: `/cms/category`,
      method: 'post',
      data: data,
    })
  },
  updateNewsCategory({ commit }, { id, data }) {
    return request({
      url: `/cms/category/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteNewsCategory({ commit }, id) {
    return request({
      url: `/cms/category/${id}`,
      method: 'delete',
    })
  },

  getNewsCategoryById({ commit }, id) {
    return request({
      url: `/cms/category/${id}`,
      method: 'get',
    })
  },

  createSlider({ commit }, data) {
    return request({
      url: `/cms/slider`,
      method: 'get',
      data: data,
    })
  },
  updateSlider({ commit }, { id, data }) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'put',
      data: data,
    })
  },

  getSliderById({ commit }, id) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'get',
    })
  },
  deleteSliderById({ commit }, id) {
    return request({
      url: `/cms/slider/${id}`,
      method: 'delete',
    })
  },
  fetchSlider({ commit }, query) {
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
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
