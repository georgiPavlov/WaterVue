import axios from 'axios'

const state = {
  devices: [],
  deviceSelect: null,
  deviceWaterChart: [],
  deviceItemTableColumns: ['Name', 'ID', 'Container capacity', 'Perform water reset'],
  deviceUpdateFields: ['device_id', 'label', 'water_container_capacity', 'water_reset']
}

const getters = {
  allDevices: state => state.devices,
  allDeviceWaterCharts: state => state.deviceWaterChart,
  getDeviceById: (state) => (id) => {
    return state.devices.find((d) => d.device_id === id)
  },
  getCurrentDevice: state => state.deviceSelect
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
      'http://127.0.0.1:8080/gadget_communicator_pull/api/list_devices')

    console.log('beforeset')
    commit('setDevices', response.data)
  },
  async addDevice ({ commit }, title) {
    const response = await axios.post(
      'https://jsonplaceholder.typicode.com/devices',
      { title, completed: false }
    )

    commit('newDevice', response.data)
  },
  async deleteDevice ({ commit }, id) {
    await axios.delete(`https://jsonplaceholder.typicode.com/devices/${id}`)

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
    deviceCopy.water_reset = true
    const response = await axios.post(
      'http://127.0.0.1:8080/gadget_communicator_pull/api/update_device',
      deviceCopy
    )
    commit('updateDevice', response.data)
  },
  async fetchDeviceWaterCharts ({ commit }, id) {
    console.log('initCharts')
    console.log(id.value)
    const response = await axios.get(
      `http://127.0.0.1:8080/gadget_communicator_pull/api/list_device_charts/${id}`)

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
    (state.devices = state.devices.filter(device => device.id !== id)),
  updateDevice: (state, updDevice) => {
    const index = state.devices.findIndex(device => device.id === updDevice.id)
    if (index !== -1) {
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
