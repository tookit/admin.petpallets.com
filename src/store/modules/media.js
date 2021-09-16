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
    return state.dirs.map((item) => {
      return {
        text: item.directory,
        value: item.directory,
      }
    })
  },
  getMediaExt: (state) => {
    return state.exts.map((item) => {
      return {
        text: item.extension,
        value: item.extension,
      }
    })
  },
}
const actions = {
  fetchMedia({}, query) {
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
  getMedia({}, id) {
    return request({
      url: `/media/${id}`,
      method: 'get',
    })
  },
  uploadMedia({}, data) {
    return request({
      url: `/media`,
      method: 'post',
      data: data,
    })
  },
  moveMedia({}, { id, directory, filename }) {
    return request({
      url: `/media/${id}/move`,
      method: 'post',
      data: {
        directory,
        filename,
      },
    })
  },
  updateMedia({}, { id, data }) {
    return request({
      url: `/media/${id}`,
      method: 'put',
      data: data,
    })
  },

  attachEntityForMedia({}, { id, entityId, entity, tag }) {
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

  detachEntityForMedia({}, { id, entityId, entity, tag }) {
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

  deleteMedia({}, id) {
    return request({
      url: `/media/${id}`,
      method: 'delete',
    })
  },
  deleteMultiMedia({}) {
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
