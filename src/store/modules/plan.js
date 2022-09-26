import axios from 'axios'

const state = {
  plans: [],
  deletePlan: { name: 'default_stop', plan_type: 'delete' },
  planUpdateFieldsState: [],
  planType: [0],
  buttonSettingsModel: false,
  addWeekdayTimeDefaultElement: { time_water: '07:07', weekday: 'Friday' },
  planUpdateFieldsStateBasic: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: true,
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
      column: 'Water in milliliters',
      field: 'water_volume',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 100
    },
    {
      column: 'Has Been Executed',
      field: 'has_been_executed',
      type: 'button',
      readOnly: true,
      create: false,
      hide: false,
      initialValue: false
    }
  ],
  planUpdateFieldsStateTime: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: true,
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
      column: 'Water in milliliters',
      field: 'water_volume',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 100
    },
    {
      column: 'Is running',
      field: 'is_running',
      type: 'button',
      readOnly: true,
      create: false,
      initialValue: false
    },
    {
      column: 'Weekday Times',
      field: 'weekday_times',
      type: 'Array',
      readOnly: false,
      create: true,
      initialValue: [],
      arr: { time_water: 'time', weekday: 'select' }
    },
    {
      column: 'Execute only once',
      field: 'execute_only_once',
      type: 'checkbox',
      readOnly: false,
      create: true,
      initialValue: false
    }
  ],
  planUpdateFieldsStateMoisture: [
    {
      column: 'Name',
      field: 'name',
      type: 'String',
      readOnly: true,
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
      column: 'Water in milliliters',
      field: 'water_volume',
      type: 'number',
      readOnly: false,
      create: true,
      initialValue: 100
    },
    {
      column: 'Is Running',
      field: 'has_been_executed',
      type: 'button',
      readOnly: true,
      create: false,
      initialValue: false
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
    return state.plans[state.planType].find((d) => d.name === name)
  },
  getPlansByType: (state) => (type) => {
    return state.plans[type]
  },
  getClickButtonCompareValue: (state) => {
    if (state.planUpdateFieldsState === undefined || state.planUpdateFieldsState.length === 0) {
      return true
    }
    return true
    // return !(state.planType.at(0) === 2 || state.planType.at(0) === 1)
  },
  getPlanUpdateFieldsState: state => state.planUpdateFieldsState,
  getPlanUpdateFieldsStateBasic: state => state.planUpdateFieldsStateBasic,
  getPlanUpdateFieldsStateMoisture: state => state.planUpdateFieldsStateMoisture,
  getPlanUpdateFieldsStateTimeBased: state => state.planUpdateFieldsStateTime,
  getDevice: (state, getters, rootState, rootGetters) => {
    return rootGetters.getCurrentDevice
  }
}

const actions = {
  async restartPLanExecution ({ commit }, payload) {
    const plan = payload.plan_
    const type = payload.type_
    const planCopy = { ...plan }
    delete planCopy.is_running
    delete planCopy.devices
    if (type === 2 || type === 1) {
      planCopy.has_been_executed = false
    } else {
      planCopy.has_been_executed = false
    }
    await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/update_plan'),
      planCopy, options
    ).catch(
      function (error) {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
    commit('updatePlan', plan)
  },
  async updatePlan ({ commit }, plan) {
    const planCopy = { ...plan }
    delete planCopy.is_running
    delete planCopy.devices
    if (planCopy.plan_type === 'time_based') {
      if (planCopy.execute_only_once === false) {
        delete planCopy.execute_only_once
      }
    }
    await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/update_plan'),
      planCopy, options
    ).catch(
      function (error) {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
    commit('updatePlan', plan)
  },

  async stopPlan ({ commit, getters }, idName) {
    const deletePlanCopy = { ...state.deletePlan }
    deletePlanCopy.plan_to_stop = idName
    await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/update_plan'),
      deletePlanCopy, options
    ).catch(
      function (error) {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        commit('setErrors', error.response.data)
      }
    )
  },

  async deletePlan ({ commit, getters }, idName) {
    const plan = getters.getPlansByName(idName)
    if (plan.plan_type === 'moisture' || plan.plan_type === 'time_based') {
      if (plan.is_running) {
        const deletePlanCopy = { ...state.deletePlan }
        deletePlanCopy.plan_to_stop = idName
        await axios.post(
          baseURL.concat('/gadget_communicator_pull/api/update_plan'),
          deletePlanCopy, options
        ).catch(
          function (error) {
            console.log('Show error notification!' + JSON.stringify(error.response.data))
            commit('setErrors', error.response.data)
          }
        )
      }
    }
    const url = baseURL.concat('/gadget_communicator_pull/api/delete_plan/').concat(idName)
    await axios.delete(url, options).catch(
      function (error) {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        return Promise.reject(error)
      }
    )
    commit('removePlan', idName)
  },
  setButtonSettingsModel ({ commit }) {
    commit('setButtonSettingsModelM')
  },
  setPlanOperation ({ commit }, type) {
    commit('setPlanOperation', type)
  },
  async initCurrentPlans ({ commit }, plans) {
    commit('minitCurrentPlans', plans)
  },
  async fetchPlans ({ commit }) {
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_plans'), options)
      .catch(error => {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        return Promise.reject(error)
      })
    commit('setPlans', response.data)
  },
  async addPlan ({ commit, getters }, p) {
    const dd = getters.getDevice
    const deviceId = dd.device_id
    const planCopy = { ...p }
    planCopy.devices = []
    planCopy.devices.push({ device_id: deviceId })
    if (planCopy.plan_type === 'time_based') {
      if (planCopy.execute_only_once === false) {
        delete planCopy.execute_only_once
      }
    }
    if (planCopy.plan_type === 'moisture' || planCopy.plan_type === 'time_based') {
      delete planCopy.is_running
    }
    delete planCopy.has_been_executed
    const planWithDeviceId = JSON.stringify(planCopy)
    const response = await axios.post(
      baseURL.concat('/gadget_communicator_pull/api/create_plan'),
      planWithDeviceId, options
    ).catch(error => {
      console.log('Show error notification!' + JSON.stringify(error.response.data))
      commit('setErrors', error.response.data)
    })
    if (getters.getErrors === 'none') {
      commit('newPlan', response.data)
    }
  }
}

const mutations = {
  setPlanOperation (state, planType) {
    while (state.planType.length !== 0) {
      state.planType.pop()
    }
    state.planType.push(planType)
  },
  minitCurrentPlans (state, plans) {
    state.planUpdateFieldsState = plans
  },
  setPlans (state, plans) {
    (state.plans = plans)
  },
  newPlan: (state, plan) => {
    state.plans[state.planType].unshift(plan)
  },
  setButtonSettingsModelM (state) {
    state.buttonSettingsModel = !state.buttonSettingsModel
  },
  updatePlan: (state, planUpdate) => {
    const index = state.plans[state.planType].findIndex(plan => plan.name === planUpdate.name)
    if (index !== -1) {
      state.plans[state.planType].splice(index, 1, planUpdate)
    }
  },
  removePlan: (state, idName) => {
    (state.plans[state.planType] = state.plans[state.planType].filter(p => p.name !== idName))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
