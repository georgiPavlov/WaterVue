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

const photoList = computed(() => store.getters.allPhotosList)

const photoUpdateFields = computed(() => store.getters.getPhotoUpdateFieldsState)

const titleStack = ref(['Admin', 'Tables'])

const modalDeleteElementActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

const modalCreateElementActiveT = () => {
  store.dispatch('takePhoto').then(() => {
    handleErrorsLocal('Taking photo...')
  })
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

const modalDeletePhoto = (selection) => {
  console.log('test photo' + selection)
  store.dispatch('deletePhoto', selection).then(() => {
    handleErrors()
    handleErrorsLocal('')
  })
}

const modalDownloadPhoto = (selection) => {
  console.log('test photo ' + selection)
  store.dispatch('downloadPhoto', selection).then(() => {
    handleErrorsLocal('Download successful')
  })
}

const update = ref(true)

</script>

<template>
  <div class="overflow-y-hidden">
    <title-bar :title-stack="titleStack" />
    <hero-bar>Photos</hero-bar>
    <main-section>
      <jb-buttons
        type="justify-start lg:justify-end"
        no-wrap
      >
        <jb-button
          type="reset"
          color="info"
          outline
          label="Take Picture"
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
          :rows="photoList"
          :item-table-columns="photoUpdateFields"
          :show-downloads="true"
          id-name="photo_id"
          type-element="photo"
          show-info="false"
          @delete="modalDeletePhoto"
          @download="modalDownloadPhoto"
        />
      </card-component>
    </main-section>
    <vue-basic-alert
      ref="alert"
      :duration="500"
      :close-in="5000"
    />
  </div>
</template>
