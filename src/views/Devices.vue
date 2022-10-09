<script setup>
import { ref, computed, watch } from 'vue'
import { mdiAccountMultiple } from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import ClientsTable from '@/components/ClientsTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Divider from '@/components/Divider.vue'
import { useStore } from 'vuex'
import VueBasicAlert from 'vue-basic-alert'

const store = useStore()

const alert = ref(null)

const devices = computed(() => store.getters.allDevices)

const devicesUpdateFields = computed(() => store.getters.getDeviceUpdateFieldsState)

watch(() => devicesUpdateFields.value, () => {
  console.log('devicesUpdateFields.value ' + devicesUpdateFields.value)
})

const titleStack = ref(['Tables'])

const modalCreateElementActiveT = (device) => {
  JSON.stringify(devicesUpdateFields.value, null, '  ')
  console.info('devicesUpdateFields.value ' + devicesUpdateFields.value[1].column)
  store.dispatch('modalCreateElementActiveToggle')
}

const modalDeleteElementActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

const handleErrors = () => {
  const errors = computed(() => store.getters.getErrors)
  if (errors.value !== 'none') {
    alert.value.showAlert(
      'error',
      errors.value
    )
    store.dispatch('modalCreateElementActiveToggleErrorsFalse')
  }
}

const modalCreateDevice = (device, errorsHandler) => {
  console.log('modalCreateDevice ' + device.label)
  JSON.stringify(device, null, '  ')
  store.dispatch('addDevice', device).then(() => {
    handleErrors()
    errorsHandler()
  })
}

const modalEditDevice = (device, errorsHandler) => {
  console.log('modalEditDevice2 ' + device)
  JSON.stringify(device, null, '  ')
  store.dispatch('updateDevice', device).then(() => {
    handleErrors()
    errorsHandler()
  })
}

const modalDeleteDevice = (selection, errorsHandler) => {
  console.log('test delete')
  store.dispatch('deleteDevice', selection).then(() => {
    handleErrors()
    errorsHandler()
  })
}

const update = ref(true)

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Devices</hero-bar>
  <main-section>
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
        :rows="devices"
        :item-table-columns="devicesUpdateFields"
        id-name="device_id"
        type-element="device"
        @delete="modalDeleteDevice"
        @create="modalCreateDevice"
        @edit="modalEditDevice"
      />
    </card-component>
  </main-section>
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="2000"
  />
</template>
