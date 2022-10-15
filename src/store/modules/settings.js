import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.scss'

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tagsView: tagsView
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins //判断是否是自身的属性，若属于则进行更新
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

