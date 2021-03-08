import request from '@/utils/request'
const state = {
  flags: [
    {
      text: 'Default',
      value: 1
    },
    {
      text: 'Promoted',
      value: 2
    },
    {
      text: 'Hot',
      value: 3
    },
    {
      text: 'New',
      value: 4
    },
    {
      text: 'Featured',
      value: 5
    },
    {
      text: 'Archived',
      value: 6
    },
    {
      text: 'Uncategorized',
      value: 7
    },
    {
      text: 'Untranslated',
      value: 8
    }
  ]
}
const getters = {
  getProductFlags: (state) => {
    return state.flags
  },
  getFlagLabel: (state) => (value) => {
    const find = state.flags.find((item) => item.value === value)
    return find ? find.text : ''
  }
}
const actions = {
  fetchProducts({ commit }, query) {
    return request({
      url: `/mall/item`,
      method: 'get',
      params: query
    })
  },

  fetchImageByProductId({ commit }, id) {
    return request({
      url: `/mall/item/${id}/image`,
      method: 'get'
    })
  },
  getProductById({ commit }, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'get'
    })
  },

  updateProduct({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}`,
      method: 'put',
      data: data
    })
  },
  deleteProduct({ commit }, id) {
    return request({
      url: `/mall/item/${id}`,
      method: 'delete'
    })
  },

  fetchValueById({ commit }, { id, query }) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'get',
      params: query
    })
  },

  getPropertyById({ commit }, id) {
    return request({
      url: `/mall/property/${id}`,
      method: 'get'
    })
  },

  fetchSpecByProductId({ commit }, id) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'get'
    })
  },

  attachValueForProperty({ commit }, { id, data }) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'put',
      data: data
    })
  },
  getPropertyValuesByProductId({ commit }, id) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'get'
    })
  },
  attachPropsForProduct({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'post',
      data: data
    })
  },
  detachPropsForProduct({ commit }, { id, property_value_id }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'delete',
      data: {
        property_value_id
      }
    })
  },
  attachDirectPropForProduct({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}/property`,
      method: 'put',
      data: data
    })
  },
  attachSkuForProduct({ commit }, { id, data }) {
    return request({
      url: `/mall/item/${id}/sku`,
      method: 'post',
      data: data
    })
  },
  deletePropertyValue({ commit }, id) {
    return request({
      url: `/mall/property_value/${id}`,
      method: 'delete'
    })
  },
  updateProductProperty({ commit }, { id, data }) {
    return request({
      url: `/mall/product_property/${id}`,
      method: 'put',
      data: data
    })
  },
  attachCategoryProperty({ commit }, id) {
    return request({
      url: `/mall/item/${id}/cat_property`,
      method: 'post'
    })
  }
}
const mutations = {
  SET_PRODUCT_CATEGORY(state, { data }) {
    state.categories = data
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
