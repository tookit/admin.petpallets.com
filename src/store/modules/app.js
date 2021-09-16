import request from '@/utils/request'

const state = {
  mode: 'light',
  themeColor: '#3f51b5',
  theme: 'inidigo',
  locales: [
    {
      text: 'English',
      code: 'US',
      value: 'en',
      svg: '/flag/us.svg',
    },
    {
      text: '中文',
      code: 'CN',
      value: 'zh',
      svg: '/flag/cn.svg',
    },
    {
      text: 'France',
      code: 'FR',
      value: 'fr',
      svg: '/flag/fr.svg',
    },
    {
      text: 'Spanish',
      code: 'ES',
      value: 'es',
      svg: '/flag/es.svg',
    },
    {
      text: 'Portugal',
      code: 'PT',
      value: 'pt',
      svg: '/flag/pt.svg',
    },
    {
      text: 'Japanese',
      code: 'JP',
      value: 'ja',
      svg: '/flag/jp.svg',
    },
    {
      text: 'Korean',
      code: 'KR',
      value: 'ko',
      svg: '/flag/kr.svg',
    },
    {
      text: 'Dedutch',
      code: 'DE',
      value: 'de',
      svg: '/flag/de.svg',
    },
  ],
  locale: 'en',
  breadcrumbs: [],
  countries: [],
}
const getters = {
  getTheme: (state) => {
    return state.theme
  },
  getThemeColor: (state) => {
    return state.themeColor
  },
  getLocales: (state) => state.locales,
  getBreadcrumbs: (state) => state.breadcrumbs,
  getLocale: (state) => state.locale,
  getCountries: (state) => state.countries,
}
const actions = {
  changeLocale({ commit }, locale) {
    commit('SET_LOCALE', locale)
  },

  updateBreadcrumbs({ commit }, $route) {
    const { matched } = $route
    const breadcrumbs = matched.map((route, index) => {
      const to =
        index === matched.length - 1
          ? $route.path
          : route.path || route.redirect
      return {
        text: route.meta.title,
        to: to,
        exact: true,
        disabled: false,
      }
    })
    commit('UPDATE_BREADCRUMBS', breadcrumbs)
  },

  getProfile({}) {
    return request({
      url: `/me`,
      method: 'get',
    })
  },

  fetchState({}) {
    return request({
      url: `/state`,
      method: 'get',
    })
  },

  fetchCountries({ commit }) {
    return request({
      url: `https://www.unpkg.com/country-all-data@1.0.5/public/countrydata.json`,
      method: 'get',
    })
      .then((data) => {
        commit('SET_COUNTRY', data.countries)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  fetchTranslation({}, { target, text }) {
    return request({
      url: `/translation`,
      method: 'post',
      data: {
        target,
        text,
      },
    })
  },
  fetchFieldTranslation({}, data) {
    return request({
      url: `/translation/field`,
      method: 'post',
      data: data,
    })
  },

  updateFieldTranslation({}, data) {
    return request({
      url: `/translation/field`,
      method: 'put',
      data: data,
    })
  },
}
const mutations = {
  SET_COUNTRY(state, data) {
    state.countries = data
  },
  SET_LOCALE(state, locale) {
    state.locale = locale
  },
  UPDATE_BREADCRUMBS(state, data) {
    state.breadcrumbs = data
  },
  APPEND_BREADCRUMB(state, breadcrumb) {
    const find = state.breadcrumbs.find((item) => item.text === breadcrumb.text)
    if (!find) {
      state.breadcrumbs.push(breadcrumb)
    }
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
