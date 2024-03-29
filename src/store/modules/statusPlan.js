import axios from 'axios'

const state = {
  statusList: [],
  statusUpdateFieldsState: [
    {
      column: 'status ID',
      field: 'status_id',
      type: 'String',
      readOnly: false,
      create: false,
      initialValue: ''
    },
    {
      column: 'Execution Status',
      field: 'execution_status',
      type: 'checkbox',
      readOnly: false,
      create: false,
      initialValue: true
    },
    {
      column: 'Message',
      field: 'message',
      type: 'String',
      readOnly: false,
      create: false,
      initialValue: ''
    },
    {
      column: 'Time',
      field: 'status_time',
      type: 'String',
      readOnly: false,
      create: false,
      initialValue: ''
    }
  ]
}

const getters = {
  allStatusList: state => state.statusList,
  getStatusById: (state) => (id) => {
    return state.statusList.find((d) => d.status_id === id)
  },
  getLastStatus: state => {
    if (Object.keys(state.statusList).length === 0) {
      return []
    }
    return state.statusList.at(-1)
  },
  getStatusUpdateFieldsState: state => state.statusUpdateFieldsState,
  getDeviceForStatus: (state, getters, rootState, rootGetters) => {
    return rootGetters.getCurrentDevice
  }
}

const actions = {
  async fetchStatusList ({ dispatch, commit, getters, rootGetters }) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const device = getters.getDeviceForStatus
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_status/').concat(device.device_id), options)
      .catch(
        function (error) {
          dispatch('setIsAuthenticated', error.response.status)
          console.log('Show error notification!' + error.response.data)
          return Promise.reject(error)
        }
      )
    if (typeof response !== 'undefined') {
      dispatch('setIsAuthenticated', response.status)
      commit('setStatusList', response.data)
    }
  },
  async deleteStatus ({ dispatch, commit, getters, rootGetters }, id) {
    dispatch('cleanErrors')
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const url = baseURL.concat('/gadget_communicator_pull/api/delete_status/').concat(id)
    const response = await axios.delete(url, options).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )
    if (typeof response !== 'undefined') {
      dispatch('setIsAuthenticated', response.status)
      commit('removeStatus', id)
    }
  }
}

const mutations = {
  setStatusList (state, status) {
    (state.statusList = status)
  },
  removeStatus: (state, id) =>
    (state.statusList = state.statusList.filter(status => status.status_id !== id))
}

export default {
  state,
  getters,
  actions,
  mutations
}
