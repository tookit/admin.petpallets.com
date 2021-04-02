import request from '@/utils/request'
const state = {
  categories: [],
}
const getters = {
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
  updateProductCategory({}, { id, data }) {
    return request({
      url: `/mall/category/${id}`,
      method: 'put',
      data: data,
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
  deleteProductCategory({}, id) {
    return request({
      url: `/mall/category/${id}`,
      method: 'delete',
    }).then((resp) => {
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
    state.categories = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
