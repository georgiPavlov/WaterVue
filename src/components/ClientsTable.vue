<script setup>
import { computed, onBeforeMount, reactive, ref, toRaw, toRef, watch } from 'vue'
import { useStore } from 'vuex'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Field from '@/components/Field.vue'
import Divider from '@/components/Divider.vue'
import Control from '@/components/Control.vue'

const props = defineProps({
  checkable: Boolean,
  idName: {
    default: 'device_id'
  },
  itemTableColumns: {
    type: Array,
    default: () => []
  },
  updateFields: {
    type: Array,
    default: () => ['']
  },
  rows: {
    type: Array,
    default: () => []
  },
  typeElement: {
    default: 'element'
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

const itemsPaginated = computed(
  () => rows.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
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

const checkedRowsBools = ref([])

const checked = (isChecked, selection) => {
  if (isChecked.value) {
    checkedRowsBools.value.push(isChecked)
    checkedRows.value.push(selection)
  } else {
    console.log('remove')
    checkedRows.value = remove(checkedRows.value, row => row[props.idName] === selection[props.idName])
  }
}

// device logic
const rows = toRef(props, 'rows')

watch(() => rows.value, () => {
  console.log(rows.value)
  console.log('in rows')
})

const getValueByKey = (keyName, row) => {
  if (!row) {
    return 'none'
  }
  return row[keyName]
}

const emit = defineEmits(['delete', 'edit', 'create'])

const confirmClick = mode => {
  emit(mode, selection.value)
}

const confirmClickCreate = mode => {
  console.log('in confirmClickCreate')
  const copy = toRaw(createObj)
  console.log('copy' + copy.label)
  emit(mode, copy)
}

const confirmClickUpdate = mode => {
  console.log('in confirmClickCreate')
  const copy = toRaw(selectionObj)
  emit(mode, copy)
}

const confirmClickBulk = mode => {
  // eslint-disable-next-line no-unused-vars
  const arr = [...checkedRows.value]
  arr.forEach(item => {
    emit(mode, item[props.idName])
    checked(false, item)
  })
  checkedRowsBools.value.forEach(item => {
    item.value = false
  })
}

const clickEmitDelete = () => confirmClick('delete')
const clickEmitBulkDelete = () => confirmClickBulk('delete')
const clickEmitEdit = () => confirmClickUpdate('edit')
const clickEmitCreate = () => confirmClickCreate('create')

const selection = ref()
const selectionObj = reactive({})
const createObj = reactive({})

const sendEmitDelete = (row) => {
  isModalDangerActive.value = true
  selection.value = getValueByKey(props.idName, row)
}

const sendEmitEdit = (row) => {
  isModalActive.value = true
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
}

const convertToReactive = (row) => {
  for (const propertyName in row) {
    selectionObj[propertyName] = row[propertyName]
  }
}

const initSelectionObj = () => {
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    selectionObj[field] = ''
  }
}

const initCreateObj = () => {
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    const initialValue = props.itemTableColumns[propertyName].initialValue
    console.log('init ' + initialValue)
    console.log('init2 ' + props.itemTableColumns[propertyName].initialValue)
    if (initialValue !== undefined) {
      console.log('in undefined check')
      createObj[field] = initialValue
    } else {
      createObj[field] = ''
    }
  }
}

const filteredEvents = () => {
  return props.itemTableColumns.filter(element => {
    return element.create === true
  })
}

onBeforeMount(() => {
  initSelectionObj()
  initCreateObj()
})

const modalCreateElementActive = computed(() => store.getters.getModalCreateElementActive)

const modalDeleteElementActive = computed(() => store.getters.getModalDeleteElementActive)

const createElement = computed(() => ['Create', ' ', props.typeElement].join(''))

const editElement = computed(() => ['Edit', ' ', props.typeElement].join(''))

const DeleteElement = computed(() => ['Delete', ' ', props.typeElement].join(''))

</script>

<template>
  <modal-box
    v-model="isModalActive"
    :large-title="editElement"
    button="success"
    button-label="Save"
    @confirm="clickEmitEdit"
  >
    <field
      v-for="(item, index) in itemTableColumns"
      :key="index"
      :label="item.column"
    >
      <control
        v-model="selectionObj[item.field]"
        :type="item.type"
        :read-only="!!item.readOnly"
      />
    </field>

    <divider />
  </modal-box>

  <modal-box
    v-model="modalCreateElementActive"
    :large-title="createElement"
    button="success"
    has-cancel
    button-label="Save"
    is-model-from-state="modalCreateElementActiveToggle"
    @confirm="clickEmitCreate"
  >
    <field
      v-for="(item, index) in filteredEvents()"
      :key="index"
      :label="item.column"
    >
      <control
        v-model="createObj[item.field]"
        :type="item.type"
      />
    </field>

    <divider />
  </modal-box>

  <modal-box
    v-model="modalDeleteElementActive"
    :large-title="DeleteElement"
    button="success"
    has-cancel
    button-label="Save"
    is-model-from-state="modalDeleteElementActiveToggle"
    @confirm="clickEmitBulkDelete"
  >
    <divider />
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    large-title="Do you want to confirm deletion"
    button="danger"
    has-cancel
    button-label="Delete"
    @confirm="clickEmitDelete"
  />

  <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow[idName]"
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
          @checked="checked($event, row)"
        />
        <td class="image-cell" />
        <td
          v-for="(item, i) in itemTableColumns"
          :key="i"
          :data-label="item.column"
        >
          {{ getValueByKey(item.field, row) }}
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
              @click="sendEmitEdit(row)"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="sendEmitDelete(row)"
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
