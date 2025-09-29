import axios from 'axios'

const state = {
  loginParams: {
    username: '',
    password: ''
  }
}

const getters = {
  getLoginParams: state => state.loginParams,
  getUsername_: state => state.loginParams.username
}

const actions = {
  async setLoginParams ({ dispatch, commit, getters, rootGetters }, params) {
    commit('setLoginParamsM', params)
  },
  async login ({ dispatch, commit, getters, rootGetters }) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = {
      headers: {
        'content-type': 'application/json'
      }
    }
    const isAuthenticated = rootGetters.getAuthenticated
    if (isAuthenticated) {
      return
    }
    const loginParams = getters.getLoginParams
    const response = await axios.post(
      baseURL.concat('/api-token-auth/'),
      loginParams, options
    ).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
    if (rootGetters.getErrors !== 'none') {
      return
    }
    dispatch('setToken', response.data.access)
    dispatch('setIsAuthenticated', response.status)
  }
}

const mutations = {
  setLoginParamsM (state, params) {
    (state.loginParams = params)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
