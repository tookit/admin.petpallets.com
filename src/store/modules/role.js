import request from '@/utils/request'
const state = {
  roles: []
}
const getters = {}
const actions = {
  fetchRoles({ commit }, query) {
    return request({
      url: `/acl/role`,
      method: 'get',
      params: query
    })
  },
  getRoleById({ commit }, id) {
    return request({
      url: `/acl/role/${id}`,
      method: 'get',
    })
  },
  createRole({ commit }, data) {
    return request({
      url: `/acl/role`,
      method: 'post',
      data: data
    })
  },
  updateRole({ commit }, { id, data }) {
    return request({
      url: `/acl/role/${id}`,
      method: 'put',
      data: data
    })
  },

  deleteRole({ commit }, id) {
    return request({
      url: `/acl/role/${id}`,
      method: 'delete',
    })
  }
}
const mutations = {
  SET_ROLES(state, { data }) {
    state.roles = data
  },
  DELETE_ROLE(state, { data }) {
    state.roles = state.roles.filter((item) => item.id !== data.id)
  },
  UPDATE_ROLE(state, { data }) {
    // state.users = state.users.filter((item) => item.id !== data.id)
  },
  ADD_ROLE(state, { data }) {
    // state.users = state.users.filter((item) => item.id !== data.id)
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
