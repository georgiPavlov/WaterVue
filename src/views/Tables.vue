<script setup>
import { ref } from 'vue'
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

const titleStack = ref(['Admin', 'Tables'])

// eslint-disable-next-line no-unused-vars
const modalCreatePlanActiveT = () => {
  store.dispatch('modalCreateElementActiveToggle')
}

const modalDeletePlanActiveT = () => {
  store.dispatch('modalDeleteElementActiveToggle')
}

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Tables</hero-bar>
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
      <clients-table checkable />
    </card-component>
  </main-section>
</template>
