import request from '@/utils/request'
import Vue from 'vue'
const state = {
  flags: [
    {
      text: 'Default',
      value: 1,
      description: 'Default',
    },
    {
      text: 'Promoted',
      value: 2,
    },
    {
      text: 'Hot',
      value: 3,
    },
    {
      text: 'New',
      value: 4,
    },
    {
      text: 'Featured',
      value: 5,
    },
    {
      text: 'Archived',
      value: 6,
    },
    {
      text: 'Uncategorized',
      value: 7,
    },
    {
      text: 'Untranslated',
      value: 8,
    },
  ],
  list: [],
}
const getters = {
  getProductList: (state) => state.list,
  getProductFlags: (state) => {
    return state.flags
  },
  getFlagLabel: (state) => (value) => {
    const find = state.flags.find((item) => item.value === value)
    return find ? find.text : ''
  },
}
const actions = {
  fetchProducts({ commit, getters }, query) {
    return request({
      url: `/mall/item`,
      method: 'get',
      params: query,
    }).then((resp) => {
      commit('SET_PRODUCT_LIST', resp.data)
      resp.data = getters.getProductList
      return resp
    })
  },

  fetchImageByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/image`,
      method: 'get',
    })
  },

  fetchSkuByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'get',
    })
  },
  getProductById({}, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'get',
    })
  },
  duplicateProduct(context, id) {
    return request({
      url: `/mall/item/${id}/duplicate`,
      method: 'put',
    })
  },
  createProduct(context, data) {
    return request({
      url: `/mall/item/`,
      method: 'post',
      data: data,
    })
  },
  updateProduct({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      commit('UPDATE_PRODUCT_LIST', resp.data)
      return resp
    })
  },
  deleteProduct({}, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'delete',
    })
  },

  deleteBatchProduct({}, data) {
    return request({
      url: `/mall/item/`,
      method: 'delete',
      data: {
        ids: data,
      },
    })
  },

  fetchSpecByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'get',
    })
  },

  fetchRawSpec({}, id) {
    return request({
      url: `/mall/item/${id}/spec`,
      method: 'get',
    })
  },
  importRawSpec({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}/spec`,
      method: 'post',
      data: data,
    }).then((resp) => {
      commit('UPDATE_PRODUCT_LIST', resp.data)
      return resp
    })
  },

  getPropertyByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'get',
    })
  },
  attachPropsForProduct({}, { id, data }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'post',
      data: data,
    })
  },
  detachPropsForProduct({}, { id, property_value_id }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'delete',
      data: {
        property_value_id,
      },
    })
  },
  attachPropertyForProduct({}, { id, data }) {
    data.withoutDetach = true
    return request({
      url: `/mall/item/${id}/property`,
      method: 'put',
      data: data,
    })
  },

  updateProductProperty({}, { id, data }) {
    return request({
      url: `/mall/product_property/${id}`,
      method: 'put',
      data: data,
    })
  },

  updateProductPropertySearchable({}, data) {
    return request({
      url: `/mall/product_property`,
      method: 'put',
      data: data,
    })
  },

  attachCategoryProperty({}, id) {
    return request({
      url: `/mall/item/${id}/cat_property`,
      method: 'post',
    })
  },
}
const mutations = {
  SET_PRODUCT_CATEGORY(state, { data }) {
    state.categories = data
  },
  SET_PRODUCT_LIST(state, data) {
    state.list = data
  },
  UPDATE_PRODUCT_LIST(state, data) {
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
