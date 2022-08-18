<script setup>
import { ref, computed } from 'vue'
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

const store = useStore()

const plans = computed(() => store.getters.getPlansByType(type.value[0]))

const plansUpdateFields = computed(() => store.getters.getPlanUpdateFieldsState)

const titleStack = ref(['Admin', 'Tables'])

const modalCreateElementActiveT = (plan) => {
  JSON.stringify(plansUpdateFields.value, null, '  ')
  console.info('plansUpdateFields.value ' + plansUpdateFields.value[1].column)
  store.dispatch('modalCreateElementActiveToggle')
}

const modalDeleteElementActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

const modalCreatePlan = (plan) => {
  console.log('modalCreatePlan ' + plan.name)
  JSON.stringify(plan, null, '  ')
  store.dispatch('addPlan', plan)
}

const modalEditPlan = (plan) => {
  console.log('modalEditPlan2 ' + plan)
  JSON.stringify(plan, null, '  ')
  store.dispatch('updatePlan', plan)
}

const modalDeletePlan = (selection) => {
  console.log('test delete')
  store.dispatch('deletePlan', selection)
  console.log('test delete2')
}

const modalDeleteTimeItem = (selection, index) => {
  const el = 'weekday_times'
  selection[el].splice(index, 1)
}

const defaultWeeekdayTime = computed(() => store.getters.getDefaultElement)

const modalCreateTimeItem = (selection) => {
  console.log('item creator')
  console.log(selection)
  console.log(defaultWeeekdayTime.value)
  const el = 'weekday_times'
  selection[el].unshift(defaultWeeekdayTime.value)
}

const update = ref(true)

const buttonSettingsModel = ref([])

// eslint-disable-next-line no-unused-vars
const buttonsBasic = computed(() => buttonSettingsModel.value.indexOf('basic') > -1)

// eslint-disable-next-line no-unused-vars
const buttonsTime = computed(() => buttonSettingsModel.value.indexOf('time') > -1)

// eslint-disable-next-line no-unused-vars
const buttonsMoisture = computed(() => buttonSettingsModel.value.indexOf('moisture') > -1)

// eslint-disable-next-line no-unused-vars
const selectedDevice = computed(() => store.getters.getCurrentDevice)

const type = ref([0])

const setAllButOneToFalse = (modelValue) => {
  let enable = false
  if (modelValue.length > 1) {
    buttonSettingsModel.value.splice(buttonSettingsModel.value.indexOf(modelValue[0]), 1)
  }
  console.log('modelValue basic')
  if (modelValue[0] === 'basic') {
    console.log('modelValue basic')
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateBasic)
    console.log('plans for basic' + plans.value)
    while (type.value.length !== 0) {
      type.value.pop()
    }
    type.value.push(0)
    enable = true
  }
  if (modelValue[0] === 'moisture') {
    console.log('modelValue moisture')
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateMoisture)
    console.log('plans for moisture' + plans.value)
    while (type.value.length !== 0) {
      type.value.pop()
    }
    type.value.push(2)
    console.log('type.value.push(2)' + type.value[0])
    enable = true
  }
  if (modelValue[0] === 'time') {
    console.log('modelValue time_based')
    store.dispatch('initCurrentPlans', store.getters.getPlanUpdateFieldsStateTimeBased)
    console.log('plans for time_based' + plans.value)
    while (type.value.length !== 0) {
      type.value.pop()
    }
    type.value.push(1)
    console.log('type.value.push(1)' + type.value[0])
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
        @delete="modalDeletePlan"
        @create="modalCreatePlan"
        @edit="modalEditPlan"
        @create_item="modalCreateTimeItem"
        @delete_item="modalDeleteTimeItem"
      />
    </card-component>
  </main-section>
</template>
