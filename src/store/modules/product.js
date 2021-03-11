import request from '@/utils/request'
const state = {
  flags: [
    {
      text: 'Default',
      value: 1,
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
}
const getters = {
  getProductFlags: (state) => {
    return state.flags
  },
  getFlagLabel: (state) => (value) => {
    const find = state.flags.find((item) => item.value === value)
    return find ? find.text : ''
  },
}
const actions = {
  fetchProducts({}, query) {
    return request({
      url: `/mall/item`,
      method: 'get',
      params: query,
    })
  },

  fetchImageByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/image`,
      method: 'get',
    })
  },
  getProductById({}, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'get',
    })
  },

  updateProduct({}, { id, data }) {
    return request({
      url: `/mall/item/${id}`,
      method: 'put',
      data: data,
    })
  },
  deleteProduct({}, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'delete',
    })
  },


  fetchSpecByProductId({}, id) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'get',
    })
  },


  getPropertyValuesByProductId({}, id) {
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
  attachDirectPropForProduct({}, { id, data }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'put',
      data: data,
    })
  },
  attachSkuForProduct({}, { id, data }) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'post',
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
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
