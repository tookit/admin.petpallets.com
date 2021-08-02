import request from '@/utils/request'
const state = {
  properties: [],
}
const getters = {
  getProperties: (state) => {
    return state.properties
      .map((item) => {
        return {
          id: item.id,
          value: item.value,
          text: item.name,
          slug: item.slug,
        }
      })
      .sort()
  },
  getPropertyName: (state) => (name) => {
    const find = state.properties.find((item) => item.name === name)
    return find ? find.name : ''
  },
  getPropertyValuesById: (state) => (id) => {
    const find = state.properties.find((item) => item.id === id)
    return find ? find.values : []
  },
  getSkuProperties: (state) => {
    return state.properties.filter((item) => item.type === 'sku')
  },
  getSpuProperties: (state) => {
    return state.properties.filter((item) => item.type === 'spu')
  },
  getPropUnits: (state) => {
    return state.units
  },
  getPropTypes: (state) => {
    return state.types
  },
}
const actions = {
  fetchProperty({ commit }, query) {
    return request({
      url: '/mall/property',
      method: 'get',
      params: query,
    }).then((resp) => {
      if (query && query.pageSize == -1) {
        commit('SET_PRODUCT_PROPERTIES', resp.data)
      }
      return resp
    })
  },

  fetchPropertyValue({ commit }, query) {
    return request({
      url: '/mall/property_value',
      method: 'get',
      params: query,
    })
  },

  fetchValueById({}, id) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'get',
    })
  },

  getPropertyById({}, id) {
    return request({
      url: `/mall/property/${id}`,
      method: 'get',
    })
  },
  fetchCategoryProperty({}, query) {
    return request({
      url: '/mall/cat_property',
      method: 'get',
      params: query,
    })
  },

  fetchProductProperty({}, query) {
    return request({
      url: '/mall/product_property',
      method: 'get',
      params: query,
    })
  },

  updatePropertyValue({}, { id, data }) {
    return request({
      url: `/mall/property_value/${id}`,
      method: 'put',
      data: data,
    })
  },

  mergePropertyValue({}, data) {
    return request({
      url: `/mall/property_value/merge`,
      method: 'put',
      data: data,
    })
  },

  createProperty({ commit }, data) {
    return request({
      url: '/mall/property',
      method: 'post',
      data: data,
    }).then((resp) => {
      commit('ADD_PROPERTY', resp.data)
    })
  },
  updateProperty({ commit }, { id, data }) {
    return request({
      url: `/mall/property/${id}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      commit('UPDATE_PROPERTY', resp.data)
    })
  },
  deleteProperty({ commit }, id) {
    return request({
      url: `/mall/property/${id}`,
      method: 'delete',
    }).then(() => {
      commit('DELETE_PROPERTY', id)
    })
  },
  deletePropertyValue({}, id) {
    return request({
      url: `/mall/property/value/${id}`,
      method: 'delete',
    })
  },
  deleteCategoryProperty({}, id) {
    return request({
      url: `/mall/cat_property/${id}`,
      method: 'delete',
    })
  },
  deleteProductProperty({}, id) {
    return request({
      url: `/mall/product_property/${id}`,
      method: 'delete',
    })
  },
  attachValueForProperty({}, { id, data }) {
    return request({
      url: `/mall/property/${id}/value`,
      method: 'put',
      data: data,
    })
  },
  detachPropertyForCategory({}, { cid, data }) {
    return request({
      url: `/mall/category/${cid}/property`,
      method: 'delete',
      data: data,
    })
  },
}
const mutations = {
  SET_PRODUCT_PROPERTIES(state, data) {
    state.properties = data
  },
  ADD_PROPERTY(state, data) {
    state.properties.push(data)
  },
  UPDATE_PROPERTY(state, data) {
    state.properties.forEach((item) => {
      if (item.id === data.id) {
        item = data
      }
    })
  },
  DELETE_PROPERTY(state, id) {
    state.properties = state.properties.filter((item) => item.id !== id)
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
