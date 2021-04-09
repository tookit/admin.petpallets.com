import Vue from 'vue'
import request from '@/utils/request'
import { arrayToTree } from '@/utils/tree'
const state = {
  categories: [],
}
const getters = {
  getNestedCategories: (state) => {
    return arrayToTree(state.categories)
  },
  getProductCategories: (state) => {
    return state.categories.map((item) => {
      return {
        id: item.id,
        name: item.name,
        parent_id: item.parent_id,
        children: item.children,
      }
    })
  },
}
const actions = {
  fetchProductCategories({}, query) {
    return request({
      url: '/mall/category',
      method: 'get',
      params: query,
    })
  },

  fetchProductCategory({}, query) {
    return request({
      url: '/mall/category',
      method: 'get',
      params: query,
    }).then(({ data }) => {
      return data
    })
  },

  fetchProductCategoryTree({ commit }) {
    return request({
      url: '/mall/category/tree',
      method: 'get',
    }).then(({ data }) => {
      commit('SET_MALL_CATEGORIES', data)
      return data
    })
  },
  // eslint-disable-next-line no-unused-vars
  createProductCategory({ commit }, data) {
    return request({
      url: `/mall/category/`,
      method: 'post',
      data: data,
    }).then((resp) => {
      commit('ADD_MALL_CATEGORY_ITEM', resp.data)
      return resp
    })
  },
  // eslint-disable-next-line no-unused-vars
  mallCategorySwapOrder({ commit }, { source, target }) {
    return request({
      url: `/mall/category/swap_order`,
      method: 'put',
      data: {
        source,
        target,
      },
    })
  },
  updateProductCategory({ commit }, { id, data }) {
    return request({
      url: `/mall/category/${id}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      commit('UPDATE_MALL_CATEGORY_ITEM', resp.data)
      return resp
    })
  },
  updateCategoryProperty({}, { id, data }) {
    return request({
      url: `/mall/cat_property/${id}`,
      method: 'put',
      data: data,
    })
  },
  createCategoryProperty({}, data) {
    return request({
      url: `/mall/cat_property`,
      method: 'post',
      data: data,
    })
  },
  deleteProductCategory({ commit }, id) {
    return request({
      url: `/mall/category/${id}`,
      method: 'delete',
    }).then((resp) => {
      commit('REMOVE_MALL_CATEGORY_ITEM', id)
      return resp
    })
  },

  getProductByCategoryId({}, { id, query }) {
    return request({
      url: `/mall/category/${id}/item`,
      method: 'get',
      query: query,
    })
  },
  getProductCategoryById({}, id) {
    return request({
      url: `/mall/category/${id}`,
      method: 'get',
    })
  },
  getProductCategoryById({}, id) {
    return request({
      url: `/mall/category/${id}/propertty`,
      method: 'get',
    })
  },
  getPropertyByCategoryId({}, { id, query }) {
    return request({
      url: `/mall/category/${id}/property`,
      method: 'get',
      params: query,
    }).then((resp) => {
      return resp
    })
  },
  mergeMallCategory({}, { source, target }) {
    return request({
      url: `/mall/category/merge`,
      method: 'post',
      data: {
        source,
        target,
      },
    }).then((resp) => {
      commit('REMOVE_MALL_CATEGORY_ITEM', source)
      return resp
    })
  },
  importCategoryProp({}, id) {
    return request({
      url: `/mall/category/${id}/import`,
      method: 'put',
    })
  },
}
const mutations = {
  SET_PRODUCT_PROPERTIES(state, data) {
    state.properties = data
  },
  SET_MALL_CATEGORIES(state, data) {
    state.categories = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        parent_id: item.parent_id,
        depth: item.depth,
      }
    })
  },
  ADD_MALL_CATEGORY_ITEM(state, data) {
    state.categories.push(data)
  },
  REMOVE_MALL_CATEGORY_ITEM(state, id) {
    state.categories = state.categories.filter((item) => {
      return item.id !== id
    })
  },
  UPDATE_MALL_CATEGORY_ITEM(state, data) {
    const index = state.categories.find((item) => item.id === data.id)
    const item = {
      id: data.id,
      name: data.name,
      parent_id: data.parent_id,
    }
    Vue.set(state.categories, index, item)
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
