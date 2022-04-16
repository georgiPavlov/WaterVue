<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiFinance,
  mdiReload,
  mdiChartPie
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardWidget from '@/components/CardWidget.vue'
import CardComponent from '@/components/CardComponent.vue'
import TitleSubBar from '@/components/TitleSubBar.vue'
import CardWithButton from '@/components/CardWithButton'

const titleStack = ref(['Water System'])

const chartData = ref([])

const points = computed(() => store.getters.allDeviceWaterCharts)

const toArrayPoints = computed(() => points.value.map(a => a.water_chart))

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData(10, toArrayPoints.value)
}

const fillChartsCompute = computed(() => fillChartData())

onMounted(() => {
  fillChartData()
})

const store = useStore()

const devices = computed(() => store.getters.allDevices)

const selectedDevice = computed(() => store.getters.getCurrentDevice)

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Dashboard</hero-bar>
  <main-section v-if="devices.length !== 0">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:h-100 mb-6">
      <card-widget
        color="text-emerald-500"
        :icon="mdiAccountMultiple"
        :prefix="selectedDevice.label"
        label="Device"
        :number="-1"
      />
      <card-widget
        color="text-emerald-500"
        :icon="mdiAccountMultiple"
        :number="selectedDevice.water_container_capacity"
        suffix="ml"
        label="Water container capacity"
      />
      <card-widget
        color="text-blue-500"
        :icon="mdiCartOutline"
        :number="selectedDevice.water_level"
        suffix="%"
        label="Water"
      />
      <card-widget
        color="text-red-500"
        :icon="mdiChartTimelineVariant"
        :number="selectedDevice.moisture_level"
        suffix="%"
        label="Moisture"
      />
      <card-widget
        color="text-emerald-500"
        :icon="mdiAccountMultiple"
        prefix="Success"
        label="Status"
        :number="-1"
      />
      <card-widget
        color="text-emerald-500"
        :icon="mdiAccountMultiple"
        prefix="time plan 123"
        label="Running plan"
        :number="-1"
      />
    </div>

    <div class="grid grid-cols-1  xl:grid-cols-2 lg:grid-cols-2 lg:h-100 xl:h-1/6 gap-6 mb-6">
      <CardWithButton
        key="index"
        header="Water Reset"
        message="Perform water reset"
        type="transaction.type"
        name="transaction.name"
        account="transaction.account"
        :show-button="true"
        label="Reset"
      />
      <CardWithButton
        key="index"
        header="Email notification"
        message="Enable or disable notification"
        type="transaction.type"
        name="transaction.name"
        account="transaction.account"
        :show-radio-button="true"
      />
    </div>

    <title-sub-bar
      :icon="mdiChartPie"
      title="Last 10 watering executions"
    />

    <card-component
      title="Water"
      :icon="mdiFinance"
      :header-icon="mdiReload"
      class="mb-10"
      @header-icon-click="fillChartsCompute"
    >
      <div v-if="chartData">
        <line-chart
          :data="chartData"
          class="h-96"
        />
      </div>
    </card-component>
  </main-section>
  <main-section v-if="devices.length === 0">
    <label class="block font-bold mb-2 bg-red-500">No device registered</label>
  </main-section>
</template>
