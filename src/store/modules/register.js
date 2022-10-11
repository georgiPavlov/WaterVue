import axios from 'axios'

const state = {
  registerParams: {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    passwordRepeat: ''
  },
  registerFields: [
    {
      column: 'First name',
      field: 'first_name',
      message: 'enter your first name',
      icon: 'mdiAccountTie',
      type: ''
    },
    {
      column: 'Last name',
      field: 'last_name',
      message: 'enter your last name',
      icon: 'mdiAccountTie',
      type: ''
    },
    {
      column: 'Username',
      field: 'username',
      message: 'enter your username',
      icon: 'mdiAccount',
      type: ''
    },
    {
      column: 'Email',
      field: 'email',
      message: 'enter your email',
      icon: 'mdiAt',
      type: ''
    },
    {
      column: 'Password',
      field: 'password',
      message: 'enter your password',
      icon: 'mdiAsterisk',
      type: 'password'
    },
    {
      column: 'Repeat password',
      field: 'password_repeat',
      message: 'repeat your password',
      icon: 'mdiAsterisk',
      type: 'password'
    }
  ]
}

const getters = {
  getRegisterFields: state => state.registerFields,
  getRegisterParams: state => state.registerParams
}

const actions = {
  async setRegisterParams ({ dispatch, commit, getters, rootGetters }, params) {
    commit('setRegisterParamsM', params)
  },
  async register ({ dispatch, commit, getters, rootGetters }) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = {
      headers: {
        'content-type': 'application/json',
        Authorization: 'none',
        'Access-Control-Allow-Origin': 'http://water-me-lb-842691727.eu-central-1.elb.amazonaws.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
    const isAuthenticated = rootGetters.getAuthenticated
    if (isAuthenticated) {
      return
    }
    const registerParams = getters.getRegisterParams
    await axios.post(
      baseURL.concat('/api/auth/register/'),
      registerParams, options
    ).catch(
      function (error) {
        console.log('error', error.response.data)
        dispatch('setIsAuthenticated', error.response.status)
        commit('setErrors', error.response.data)
      }
    )
  }
}

const mutations = {
  setRegisterParamsM (state, params) {
    (state.registerParams = params)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
