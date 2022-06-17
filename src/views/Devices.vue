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

const store = useStore()

// eslint-disable-next-line no-unused-vars
const modalCreatePlanActive = computed(() => store.getters.getModalCreatePlanActive)

const devices = computed(() => store.getters.allDevices)

const devicesUpdateFields = computed(() => store.getters.getDeviceUpdateFieldsState)

watch(() => devicesUpdateFields.value, () => {
  console.log('devicesUpdateFields.value ' + devicesUpdateFields.value)
})

const titleStack = ref(['Admin', 'Tables'])

const modalCreatePlanActiveT = (device) => {
  JSON.stringify(devicesUpdateFields.value, null, '  ')
  console.info('devicesUpdateFields.value ' + devicesUpdateFields.value[1].column)
  store.dispatch('modalCreatePlanActiveToggle')
}

const modalDeletePlanActiveT = () => {
  store.dispatch('modalDeletePlanActiveToggle')
}

const modalCreateDevice = (device) => {
  console.log('modalCreateDevice ' + device.label)
  JSON.stringify(device, null, '  ')
  store.dispatch('addDevice', device)
}

const modalEditDevice = (device) => {
  console.log('modalEditDevice2 ' + device)
  JSON.stringify(device, null, '  ')
  store.dispatch('updateDevice', device)
}

const modalDeleteDevice = (selection) => {
  console.log('test delete')
  store.dispatch('deleteDevice', selection)
  console.log('test delete2')
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
        @click="modalCreatePlanActiveT"
      />
      <jb-button
        type="reset"
        color="danger"
        outline
        label="Delete"
        @click="modalDeletePlanActiveT"
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
        @delete="modalDeleteDevice"
        @create="modalCreateDevice"
        @edit="modalEditDevice"
      />
    </card-component>
  </main-section>

</template>
