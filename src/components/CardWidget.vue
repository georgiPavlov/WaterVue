<script setup>
import CardComponent from '@/components/CardComponent.vue'
import GrowingNumber from '@/components/GrowingNumber.vue'
import Icon from '@/components/Icon.vue'
import Level from '@/components/Level.vue'
import TrendPill from '@/components/TrendPill.vue'

defineProps({
  number: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: null
  },
  defaultBehaviour: {
    type: Boolean,
    default: true
  },
  prefix: {
    type: String,
    default: null
  },
  suffix: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  },
  trend: {
    type: String,
    default: null
  },
  trendType: {
    type: String,
    default: null
  },
  formatHeight: {
    type: Number,
    default: 170
  },
  formatWidth: {
    type: Number,
    default: 170
  }
})

</script>

<template>
  <card-component>
    <level mobile>
      <div>
        <h3 class="text-lg leading-tight text-gray-500 dark:text-gray-400">
          {{ label }}
        </h3>
        <h1 class="text-3xl leading-tight font-semibold">
          <growing-number
            :value="number"
            :prefix="prefix"
            :suffix="suffix"
          />
        </h1>
      </div>
      <icon
        v-if="icon"
        :default-behaviour="defaultBehaviour"
        :format-height="formatHeight"
        :format-width="formatWidth"
        :path="icon"
        size="100"
        w=""
        h="h-20"
        :class="color"
      />
    </level>
    <level
      v-if="trend"
      class="mb-0"
      mobile
    >
      <trend-pill
        :trend="trend"
        :trend-type="trendType"
        small
      />
    </level>
  </card-component>
</template>
