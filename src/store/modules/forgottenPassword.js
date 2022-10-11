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
    const options = {
      headers: {
        'content-type': 'application/json',
        Authorization: 'none',
        'Access-Control-Allow-Origin': 'http://water-me-lb-842691727.eu-central-1.elb.amazonaws.com:8080',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
    const isAuthenticated = rootGetters.getAuthenticated
    if (isAuthenticated) {
      return
    }
    const loginParams = getters.getEmail
    loginParams.email = email_.email
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
