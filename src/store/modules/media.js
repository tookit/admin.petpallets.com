import request from '@/utils/request'

const state = {
  entityList: [
    {
      text: 'Product',
      value: 'App\\Models\\Mall\\Product',
    },
    {
      text: 'Category',
      value: 'App\\Models\\Mall\\Category',
    },
    {
      text: 'Slider',
      value: 'App\\Models\\CMS\\Slider',
    },
    {
      text: 'News',
      value: 'App\\Models\\CMS\\Post',
    },
  ],
  exts: [],
  dirs: [],
}
const getters = {
  getEntityList: (state) => {
    return state.entityList
  },
  getMediaDir: (state) => {
    return state.dirs
  },
  getMediaExt: (state) => {
    return state.exts
  },
}
const actions = {
  fetchMedia({ commit }, query) {
    return request({
      url: `/media`,
      method: 'get',
      params: query,
    })
  },
  fetchMediaExt({ commit }) {
    return request({
      url: `/media/ext`,
      method: 'get',
    }).then(({ data }) => {
      commit('SET_MEDIA_EXT', data)
      return data
    })
  },
  fetchMediaDir({ commit }) {
    return request({
      url: `/media/dir`,
      method: 'get',
    }).then(({ data }) => {
      commit('SET_MEDIA_DIR', data)
      return data
    })
  },
  getMedia({ commit }, id) {
    return request({
      url: `/media/${id}`,
      method: 'get',
    })
  },
  uploadMedia({ commit }, data) {
    return request({
      url: `/media`,
      method: 'post',
      data: data,
    })
  },
  updateMedia({ commit }, { id, data }) {
    return request({
      url: `/media/${id}`,
      method: 'put',
      data: data,
    })
  },

  attachEntityForMedia({ commit }, { id, entityId, entity, tag }) {
    return request({
      url: `/media/${id}/entity`,
      method: 'put',
      data: {
        entity,
        entityId,
        tag,
      },
    })
  },

  detachEntityForMedia({ commit }, { id, entityId, entity, tag }) {
    return request({
      url: `/media/${id}/entity`,
      method: 'delete',
      data: {
        entity,
        entityId,
        tag,
      },
    })
  },

  deleteMedia({ commit }, id) {
    return request({
      url: `/media/${id}`,
      method: 'delete',
    })
  },
  deleteMultiMedia({ commit }, data) {
    return request({
      url: `/media/`,
      method: 'delete',
    })
  },
}
const mutations = {
  SET_MEDIA_EXT(state, data) {
    state.exts = data
  },
  SET_MEDIA_DIR(state, data) {
    state.dirs = data
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
