<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  defaultBehaviour: {
    type: Boolean,
    default: true
  },
  w: {
    type: String,
    default: 'w-6'
  },
  h: {
    type: String,
    default: 'h-6'
  },
  size: {
    type: [String, Number],
    default: 16
  },
  formatHeight: {
    type: Number,
    default: 100
  },
  formatWidth: {
    type: Number,
    default: 100
  }
})

const store = useStore()

const imageFunc = computed(() => {
  const src = 'image/'
  console.log('dark mode ' + darkMode.value)
  if (darkMode.value) {
    return src.concat(props.path).concat('-invert.png')
  } else {
    return src.concat(props.path).concat('.png')
  }
})

const darkMode = computed(() => store.state.darkMode)

const spanClass = computed(() => `inline-flex justify-center items-center ${props.w} ${props.h}`)
</script>

<template>
  <span :class="spanClass">
    <div v-if="defaultBehaviour === true">
      <svg
        viewBox="0 0 24 24"
        :width="size"
        :height="size"
        class="inline-block"
      >
        <path
          fill="currentColor"
          :d="path"
        />
      </svg>
    </div>
    <div v-else>
      <img
        class="max-w-full h-auto"
        :width="formatWidth"
        :height="formatHeight"
        :src="imageFunc"
        alt="capacity"
      />
    </div></span>
</template>
