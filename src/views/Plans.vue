<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { mdiAccountMultiple } from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import ClientsTable from '@/components/ClientsTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Divider from '@/components/Divider.vue'
import Field from '@/components/Field.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import { useStore } from 'vuex'
import VueBasicAlert from 'vue-basic-alert'

const store = useStore()

const alert = ref(null)

const plans = computed(() => store.getters.getPlansByType(type.value))

const plansUpdateFields = computed(() => store.getters.getPlanUpdateFieldsState)

const titleStack = ref(['Admin', 'Tables'])

const modalCreateElementActiveT = (plan) => {
  store.dispatch('modalCreateElementActiveToggle')
}

const modalDeleteElementActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

const modalCreatePlan = (plan) => {
  console.log('modalCreatePlan')
  // eslint-disable-next-line no-constant-condition
  if (true) {
    alert.value.showAlert(
      'error',
      'modalCreatePlan'
    )
    store.dispatch('modalCreateElementActiveToggleErrors')
  }
  store.dispatch('addPlan', plan)
}

const modalEditPlan = (plan) => {
  store.dispatch('updatePlan', plan)
}

const modalDeletePlan = (selection) => {
  store.dispatch('deletePlan', selection)
}

const modalDeleteTimeItem = (selection, index) => {
  const el = 'weekday_times'
  selection[el].splice(index, 1)
}

const modalCreateTimeItem = (selection) => {
  const element = store.getters.getDefaultElement
  const weekDayTimesValue = {}
  weekDayTimesValue.time_water = element.time_water
  weekDayTimesValue.weekday = element.weekday
  const el = 'weekday_times'
  if (selection[el].length < 30) {
    selection[el].unshift(weekDayTimesValue)
  }
}

const modalCreateTimeItemNew = (s) => {
  const element = store.getters.getDefaultElement
  const weekDayTimesValue = {}
  weekDayTimesValue.time_water = element.time_water
  weekDayTimesValue.weekday = element.weekday
  const el = 'weekday_times'
  if (s[el].length === 0) {
    s[el].push(weekDayTimesValue)
  } else {
    if (s[el].length < 30) {
      s[el].unshift(weekDayTimesValue)
    }
  }
}

const update = ref(true)

const buttonSettingsModel = ref(['basic'])

const type = computed(() => store.getters.getPlanType)

const initCurrentEl = () => {
  store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateBasic)
  store.dispatch('setPlanOperation', 0)
}

onBeforeMount(() => {
  initCurrentEl()
})

const setAllButOneToFalse = (modelValue) => {
  let enable = false
  if (modelValue.length > 1) {
    modelValue.splice(modelValue.indexOf(modelValue[0]), 1)
  }
  if (modelValue.length === 0) {
    modelValue[0] = 'basic'
  }
  if (modelValue[0] === 'basic') {
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateBasic)
    store.dispatch('setPlanOperation', 0)
    enable = true
  }
  if (modelValue[0] === 'moisture') {
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateMoisture)
    store.dispatch('setPlanOperation', 2)
    enable = true
  }
  if (modelValue[0] === 'time') {
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateTimeBased)
    store.dispatch('setPlanOperation', 1)
    enable = true
  }
  if (enable === true) {
    if (!store.getters.buttonSettingsModel) {
      store.dispatch('setButtonSettingsModel')
    }
  } else {
    if (store.getters.buttonSettingsModel) {
      store.dispatch('setButtonSettingsModel')
    }
  }
}

const show = false

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Plans</hero-bar>
  <main-section>
    <field label="Plans">
      <check-radio-picker
        v-model="buttonSettingsModel"
        name="buttons-switch"
        type="switch"
        :options="{ basic: 'Basic', time: 'Time', moisture: 'Moisture' }"
        @update:modelValue="setAllButOneToFalse"
      />
    </field>
    <jb-buttons
      type="justify-start lg:justify-end"
      no-wrap
    >
      <jb-button
        type="reset"
        color="info"
        outline
        label="Create"
        @click="modalCreateElementActiveT"
      />
      <jb-button
        type="reset"
        color="danger"
        outline
        label="Delete"
        @click="modalDeleteElementActiveT"
      />
    </jb-buttons>
    <divider />

    <card-component
      class="mb-6"
      title="Clients"
      :icon="mdiAccountMultiple"
      has-table
    >
      <clients-table
        v-if="update"
        checkable
        :rows="plans"
        :item-table-columns="plansUpdateFields"
        items-box="Timers"
        id-name="name"
        type-element="plan"
        :show-items-always="show"
        :show-radio-buttons1="true"
        :limit="true"
        :limit-number="100"
        @delete="modalDeletePlan"
        @create="modalCreatePlan"
        @edit="modalEditPlan"
        @create_item="modalCreateTimeItem"
        @create_item_object_creator="modalCreateTimeItemNew"
        @delete_item="modalDeleteTimeItem"
        @delete_item_new="modalDeleteTimeItem"
        @radio_elements="setAllButOneToFalse"
      />
    </card-component>
  </main-section>
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="2000"
  />
</template>
