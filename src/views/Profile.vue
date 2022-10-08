<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import * as module from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import TitleBar from '@/components/TitleBar.vue'
import Divider from '@/components/Divider.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import Notification from '@/components/Notification.vue'
import { useRouter } from 'vue-router'
import VueBasicAlert from 'vue-basic-alert'

const router = useRouter()

const store = useStore()

const alert = ref(null)

const form = reactive({})

const formPassword = reactive({})

const isAuthenticated = computed(() => store.getters.getAuthenticated)

const getProfileFields = computed(() => store.getters.getProfileFields)

const getProfileParams = computed(() => store.getters.getProfileParams)

// eslint-disable-next-line no-unused-vars
const getChangePasswordFields = computed(() => store.getters.getChangePasswordFields)

onBeforeMount(() => {
  if (isAuthenticated.value !== true) {
    router.push('/profile')
  }
  store.dispatch('profileUpdateGet').then(() => {
    copyValuesToForm(getProfileFields, getProfileParams, form, false)
    copyValuesToForm(getChangePasswordFields, passwordFormEmpty, formPassword, true)
  })
})

const copyValuesToForm = (fields_, params_, form_, reactive) => {
  const fields = fields_.value
  for (const f in fields) {
    const field = fields[f].field
    if (reactive === true) {
      form_[field] = params_[field]
    } else {
      form_[field] = params_.value[field]
    }
  }
}
const titleStack = ref(['Admin', 'Profile'])

const passwordFormEmpty = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

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

const submitProfile = () => {
  form.password = formPassword.password
  console.log('test register' + JSON.stringify(form))
  store.dispatch('profileUpdate', form).then(() => {
    handleErrorsLocal('successfully updated profile')
  })
  copyValuesToForm(getChangePasswordFields, passwordFormEmpty, formPassword, true)
}

const submitPass = () => {
  console.log('test register' + JSON.stringify(form))
  store.dispatch('profileUpdatePass', formPassword).then(() => {
    handleErrorsLocal('successfully updated profile password')
  })
  copyValuesToForm(getChangePasswordFields, passwordFormEmpty, formPassword, true)
}
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <notification
      color="warning"
      :icon="mdiFeather"
      :outline="notificationsOutline"
    >
      <b>Important. 'Current password'</b> must be entered in order to update profile fields
    </notification>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <card-component
        title="Edit Profile"
        :icon="mdiAccountCircle"
        form
        @submit.prevent="submitProfile"
      >
        <field
          v-for="(item, index) in getProfileFields"
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
            label="Submit"
          />
        </jb-buttons>
      </card-component>

      <card-component
        title="Change Password"
        :icon="mdiLock"
        form
        @submit.prevent="submitPass"
      >
        <field
          v-for="(item, index) in getChangePasswordFields"
          :key="index"
          :label="item.column"
          :help="item.message"
        >
          <div
            v-if="item.type === 'password'"
          >
            <control
              v-model="formPassword[item.field]"
              :icon="module[item.icon]"
              :name="item.column"
              type="password"
            />
          </div>
          <div
            v-else
          >
            <control
              v-model="formPassword[item.field]"
              :icon="module[item.icon]"
              :name="item.column"
            />
          </div>

        </field>

        <divider />

        <jb-buttons>
          <jb-button
            type="submit"
            color="info"
            label="Submit"
          />
          <jb-button
            color="info"
            label="Options"
            outline
          />
        </jb-buttons>
      </card-component>
    </div>
  </main-section>
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="2000"
  />
</template>
