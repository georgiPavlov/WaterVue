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

const getters = {
  allPlans: state => state.plans,
  getPlanType: state => state.planType,
  getDefaultElement: state => state.addWeekdayTimeDefaultElement,
  buttonSettingsModel: state => state.buttonSettingsModel,
  getPlansByName: (state) => (name) => {
    return state.plans[state.planType].find((d) => d.name === name)
  },
  getPlansByTypeAndDeviceId: (state, getters, rootState, rootGetters) => (type) => {
    const currentDevice = rootGetters.getCurrentDevice
    return state.plans[type].filter(p => p.devices[0].device_id === currentDevice.device_id)
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
  async restartPLanExecution ({ dispatch, commit, getters, rootGetters }, payload) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
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
  async updatePlan ({ dispatch, commit, getters, rootGetters }, plan) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
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

  async stopPlan ({ dispatch, commit, getters, rootGetters }, idName) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
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

  async deletePlan ({ dispatch, commit, getters, rootGetters }, idName) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
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
  async fetchPlans ({ dispatch, commit, getters, rootGetters }) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_plans'), options)
      .catch(error => {
        console.log('Show error notification!' + JSON.stringify(error.response.data))
        return Promise.reject(error)
      })
    commit('setPlans', response.data)
  },
  async addPlan ({ dispatch, commit, getters, rootGetters }, p) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
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
