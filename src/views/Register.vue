<script setup>
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import * as module from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import { useStore } from 'vuex'
import VueBasicAlert from 'vue-basic-alert'

const form = reactive({})

const alert = ref(null)

const router = useRouter()

const store = useStore()

const handleErrorsLocal = () => {
  const errors = computed(() => store.getters.getErrors)
  if (errors.value !== 'none') {
    alert.value.showAlert(
      'error',
      errors.value
    )
  }
  store.dispatch('cleanErrors')
}

const getRegisterFields = computed(() => store.getters.getRegisterFields)

const isAuthenticated = computed(() => store.getters.getAuthenticated)

const copyValuesToForm = () => {
  const fields = getRegisterFields.value
  for (const f in fields) {
    const field = fields[f].field
    form[field] = ''
  }
}

onBeforeMount(() => {
  if (isAuthenticated.value === true) {
    router.push('/dashboard')
  }
  copyValuesToForm()
})

const submit = () => {
  store.dispatch('setRegisterParams', form)
  store.dispatch('register').then(() => {
    handleErrorsLocal()
    router.push('/login')
  })
}
</script>

<template>
  <full-screen-section
    v-slot="{cardRounded }"
    bg="login"
  >
    <card-component
      class="shadow-lg w-11/12 max-h-modal md:w-4/5 lg:w-3/5 z-50"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <field
        v-for="(item, index) in getRegisterFields"
        :key="index"
        :label="item.column"
        :help="item.message"
      >
        <div
          v-if="item.type === 'password'"
        >
          <control
            v-model="form[item.field]"
            :icon="module[item.icon]"
            :name="item.column"
            type="password"
          />
        </div>
        <div
          v-else
        >
          <control
            v-model="form[item.field]"
            :icon="module[item.icon]"
            :name="item.column"
          />
        </div>
      </field>

      <divider />

      <jb-buttons>
        <jb-button
          color="info"
          type="submit"
          label="Register"
        />
        <jb-button
          to="/login"
          color="info"
          label="Login"
          outline
        />
      </jb-buttons>
    </card-component>
  </full-screen-section>
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="5000"
  />
</template>
