import request from '@/utils/request'
const state = {
  roles: [],
}
const getters = {}
const actions = {
  fetchRoles({}, query) {
    return request({
      url: `/acl/role`,
      method: 'get',
      params: query,
    })
  },
  getRoleById({}, id) {
    return request({
      url: `/acl/role/${id}`,
      method: 'get',
    })
  },
  createRole({}, data) {
    return request({
      url: `/acl/role`,
      method: 'post',
      data: data,
    })
  },
  updateRole({}, { id, data }) {
    return request({
      url: `/acl/role/${id}`,
      method: 'put',
      data: data,
    })
  },

  deleteRole({}, id) {
    return request({
      url: `/acl/role/${id}`,
      method: 'delete',
    })
  },
}
const mutations = {
  SET_ROLES(state, { data }) {
    state.roles = data
  },
  DELETE_ROLE(state, { data }) {
    state.roles = state.roles.filter((item) => item.id !== data.id)
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
