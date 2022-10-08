import axios from 'axios'

const state = {
  email_: {
    email: ''
  }
}

const getters = {
  getEmail: state => state.email_
}

const actions = {
  async forgottenPassword ({ dispatch, commit, getters, rootGetters }, email_) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = { headers: { 'content-type': 'application/json' } }
    const isAuthenticated = rootGetters.getAuthenticated
    if (isAuthenticated) {
      return
    }
    const loginParams = getters.getEmail
    loginParams.email = email_.email
    console.log('loginParams 123' + JSON.stringify(email_))
    console.log('loginParams' + JSON.stringify(loginParams))
    await axios.post(
      baseURL.concat('/api/auth/password/'),
      loginParams, options
    ).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
  }
}

export default {
  state,
  actions,
  getters
}
