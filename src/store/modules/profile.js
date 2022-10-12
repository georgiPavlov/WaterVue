import axios from 'axios'

const state = {
  profileParams: {
    first_name: '',
    last_name: '',
    username: '',
    email: ''
  },
  changePasswordParams: {
    password: '',
    passwordNew: '',
    passwordNewRepeat: ''
  },
  changePasswordFields: [
    {
      column: 'Password',
      field: 'password',
      message: 'enter your password',
      icon: 'mdiAsterisk',
      type: 'password'
    },
    {
      column: 'New password',
      field: 'new_password',
      message: 'enter your new password',
      icon: 'mdiAsterisk',
      type: 'password'
    },
    {
      column: 'Repeat new password',
      field: 'password_new_repeat',
      message: 'repeat your new password',
      icon: 'mdiAsterisk',
      type: 'password'
    }
  ],
  profileFields: [
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
    }
  ]
}

const getters = {
  getProfileParams: state => state.profileParams,
  getProfileFields: state => state.profileFields,
  getChangePasswordParams: state => state.changePasswordParams,
  getChangePasswordFields: state => state.changePasswordFields
}

const actions = {
  async setChangePasswordParams ({ dispatch, commit, getters, rootGetters }, params) {
    commit('setChangePasswordParamsM', params)
  },
  async profileUpdateGet ({ dispatch, commit, getters, rootGetters }) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const user = rootGetters.getUsername_
    const options = rootGetters.getOptions
    const isAuthenticated = rootGetters.getAuthenticated
    if (!isAuthenticated) {
      return
    }
    const response = await axios.get(
      baseURL.concat('/api/auth/users/').concat(user), options
    ).catch(
      function (error) {
        console.log('error', error.response.data)
        dispatch('setIsAuthenticated', error.response.status)
        commit('setErrors', error.response.data)
      }
    )
    if (typeof response !== 'undefined') {
      commit('setProfileParamsM', response.data)
    }
  },
  async profileUpdate ({ dispatch, commit, getters, rootGetters }, form) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const isAuthenticated = rootGetters.getAuthenticated
    if (!isAuthenticated) {
      return
    }
    const response = await axios.post(
      baseURL.concat('/api/auth/profile/'), form, options
    ).catch(
      function (error) {
        console.log('error', error.response.data)
        commit('setErrors', error.response.data)
      }
    )
    if (typeof response !== 'undefined') {
      commit('setProfileParamsM', response.data)
    }
  },
  async profileUpdatePass ({ dispatch, commit, getters, rootGetters }, form) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const isAuthenticated = rootGetters.getAuthenticated
    form.username = rootGetters.getUsername_
    if (!isAuthenticated) {
      return
    }
    console.log(JSON.stringify(form))
    const response = await axios.post(
      baseURL.concat('/api/auth/profile-pass/'), form, options
    ).catch(
      function (error) {
        console.log('error', error.response.data)
        commit('setErrors', error.response.data)
      }
    )
    if (typeof response !== 'undefined') {
      commit('setProfileParamsM', response.data)
    }
  }
}

const mutations = {
  setChangePasswordParamsM (state, params) {
    (state.changePasswordParams = params)
  },
  setProfileParamsM (state, params) {
    const fields = state.profileFields
    for (const f in fields) {
      const field = fields[f].field
      state.profileParams[field] = params[field]
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
