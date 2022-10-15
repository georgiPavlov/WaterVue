<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import Level from '@/components/Level.vue'
import JbButton from '@/components/JbButton.vue'
import Field from '@/components/Field.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import VueBasicAlert from 'vue-basic-alert'
import { useStore } from 'vuex'

const buttonSettingsModel = ref([])

const alert = ref(null)

const enableEmailNotification = computed(() => buttonSettingsModel.value.indexOf('enableEmailNotification') > -1)

watch(() => enableEmailNotification.value, () => {
  if (buttonSettingsModel.value === null) {
    return
  }
  if (alert.value === null) {
    return
  }
  console.log(
    'Watch props.selected function called with args:' + enableEmailNotification.value)
  alert.value.showAlert(
    'success',
    'water reset'
  )
})

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  header: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Done'
  },
  showRadioButton: {
    type: Boolean,
    default: false
  },
  showButton: {
    type: Boolean,
    default: false
  }
})
const store = useStore()

const updateSelectedDevice = () => {
  const selectedDevice = computed(() => store.getters.getCurrentDevice)
  selectedDevice.value.water_reset = true
  store.dispatch('updateDevice', selectedDevice.value)
  store.dispatch('fetchDevices')
  const selection = computed(() => store.getters.getDeviceById(selectedDevice.value.device_id))
  store.dispatch('setDeviceLabel', selection.value)
  store.dispatch('fetchDeviceWaterCharts', selection.value.device_id)
  alert.value.showAlert(
    'success',
    'water reset operation send to device'
  )
}

const updateSendEmail = (value) => {
  const selectedDevice = computed(() => store.getters.getCurrentDevice)
  if (value === true || value[0] === 'enableEmailNotification') {
    selectedDevice.value.send_email = true
  } else {
    selectedDevice.value.send_email = false
  }
  console.log(JSON.stringify(selectedDevice.value))
  store.dispatch('updateDevice', selectedDevice.value)
}

onBeforeMount(() => {
  const selectedDevice = computed(() => store.getters.getCurrentDevice)
  if (selectedDevice.value.send_email === true) {
    buttonSettingsModel.value[0] = 'enableEmailNotification'
  }
})

</script>

<template>
  <div id="app1">
    <card-component
      class="mb-10 border-gray-500  cursor-pointer"
      hoverable
    >
      <level>
        <level type="justify-start">
          <div class="text-center space-y-1 md:text-left md:mr-6">
            <h4 class="text-xl">
              {{ header }}
            </h4>
            <p class="text-gray-500 dark:text-gray-400">
              <b>{{ message }}</b>
            </p>
          </div>
        </level>
        <div class="text-center md:text-right space-y-1">
          <jb-button
            v-if="showButton"
            :label="props.label"
            color="success"
            @click="updateSelectedDevice"
          />
          <vue-basic-alert
            ref="alert"
            :duration="500"
            :close-in="5000"
          />
          <field>
            <check-radio-picker
              v-if="showRadioButton"
              v-model="buttonSettingsModel"
              name="buttons-switch"
              type="switch"
              :options="{ enableEmailNotification: 'Notification' }"
              @update:modelValue="updateSendEmail"
            />
          </field>
        </div>
      </level>
    </card-component>
  </div>
</template>
