import request from '@/utils/request'

const state = {
  users: []
}
const getters = {}
const actions = {
  fetchUsers({ commit }, query) {
    return request({
      url: `/acl/user`,
      method: 'get',
      params: query
    })
  },
  getUserById({ commit }, id) {
    return request({
      url: `/acl/user/${id}`,
      method: 'get'
    })
  },
  createUser({ commit }, data) {
    return request({
      url: `/acl/user`,
      method: 'post',
      data: data
    })
  },
  updateUser({ commit }, { id, data }) {
    return request({
      url: `/acl/user/${id}`,
      method: 'put',
      data: data
    })
  },

  deleteUser({ commit }, id) {
    return request({
      url: `/acl/user/${id}`,
      method: 'delete'
    })
  }
}
const mutations = {
  SET_USERS(state, { data }) {
    state.users = data
  },
  DELETE_USER(state, { data }) {
    state.users = state.users.filter((item) => item.id !== data.id)
  },
  UPDATE_USER(state, { data }) {
    // state.users = state.users.filter((item) => item.id !== data.id)
  },
  ADD_USER(state, { data }) {
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
