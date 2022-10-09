<script setup>
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAt } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import { useStore } from 'vuex'
import VueBasicAlert from 'vue-basic-alert'

const form = reactive({
  email: ''
})

const alert1 = ref(null)

const router = useRouter()

const store = useStore()

const handleErrorsLocal = () => {
  const errors = computed(() => store.getters.getErrors)
  if (errors.value !== 'none') {
    alert1.value.showAlert(
      'error',
      errors.value
    )
  }
  store.dispatch('cleanErrors')
}

const isAuthenticated = computed(() => store.getters.getAuthenticated)

onBeforeMount(() => {
  if (isAuthenticated.value === true) {
    router.push('/dashboard')
  }
})

const submit = () => {
  store.dispatch('forgottenPassword', form).then(() => {
    handleErrorsLocal()
    if (store.getters.getAuthenticated === true) {
      router.push('/login')
    }
  })
}
</script>

<template>
  <full-screen-section
    v-slot="{ cardClass, cardRounded }"
    bg="login"
  >
    <card-component
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <field
        label="Email"
        help="Please enter your login"
      >
        <control
          v-model="form.email"
          :icon="mdiAt"
          name="email"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Send Recovery email"
        />
        <jb-button
          to="/login"
          color="info"
          outline
          label="Back to Login"
        />
      </jb-buttons>
    </card-component>
  </full-screen-section>
  <vue-basic-alert
    ref="alert1"
    :duration="500"
    :close-in="2000"
  />
</template>
