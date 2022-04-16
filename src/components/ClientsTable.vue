<script setup>
import { computed, watch, ref, toRef } from 'vue'
import { useStore } from 'vuex'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'

const props = defineProps({
  checkable: Boolean,
  itemTableColumns: {
    type: Array,
    default: () => [
      {
        column: 'purple',
        field: 'minivan'
      },
      {
        column: 'green',
        field: 'car'
      },
      {
        column: 'green1',
        field: 'carq'
      },
      {
        column: 'green1',
        field: 'car1'
      }
    ]
  },
  updateFields: {
    type: Array,
    default: () => ['']
  },
  rows: {
    type: Array,
    required: true,
    default: () => [{
      device_id: '77',
      label: 'gogi2',
      water_level: 1000,
      moisture_level: 0,
      water_container_capacity: 2000,
      water_reset: false
    },
    {
      device_id: '888',
      label: 'gogi',
      water_level: 70,
      moisture_level: 0,
      water_container_capacity: 2000,
      water_reset: true
    },
    {
      device_id: '888',
      label: 'gogi',
      water_level: 70,
      moisture_level: 0,
      water_container_capacity: 2000,
      water_reset: true
    },
    {
      device_id: '888',
      label: 'gogi',
      water_level: 70,
      moisture_level: 0,
      water_container_capacity: 2000,
      water_reset: true
    }
    ]
  }
})

const store = useStore()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const lightBgStyle = computed(() => store.state.lightBgStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.clients)

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const barcodePulse = toRef(props, 'rows')

watch(() => barcodePulse.value, () => {
  console.log(barcodePulse.value)
  console.log('in rows')
})

const itemsPaginated = computed(
  () => barcodePulse.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach(item => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
  }
}
</script>

<template>
  <modal-box
    v-model="isModalActive"
    title="Sample modal"
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    large-title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
      :class="lightBgStyle"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th
          v-for="(item, index) in itemTableColumns"
          :key="index"
        >
          {{ item.column }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in itemsPaginated"
        :key="index"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <checkbox-cell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="image-cell">
          <user-avatar
            username="client.name"
            class="image"
          />
        </td>
        <td
          v-for="(item, i) in itemTableColumns"
          :key="i"
          :data-label="item.column"
        >
          test
        </td>
        <td class="actions-cell">
          <jb-buttons
            type="justify-start lg:justify-end"
            no-wrap
          >
            <jb-button
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </jb-buttons>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :outline="darkMode"
          small
          @click="currentPage = page"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>
