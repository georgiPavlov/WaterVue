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
import { useStore } from 'vuex'
import VueBasicAlert from 'vue-basic-alert'

const store = useStore()

const alert = ref(null)

const statusList = computed(() => store.getters.allStatusList)

const statusUpdateFields = computed(() => store.getters.getStatusUpdateFieldsState)

const titleStack = ref(['Tables'])

const modalDeleteElementActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

const handleErrorsLocal = (message) => {
  const errors = computed(() => store.getters.getErrors)
  if (errors.value !== 'none') {
    alert.value.showAlert(
      'error',
      errors.value
    )
  } else {
    alert.value.showAlert(
      'success',
      message
    )
  }
  store.dispatch('cleanErrors')
}

const modalDeleteStatus = (selection, errorsHandler) => {
  console.log('test status' + selection)
  store.dispatch('deleteStatus', selection).then(() => {
    handleErrorsLocal('Error deleting message')
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
        :rows="statusList"
        :item-table-columns="statusUpdateFields"
        id-name="status_id"
        type-element="status"
        show-info="false"
        @delete="modalDeleteStatus"
      />
    </card-component>
  </main-section>
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="2000"
  />
</template>
