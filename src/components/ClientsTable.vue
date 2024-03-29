<script setup>
import { computed, onBeforeMount, reactive, ref, toRaw, toRef, watch } from 'vue'
import { useStore } from 'vuex'
import { mdiEye, mdiTrashCan, mdiRestart, mdiRayVertex, mdiFileDownload } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Field from '@/components/Field.vue'
import Divider from '@/components/Divider.vue'
import Control from '@/components/Control.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'
import VueBasicAlert from 'vue-basic-alert'

const alert = ref(null)

const props = defineProps({
  checkable: Boolean,
  idName: {
    default: 'device_id'
  },
  buttonSettingsModel: {
    type: Boolean,
    default: false
  },
  showRadioButtons1: {
    type: Boolean,
    default: false
  },
  showItemsAlways: {
    type: Boolean,
    default: true
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
  },
  limit: {
    type: Boolean,
    default: false
  },
  limitNumber: {
    type: Number,
    default: 100
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  showDownloads: {
    type: Boolean,
    default: false
  }
})

const store = useStore()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const lightBgStyle = computed(() => store.state.lightBgStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const isModalActiveItems = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const itemsPaginated = computed(() => {
  return rows.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
}
)

const numPages = computed(() => Math.ceil(rows.value.length / perPage.value))

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
    checkedRows.value = remove(checkedRows.value, row => row[props.idName] === selection[props.idName])
  }
}

// device logic
const rows = toRef(props, 'rows')

watch(() => rows.value, () => {
  console.log(rows.value)
})

const getValueByKey = (keyName, row) => {
  if (!row) {
    return 'none'
  }
  // console.log('test32432423 ' + keyName)
  // console.log(row[keyName])
  return row[keyName]
}

const confirmClick = (mode, errorsHandler) => {
  emit(mode, selection.value, errorsHandler)
}

const confirmClickRadioElements = (mode, modelValue) => {
  emit(mode, modelValue)
  initCreateObj()
}

const confirmClickItem = (mode, index) => {
  emit(mode, selectionObj, index)
}

const confirmClickItemNew = (mode, index) => {
  emit(mode, createObj, index)
}

const confirmClickItemCreateObject = (mode) => {
  initCreateObj()
  emit(mode, createObj)
}

const confirmClickCreate = (mode, errorsHandler) => {
  initCreateObjWithInitial()
  const copy = toRaw(createObj)
  console.log('aqwerty' + copy)
  emit(mode, copy, errorsHandler)
}

const confirmClickUpdate = (mode, errorsHandler) => {
  const copy = toRaw(selectionObj)
  emit(mode, copy, errorsHandler)
}

const confirmClickBulk = (mode, errorsHandler) => {
  // eslint-disable-next-line no-unused-vars
  const arr = [...checkedRows.value]
  arr.forEach(item => {
    emit(mode, item[props.idName], errorsHandler)
    checked(false, item)
  })
  checkedRowsBools.value.forEach(item => {
    item.value = false
  })
}

const sendEmitDownload = (mode, row) => {
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
  emit(mode, selection.value)
}

const emit = defineEmits(['delete', 'edit', 'create', 'delete_item', 'create_item', 'radio_elements'])
const clickEmitDelete = (errorsHandler) => confirmClick('delete', errorsHandler)
const clickEmitBulkDelete = (errorsHandler) => confirmClickBulk('delete', errorsHandler)
const clickEmitEdit = (errorsHandler) => confirmClickUpdate('edit', errorsHandler)
const clickRadioElements = (modelValue) => confirmClickRadioElements('radio_elements', modelValue)
const clickCancelElement = () => returnSelectionToOriginalValue()
const clickEmitCreate = (errorsHandler) => confirmClickCreate('create', errorsHandler)

const clickEmitDeleteItem = (index) => confirmClickItem('delete_item', index)
const clickEmitDeleteItemNew = (index) => confirmClickItemNew('delete_item_new', index)
const clickEmitCreateItem = () => confirmClickItem('create_item')
const clickEmitCreateItemCreateObject = () => confirmClickItemCreateObject('create_item_object_creator')

const clickEmitDownload = (row) => sendEmitDownload('download', row)
const sendEmitViewItemsStartEmit = (row) => sendEmitViewItemsStart(row, 'restart_operation')
const sendRestartExecutionEmit = (row) => sendRestartExecution(row, 'restart_operation_on_run')

const selection = ref()
const selectionObj = reactive({})
const selectionObjTemp = {}
const createObj = reactive({})

const returnSelectionToOriginalValue = () => {
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    selectionObj[field] = selectionObjTemp[field]
    setRowByCurrentSelection(field)
  }
}

const setRowByCurrentSelection = (field) => {
  for (const r in rows.value) {
    if (rows.value[r][props.idName] === selection.value) {
      rows.value[r][field] = selectionObj[field]
    }
  }
}

const sendEmitDelete = (row) => {
  isModalDangerActive.value = true
  selection.value = getValueByKey(props.idName, row)
}

const sendEmitEdit = (row) => {
  store.dispatch('modalUpdateElementActiveToggle')
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
}

const sendEmitViewItems = (row) => {
  isModalActiveItems.value = true
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
}

const sendEmitViewItemsStart = (row, mode) => {
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
  emit(mode, selection.value)
  alert.value.showAlert(
    'success',
    'Plan restarted: ' + selection.value
  )
}

const sendRestartExecution = (row, mode) => {
  selection.value = getValueByKey(props.idName, row)
  convertToReactive(row)
  emit(mode, selection.value)
  const plan = store.getters.getPlansByName(selection.value)
  if (plan.plan_type === 'basic') {
    alert.value.showAlert(
      'warning',
      'Can not stop running plan: ' + selection.value
    )
  } else {
    alert.value.showAlert(
      'warning',
      'Running plan stopped: ' + selection.value
    )
  }
}

const convertToReactive = (row) => {
  const copy = toRaw(row)
  for (const propertyName in row) {
    selectionObj[propertyName] = row[propertyName]
    if (copy[propertyName] instanceof Array) {
      selectionObjTemp[propertyName] = [...copy[propertyName]]
      continue
    }
    selectionObjTemp[propertyName] = copy[propertyName]
  }
}

const initSelectionObj = () => {
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    const hidden = props.itemTableColumns[propertyName].hide
    if (hidden !== undefined) {
      continue
    }
    selectionObj[field] = ''
    selectionObjTemp[field] = ''
  }
}

const initCreateObj = () => {
  for (const variableKey in createObj) {
    console.log('vat key' + variableKey)
    delete createObj[variableKey]
  }
  console.log(JSON.stringify(createObj))
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    const initialValue = props.itemTableColumns[propertyName].initialValue
    console.log('initialValue' + initialValue)
    if (initialValue !== undefined) {
      createObj[field] = initialValue
    } else {
      if (props.itemTableColumns[propertyName].type === 'Array') {
        createObj[field] = {}
      } else {
        createObj[field] = ''
      }
    }
  }
}

const initCreateObjWithInitial = () => {
  console.log('some test123' + JSON.stringify(createObj))
  for (const propertyName in props.itemTableColumns) {
    const field = props.itemTableColumns[propertyName].field
    const initialValue = props.itemTableColumns[propertyName].initialValue
    console.log('initialValue' + initialValue)
    if (initialValue !== undefined && field === 'plan_type') {
      createObj[field] = initialValue
    }
  }
  console.log(' after some test123' + JSON.stringify(createObj))
}

const filteredEvents = () => {
  return props.itemTableColumns.filter(element => {
    return element.create === true
  })
}

const filteredEventsEdit = () => {
  return props.itemTableColumns.filter(element => {
    return element.hide === undefined
  })
}

onBeforeMount(() => {
  initSelectionObj()
  initCreateObj()
})

const modalCreateElementActive = computed(() => store.getters.getModalCreateElementActive)

const modalUpdateElementActive = computed(() => store.getters.getModalUpdateElementActive)

const modalDeleteElementActive = computed(() => store.getters.getModalDeleteElementActive)

const createElement = computed(() => ['Create', ' ', props.typeElement].join(''))

const editElement = computed(() => ['Edit', ' ', props.typeElement].join(''))

const DeleteElement = computed(() => ['Do you confirm deletion of', ' ', props.typeElement].join(''))

const itemsElement = computed(() => ['', ' ', props.itemsBox].join(''))

const buttonCompareValue = computed(() => store.getters.getClickButtonCompareValue)

watch(() => buttonCompareValue.value, () => {
  console.log(buttonCompareValue.value)
})

const buttonSettingsModelComputed = computed(() => {
  return store.getters.buttonSettingsModel || props.showItemsAlways
})

const radioElements = ref([])

const showXButton = (item) => {
  return selectionObj[item.field].length
}

const showXButtonNew = (item) => {
  return createObj[item.field].length
}

const showItemsForNewItem = () => {
  if (!props.showRadioButtons1) {
    return true
  } else {
    return radioElements.value.length !== 0
  }
}

</script>

<template>
  <modal-box
    v-model="modalUpdateElementActive"
    :large-title="editElement"
    button="success"
    button-label="Save"
    has-cancel
    is-model-from-state="modalUpdateElementActiveToggle"
    is-model-from-state-errors="cleanErrors"
    is-model-from-state-errors-get="getErrors"
    @confirm="clickEmitEdit"
    @cancel="clickCancelElement"
  >
    <field
      v-for="(item, index) in filteredEventsEdit()"
      :key="index"
      :label="item.column"
    >
      <control
        v-if="item.type !== 'Array'"
        v-model="selectionObj[item.field]"
        :type="item.type"
        :read-only="!!item.readOnly"
      />

      <div
        v-if="item.type === 'Array'"
        class="relative"
      >
        <field
          v-for="(i, indexArr) in selectionObj[item.field]"
          :key="indexArr"
        >
          <div class="grid gap-6 lg:grid-cols-3 lg:h-100 mb-6">
            <div
              v-for="(arrItem, indexItem) in i"
              :key="indexItem"
            >
              <control
                v-if="item.arr[indexItem] === 'select'"
                v-model="i[indexItem]"
                type="select"
                :read-only="!!item.readOnly"
                :model-value="i[indexItem]"
                :options="weekdays"
              />
              <control
                v-if="item.arr[indexItem] !== 'select'"
                v-model="i[indexItem]"
                type="time"
                :read-only="!!item.readOnly"
              />
            </div>
            <div
              v-if="showXButton(item)"
            >
              <jb-buttons>
                <jb-button
                  v-if="selectionObj[item.field].length"
                  label="X"
                  color="danger"
                  @click="clickEmitDeleteItem(indexArr)"
                />
              </jb-buttons>
            </div>
          </div>
        </field>
        <jb-buttons>
          <jb-button
            label="+"
            color="info"
            @click="clickEmitCreateItem"
          />
        </jb-buttons>
      </div>
    </field>

    <divider />
  </modal-box>
  <modal-box
    v-model="isModalActiveItems"
    :large-title="itemsElement"
  >
    <field
      v-for="(item, index) in itemTableColumns"
      :key="index"
    >
      <div
        v-if="item.type === 'Array'"
        class="relative"
      >
        <field
          v-for="(i, indexArr) in selectionObj[item.field]"
          :key="indexArr"
        >
          <div class="grid gap-6 lg:grid-cols-3 lg:h-100 mb-6">
            <div
              v-for="(arrItem, indexItem) in i"
              :key="indexItem"
            >
              <control
                v-model="i[indexItem]"
                :read-only="true"
              />
            </div>
          </div>
        </field>
      </div>
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
    is-model-from-state-errors="cleanErrors"
    is-model-from-state-errors-get="getErrors"
    @confirm="clickEmitCreate"
  >
    <field>
      <check-radio-picker
        v-if="showRadioButtons1"
        v-model="radioElements"
        name="buttons-switch"
        type="switch"
        :options="{ basic: 'Basic', time: 'Time', moisture: 'Moisture' }"
        @update:modelValue="clickRadioElements"
      />
    </field>
    <div
      v-if="buttonSettingsModelComputed"
    >
      <div v-if="showItemsForNewItem()">
        <field
          v-for="(item, index) in filteredEvents()"
          :key="index"
          :label="item.column"
        >
          <control
            v-if="item.type !== 'Array'"
            v-model="createObj[item.field]"
            :type="item.type"
            :limit="limit"
            :limit-number="limitNumber"
          />
          <div
            v-if="item.type === 'Array'"
            class="relative"
          >
            <field
              v-for="(i, indexArr) in createObj[item.field]"
              :key="indexArr"
            >
              <div class="grid gap-6 lg:grid-cols-3 lg:h-100 mb-6">
                <div
                  v-for="(arrItem, indexItem) in i"
                  :key="indexItem"
                >
                  <control
                    v-if="item.arr[indexItem] === 'select'"
                    v-model="i[indexItem]"
                    type="select"
                    :read-only="!!item.readOnly"
                    :model-value="i[indexItem]"
                    :options="weekdays"
                  />
                  <control
                    v-if="item.arr[indexItem] !== 'select'"
                    v-model="i[indexItem]"
                    type="time"
                    :read-only="!!item.readOnly"
                    :hidden="item.hide === true"
                  />
                </div>
                <div
                  v-if="showXButtonNew(item)"
                >
                  <jb-buttons>
                    <jb-button
                      v-if="createObj[item.field].length"
                      label="X"
                      color="danger"
                      @click="clickEmitDeleteItemNew(indexArr)"
                    />
                  </jb-buttons>
                </div>
              </div>
            </field>
            <jb-buttons>
              <jb-button
                label="+"
                color="info"
                @click="clickEmitCreateItemCreateObject"
              />
            </jb-buttons>
          </div>
        </field>
      </div>
    </div>
    <divider />
  </modal-box>
  <modal-box
    v-model="modalDeleteElementActive"
    :large-title="DeleteElement"
    button="warning"
    has-cancel
    button-label="Save"
    is-model-from-state="modalDeleteElementActiveToggle"
    is-model-from-state-errors="cleanErrors"
    is-model-from-state-errors-get="getErrors"
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
  <div
    v-if="buttonSettingsModelComputed"
  >
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
            <div v-if="item.type !== 'Array' && item.type !== 'button' && item.type !== 'checkbox'">
              {{ getValueByKey(item.field, row) }}
            </div>
            <div v-else-if="item.type === 'button'">
              <div v-if="getValueByKey(item.field, row) !== buttonCompareValue">
                <jb-button
                  color="info"
                  :icon="mdiRestart"
                  small
                  @click="sendEmitViewItemsStartEmit(row)"
                />
              </div>
              <div v-else>
                <jb-button
                  color="success"
                  :icon="mdiRayVertex"
                  small
                  @click="sendRestartExecutionEmit(row)"
                />
              </div>
            </div>
            <div
              v-else-if="item.type === 'Array'"
              class="place-items-center"
            >
              <jb-button
                color="info"
                :icon="mdiEye"
                small
                @click="sendEmitViewItems(row)"
              />
            </div>
            <div v-else-if="item.type === 'checkbox'">
              <div v-if="getValueByKey(item.field, row) !== true">
                <jb-button
                  color="danger"
                />
              </div>
              <div v-else>
                <jb-button
                  color="success"
                />
              </div>
            </div>
          </td>
          <td class="actions-cell">
            <jb-buttons
              type="justify-start lg:justify-end"
              no-wrap
            >
              <jb-button
                v-if="showInfo === true"
                color="info"
                :icon="mdiEye"
                small
                @click="sendEmitEdit(row)"
              />
              <jb-button
                v-if="showDownloads === true"
                color="info"
                :icon="mdiFileDownload"
                small
                @click="clickEmitDownload(row)"
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
  </div>
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
  <vue-basic-alert
    ref="alert"
    :duration="500"
    :close-in="5000"
  />
</template>
