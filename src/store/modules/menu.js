import request from '@/utils/request'
const state = {
  vendors: []
}
const getters = {
  getMenus: (state) =>
    state.menus.map((item) => {
      return {
        text: item.name,
        value: item.id
      }
    })
}
const actions = {
  fetchMenu({ commit }, query) {
    return request({
      url: `/cms/menu`,
      method: 'get',
      params: query
    }).then((resp) => {
      if (query && query.pageSize == -1) {
        commit('SET_MENUS', resp.data)
      }
      return resp
    })
  },
  getMenuById({ commit }, id) {
    return request({
      url: `/cms/menu/${id}`,
      method: 'get'
    })
  },
  createMenu({ commit }, data) {
    return request({
      url: `/cms/menu`,
      method: 'post',
      data: data
    })
  },
  updateMenu({ commit }, { id, data }) {
    return request({
      url: `/cms/menu/${id}`,
      method: 'put',
      data: data
    })
  },
  deleteMenu({ commit }, id) {
    return request({
      url: `/cms/menu/${id}`,
      method: 'delete',
    })
  }
}
const mutations = {
  SET_MENUS(state, data) {
    state.menus = data
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
