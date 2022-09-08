import axios from 'axios'

const state = {
  plans: [],
  planUpdateFieldsState: [],
  planType: [0],
  buttonSettingsModel: false,
  addWeekdayTimeDefaultElement: { time_water: '07:07', weekday: 'Friday' },
  planUpdateFieldsStateBasic: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: false,
      create: true,
      initialValue: ''
    },
    {
      column: 'Type',
      field: 'plan_type',
      type: 'String',
      readOnly: true,
      create: false,
      initialValue: 'basic'
    },
    {
      column: 'Water',
      field: 'water_volume',
      type: 'number',
      readOnly: true,
      create: true,
      initialValue: 100
    },
    {
      column: 'Has Been Executed',
      field: 'has_been_executed',
      type: 'Bool',
      readOnly: true,
      create: false,
      initialValue: 0
    }
  ],
  planUpdateFieldsStateTime: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: false,
      create: true,
      initialValue: ''
    },
    {
      column: 'Type',
      field: 'plan_type',
      type: 'String',
      readOnly: true,
      create: false,
      initialValue: 'time_based'
    },
    {
      column: 'Water',
      field: 'water_volume',
      type: 'number',
      readOnly: true,
      create: true,
      initialValue: 100
    },
    {
      column: 'Is running',
      field: 'is_running',
      type: 'String',
      readOnly: true,
      create: false,
      initialValue: 0
    },
    {
      column: 'Weekday Times',
      field: 'weekday_times',
      type: 'Array',
      readOnly: false,
      create: true,
      initialValue: [],
      arr: { time_water: 'time', weekday: 'select' }
    }
  ],
  planUpdateFieldsStateMoisture: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: false,
      create: true,
      initialValue: ''
    },
    {
      column: 'Type',
      field: 'plan_type',
      type: 'String',
      readOnly: true,
      create: false,
      initialValue: 'moisture'
    },
    {
      column: 'Water',
      field: 'water_volume',
      type: 'number',
      readOnly: true,
      create: true,
      initialValue: 100
    },
    {
      column: 'Is Running',
      field: 'has_been_executed',
      type: 'Bool',
      readOnly: true,
      create: false,
      initialValue: 0
    },
    {
      column: 'Moisture threshold',
      field: 'moisture_threshold',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 100
    },
    {
      column: 'Check Interval',
      field: 'check_interval',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 100
    }
  ]
}

// eslint-disable-next-line no-unused-vars
const tokenType = 'Bearer '
// eslint-disable-next-line no-unused-vars
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Im5ld191c2VyOSIsImV4cCI6MTAxNjU2NTI2NTQ2LCJlbWFpbCI6Im5ld191c2VyOEBtYWlsLmNvbSJ9.PzVPknqnwPh1yLjA2Xru8B1x-V2eiscrsKYQOtIi8VM'
// eslint-disable-next-line no-unused-vars
const baseURL = 'http://127.0.0.1:8080'
const options = {
  headers: {
    Authorization: tokenType.concat(token)
  }
}

const getters = {
  allPlans: state => state.plans,
  getPlanType: state => state.planType,
  getDefaultElement: state => state.addWeekdayTimeDefaultElement,
  buttonSettingsModel: state => state.buttonSettingsModel,
  getPlansByName: (state) => (name) => {
    return state.plans.find((d) => d.name === name)
  },
  getPlansByType: (state) => (type) => {
    return state.plans[type]
  },
  getPlanUpdateFieldsState: state => state.planUpdateFieldsState,
  getPlanUpdateFieldsStateBasic: state => state.planUpdateFieldsStateBasic,
  getPlanUpdateFieldsStateMoisture: state => state.planUpdateFieldsStateMoisture,
  getPlanUpdateFieldsStateTimeBased: state => state.planUpdateFieldsStateTime,
  getDevice: (state, getters, rootState, rootGetters) => {
    console.log(state)
    console.log('$$$$$$$$$$$$$$' + rootGetters)
    console.log(rootState)
    return rootGetters.getCurrentDevice
  }
}

const actions = {
  setButtonSettingsModel ({ commit }) {
    commit('setButtonSettingsModelM')
  },
  setPlanOperation ({ commit }, type) {
    commit('setPlanOperation', type)
  },
  setPlanType ({ commit }, type) {
    commit('setPlanType', type)
  },
  popPlanType ({ commit }) {
    commit('popPlanType')
  },
  async initCurrentPlans ({ commit }, plans) {
    console.log('initCurrentPlans')
    commit('minitCurrentPlans', plans)
  },
  async fetchPlans ({ commit }) {
    console.log('fetchPlans')
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_plans'), options)
      .catch(
        function (error) {
          console.log('Show error notification!')
          return Promise.reject(error)
        }
      )
    console.log('beforeset')
    console.log('fetchPlans' + response.data)
    commit('setPlans', response.data)
  },
  async addPlan ({ commit, getters }, p) {
    console.log('plan')
    const dd = getters.getDevice
    console.log('device select------------------------------------------------------' + JSON.stringify(dd))
    console.log('device select------------------------------------------------------' + JSON.stringify(dd.device_id))
    const deviceId = dd.device_id
    const plan = { ...p }
    plan.devices = []
    // plan.devices.device_id = deviceId

    plan.devices.push({ device_id: deviceId })
    const planWithDeviceId = JSON.stringify(plan)
    console.log('12result@@@@@@@@@@@@@@@@@@@@' + JSON.stringify(planWithDeviceId))
    console.log('result@@@@@@@@@@@@@@@@@@@@' + JSON.stringify(plan))
    const response = await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/create_plan'),
      planWithDeviceId, options
    ).catch(
      function (error) {
        if (error.response) {
          console.log('addPlan')
          // console.log(error.response.data)
          // console.log(error.response.status)
          // console.log(error.response.headers)
        }
        console.log('Show error notification!')
        return Promise.reject(error)
      }
    )

    commit('newPlan', response.data)
  }
}

const mutations = {
  setPlanType (state, planType) {
    state.planType.push(planType)
  },
  setPlanOperation (state, planType) {
    while (state.planType.length !== 0) {
      state.planType.pop()
    }
    state.planType.push(planType)
  },
  popPlanType (state) {
    state.planType.pop()
  },
  minitCurrentPlans (state, plans) {
    state.planUpdateFieldsState = plans
    console.log('minitCurrentPlans')
  },
  setPlans (state, plans) {
    (state.plans = plans)
    console.log('setPlans ' + plans)
  },
  newPlan: (state, plan) => {
    state.plans[state.planType].unshift(plan)
  },
  setButtonSettingsModelM (state) {
    state.buttonSettingsModel = !state.buttonSettingsModel
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
