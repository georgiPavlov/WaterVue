import Vuex from 'vuex'
import axios from 'axios'
import { darkModeKey, styleKey } from '@/config.js'
import * as styles from '@/styles.js'
import device from './modules/device'
import plan from './modules/plan'
import statusPlan from './modules/statusPlan'
import photo from './modules/photo'
import createPersistedState from 'vuex-persistedstate'

export default new Vuex.Store({
  errors: 'none',
  plugins: [createPersistedState()],
  state: {
    tokenType: 'Bearer ',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im5ld191c2VyOSIsImV4cCI6MTAxNjU2NTI2NTQ2LCJlbWFpbCI6Im5ld191c2VyOEBtYWlsLmNvbSJ9.PzVPknqnwPh1yLjA2Xru8B1x-V2eiscrsKYQOtIi8VM',
    baseURL: 'http://127.0.0.1:8080',
    options: {
      headers: {
        Authorization: 'none'
      }
    },
    /* Styles */
    lightBorderStyle: '',
    lightBgStyle: '',
    asideStyle: '',
    asideBrandStyle: '',
    asideMenuCloseLgStyle: '',
    asideMenuLabelStyle: '',
    asideMenuItemStyle: '',
    asideMenuItemActiveStyle: '',
    asideMenuItemInactiveStyle: '',
    asideSubmenuListStyle: '',
    navBarItemLabelStyle: '',
    navBarItemLabelHoverStyle: '',
    navBarItemLabelActiveColorStyle: '',
    navBarMenuListUpperLabelStyle: '',
    tableTrStyle: '',
    tableTrOddStyle: '',
    overlayStyle: '',

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: true,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],

    /* Tables create a element */
    isModalElementPlanActive: false,

    isModalElementPlanActiveUpdate: false,

    isModalElementPlanActiveErrors: false,

    isModalDeleteElementActive: false
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* Styles */
    styles (state, payload) {
      for (const key in payload) {
        if (['body', 'html'].includes(key)) {
          continue
        }

        state[`${key}Style`] = payload[key]
      }
    },

    /* User */
    user (state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.email) {
        state.userEmail = payload.email
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
    },

    /* Tables */
    modalCreateElementActiveToggleM (state) {
      state.isModalElementPlanActive = !state.isModalElementPlanActive
    },

    modalUpdateElementActiveToggleM (state) {
      state.isModalElementPlanActiveUpdate = !state.isModalElementPlanActiveUpdate
    },

    modalCreateElementActiveToggleErrorsM (state) {
      state.isModalElementPlanActiveErrors = !state.isModalElementPlanActiveErrors
    },

    modalCreateElementActiveToggleErrorsFalseM (state) {
      state.isModalElementPlanActiveErrors = true
    },

    modalDeleteElementActiveToggleM (state) {
      state.isModalDeleteElementActive = !state.isModalDeleteElementActive
    },
    setErrors (state, error) {
      state.errors = error
    }
  },
  getters: {
    getOptions: state => {
      state.options.headers.Authorization = state.tokenType.concat(state.token)
      return state.options
    },
    getBaseUrl: state => state.baseURL,
    getModalCreateElementActive: state => state.isModalElementPlanActive,
    getModalUpdateElementActive: state => state.isModalElementPlanActiveUpdate,
    getModalCreateElementActiveErrors: state => state.isModalElementPlanActiveErrors,
    getModalDeleteElementActive: state => state.isModalDeleteElementActive,
    getSelectedDevices: state => state.deviceSelect,
    getErrors: state => state.errors
  },
  actions: {
    cleanErrors ({ commit }) {
      commit('setErrors', 'none')
    },
    setStyle ({ commit, dispatch }, payload) {
      const style = styles[payload] ?? styles.basic

      document.body.className = style.body
      document.documentElement.className = style.html

      if (localStorage[styleKey] !== payload) {
        localStorage.setItem(styleKey, payload)
      }

      commit('styles', style)
    },

    asideMobileToggle ({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded

      document.getElementById('app').classList[isShow ? 'add' : 'remove']('ml-60', 'lg:ml-0')

      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isAsideMobileExpanded',
        value: isShow
      })
    },

    asideLgToggle ({ commit, state }, payload = null) {
      commit('basic', { key: 'isAsideLgActive', value: payload !== null ? payload : !state.isAsideLgActive })
    },

    fullScreenToggle ({ commit, state }, value) {
      commit('basic', { key: 'isFullScreen', value })

      document.documentElement.classList[value ? 'add' : 'remove']('full-screen')
    },

    darkMode ({ commit, state }, payload = null) {
      const value = payload !== null ? payload : !state.darkMode

      document.documentElement.classList[value ? 'add' : 'remove']('dark')

      localStorage.setItem(darkModeKey, value ? '1' : '0')

      commit('basic', {
        key: 'darkMode',
        value
      })
    },

    fetch ({ commit }, payload) {
      axios
        .get(`data-sources/${payload}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            commit('basic', {
              key: payload,
              value: r.data.data
            })
          }
        })
        .catch(error => {
          alert(error.message)
        })
    },

    modalCreateElementActiveToggle ({ commit }) {
      commit('modalCreateElementActiveToggleM')
    },

    modalUpdateElementActiveToggle ({ commit }) {
      commit('modalUpdateElementActiveToggleM')
    },

    modalCreateElementActiveToggleErrors ({ commit }) {
      commit('modalCreateElementActiveToggleErrorsM')
    },
    modalCreateElementActiveToggleErrorsFalse ({ commit }) {
      commit('modalCreateElementActiveToggleErrorsFalseM')
    },

    modalDeleteElementActiveToggle ({ commit }) {
      commit('modalDeleteElementActiveToggleM')
    }
  },
  modules: {
    device,
    plan,
    statusPlan,
    photo
  }
})
