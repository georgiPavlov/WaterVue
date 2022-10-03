import axios from 'axios'

const state = {
  devices: [],
  deviceSelect: null,
  deviceWaterChart: [],
  deviceUpdateFieldsState: [
    {
      column: 'Device ID',
      field: 'device_id',
      type: 'String',
      readOnly: true,
      create: true,
      initialValue: ''
    },
    {
      column: 'Label',
      field: 'label',
      type: 'String',
      readOnly: false,
      create: true,
      initialValue: ''
    },
    {
      column: 'Water Level',
      field: 'water_level',
      type: 'number',
      readOnly: true,
      create: false,
      initialValue: 100
    },
    {
      column: 'Moisture Level',
      field: 'moisture_level',
      type: 'number',
      readOnly: true,
      create: false,
      initialValue: 0
    },
    {
      column: 'Water Total Capsity',
      field: 'water_container_capacity',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 2000
    }
  ]
}

const getters = {
  allDevices: state => state.devices,
  allDeviceWaterCharts: state => state.deviceWaterChart,
  getDeviceById: (state) => (id) => {
    return state.devices.find((d) => d.device_id === id)
  },
  getCurrentDevice: state => state.deviceSelect,
  getDeviceUpdateFieldsState: state => state.deviceUpdateFieldsState
}

const actions = {
  async initCurrentDevice ({ commit }) {
    commit('mInitCurrentDeviceLabel')
  },
  async setDeviceLabel ({ commit }, device) {
    commit('mSetDeviceSelect', device)
  },
  async fetchDevices ({ dispatch, commit, getters, rootGetters }) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    console.log('options' + options.headers.Authorization)
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_devices'), options)
      .catch(
        function (error) {
          dispatch('setIsAuthenticated', error.response.status)
          console.log('Show error notification!')
          return Promise.reject(error)
        }
      )
    dispatch('setIsAuthenticated', response.status)
    // dispatch('fetchDevices')
    commit('setDevices', response.data)
  },
  async addDevice ({ dispatch, commit, getters, rootGetters }, device) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const response = await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/create_device'),
      device, options
    ).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )

    commit('newDevice', response.data)
  },
  async deleteDevice ({ dispatch, commit, getters, rootGetters }, id) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const url = baseURL.concat('/gadget_communicator_pull/api/delete_device/').concat(id)
    await axios.delete(url, options).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )
    commit('removeDevice', id)
  },
  async updateDevice ({ dispatch, commit, getters, rootGetters }, updDevice) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const deviceCopy = { ...updDevice }
    delete deviceCopy.water_level
    delete deviceCopy.moisture_level
    await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/update_device'),
      deviceCopy, options
    ).catch(
      function (error) {
        dispatch('setIsAuthenticated', error.response.status)
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )
    commit('updateDevice', updDevice)
  },
  async fetchDeviceWaterCharts ({ dispatch, commit, getters, rootGetters }, id) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const url = baseURL.concat('/gadget_communicator_pull/api/list_device_charts/').concat(id)
    const response = await axios.get(url, options)
      .catch(
        function (error) {
          dispatch('setIsAuthenticated', error.response.status)
          console.log('Show error notification!')
          return Promise.reject(error)
        }
      )
    commit('getDeviceWaterCharts', response.data)
  }
}

const mutations = {
  mInitCurrentDeviceLabel (state) {
    if (state.deviceSelect === null) {
      (state.deviceSelect = state.devices.length !== 0 ? state.devices[0] : null)
    }
  },
  mSetDeviceSelect (state, device) {
    (state.deviceSelect = device)
  },
  setDevices (state, devices) {
    (state.devices = devices)
  },
  getDeviceWaterCharts (state, deviceWaterChart) {
    (state.deviceWaterChart = deviceWaterChart)
  },
  newDevice: (state, device) => state.devices.unshift(device),
  removeDevice: (state, id) =>
    (state.devices = state.devices.filter(device => device.device_id !== id)),
  updateDevice: (state, updDevice) => {
    const index = state.devices.findIndex(device => device.id === updDevice.id)
    if (index !== -1) {
      state.devices.splice(index, 1, updDevice)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
