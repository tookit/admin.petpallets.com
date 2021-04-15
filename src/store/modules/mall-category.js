import request from '@/utils/request'
import { arrayToTree } from '@/utils/tree'
const state = {
  categories: [],
  list: [], // list view
}
const getters = {
  getMallCategoryList: (state) => state.list,
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
  fetchProductCategory({ commit, getters }, query) {
    return request({
      url: '/mall/category',
      method: 'get',
      params: query,
    }).then((resp) => {
      console.log(query)
      if (query.pageSize === -1) {
        commit('SET_MALL_CATEGORIES', resp.data)
      } else {
        commit('SET_MALL_CAT_LIST', resp.data)
      }
      resp.data = getters.getMallCategoryList
      return resp
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
      url: `/mall/category/${id}`,
      method: 'get',
    })
  },
  getPropertyByCategoryId({}, id) {
    return request({
      url: `/mall/category/${id}/property`,
      method: 'get',
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
  updateCategoryPropertySearchable({}, data) {
    return request({
      url: `/mall/cat_property`,
      method: 'put',
      data: data,
    })
  },
  attachPropertyForCategory({}, { id, data }) {
    return request({
      url: `/mall/category/${id}/property`,
      method: 'put',
      data: data,
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
  SET_MALL_CAT_LIST(state, data) {
    state.list = data
  },
  ADD_MALL_CATEGORY_ITEM(state, data) {
    state.list.push(data)
  },
  REMOVE_MALL_CATEGORY_ITEM(state, id) {
    state.list = state.list.filter((item) => {
      return item.id !== id
    })
  },
  UPDATE_MALL_CATEGORY_ITEM(state, data) {
    const find = state.list.find((item) => item.id === data.id)
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
