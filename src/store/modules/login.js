import axios from 'axios'

const state = {
  loginParams: {
    username: 'new_user9',
    password: 'new_pass9'
  }
}

const getters = {
  getLoginParams: state => state.loginParams
}

const actions = {
  async setLoginParams ({ dispatch, commit, getters, rootGetters }, params) {
    commit('setLoginParamsM', params)
  },
  async login ({ dispatch, commit, getters, rootGetters }) {
    const baseURL = rootGetters.getBaseUrl
    const options = { headers: { 'content-type': 'application/json' } }
    const isAuthenticated = rootGetters.getAuthenticated
    if (isAuthenticated) {
      return
    }
    const loginParams = getters.getLoginParams
    console.log('params::::: ' + JSON.stringify(loginParams))
    const response = await axios.post(
      baseURL.concat('/api/auth/login/'),
      loginParams, options
    ).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
    console.log('token:::: ' + response.data.token)
    dispatch('setToken', response.data.token)
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
