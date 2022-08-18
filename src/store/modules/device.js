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

const tokenType = 'Bearer '
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im5ld191c2VyOSIsImV4cCI6MTAxNjU2NTI2NTQ2LCJlbWFpbCI6Im5ld191c2VyOEBtYWlsLmNvbSJ9.PzVPknqnwPh1yLjA2Xru8B1x-V2eiscrsKYQOtIi8VM'
const baseURL = 'http://127.0.0.1:8080'
const options = {
  headers: {
    Authorization: tokenType.concat(token)
  }
}
const actions = {
  async initCurrentDevice ({ commit }) {
    console.log('beforeset')
    commit('mInitCurrentDeviceLabel')
  },
  async setDeviceLabel ({ commit }, device) {
    console.log('dfdsf')
    commit('mSetDeviceSelect', device)
  },
  async fetchDevices ({ commit }) {
    console.log('beforeset')
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_devices'), options)
      .catch(
        function (error) {
          console.log('Show error notification!')
          return Promise.reject(error)
        }
      )
    console.log('beforeset')
    commit('setDevices', response.data)
  },
  async addDevice ({ commit }, device) {
    const response = await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/create_device'),
      device, options
    ).catch(
      function (error) {
        console.log('Show error notification!')
        return Promise.reject(error)
      }
    )

    commit('newDevice', response.data)
  },
  async deleteDevice ({ commit }, id) {
    console.log('device_delete ' + id)
    const url = baseURL.concat('/gadget_communicator_pull/api/delete_device/').concat(id)
    await axios.delete(url, options).catch(
      function (error) {
        console.log('Show error notification!')
        return Promise.reject(error)
      }
    )
    commit('removeDevice', id)
  },
  async filterDevices ({ commit }, e) {
    // Get selected number
    const limit = parseInt(
      e.target.options[e.target.options.selectedIndex].innerText
    )

    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/devices?_limit=${limit}`
    )

    commit('setDevices', response.data)
  },
  async updateDevice ({ commit }, updDevice) {
    const deviceCopy = { ...updDevice }
    delete deviceCopy.water_level
    delete deviceCopy.moisture_level
    await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/update_device'),
      deviceCopy, options
    ).catch(
      function (error) {
        console.log('Show error notification!')
        return Promise.reject(error)
      }
    )
    commit('updateDevice', updDevice)
  },
  async fetchDeviceWaterCharts ({ commit }, id) {
    console.log('initCharts')
    console.log(id.value)
    const url = baseURL.concat('/gadget_communicator_pull/api/list_device_charts/').concat(id)
    const response = await axios.get(url, options)
      .catch(
        function (error) {
          console.log('Show error notification!')
          return Promise.reject(error)
        }
      )

    console.log(response.data)

    commit('getDeviceWaterCharts', response.data)
  }
}

const mutations = {
  mInitCurrentDeviceLabel (state) {
    if (state.deviceSelect === null) {
      (state.deviceSelect = state.devices.length !== 0 ? state.devices[0] : null)
      console.log('changing current device')
    }
    console.log('mInitCurrentDeviceLabel')
  },
  mSetDeviceSelect (state, device) {
    (state.deviceSelect = device)
    console.log('setDeviceSelect')
  },
  setDevices (state, devices) {
    (state.devices = devices)
    console.log('afterset2')
  },
  getDeviceWaterCharts (state, deviceWaterChart) {
    (state.deviceWaterChart = deviceWaterChart)
    console.log('chartset2')
  },
  newDevice: (state, device) => state.devices.unshift(device),
  removeDevice: (state, id) =>
    (state.devices = state.devices.filter(device => device.device_id !== id)),
  updateDevice: (state, updDevice) => {
    const index = state.devices.findIndex(device => device.id === updDevice.id)
    if (index !== -1) {
      state.devices.splice(index, 1, updDevice)
      console.log(updDevice)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
