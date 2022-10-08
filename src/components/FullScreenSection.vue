<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { sectionBgLogin, sectionBgError } from '@/colors'
import MainSection from '@/components/MainSection.vue'

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: value => ['login', 'error'].includes(value)
  }
})

const store = useStore()

// eslint-disable-next-line no-unused-vars
const darkMode = computed(() => store.state.darkMode)

// eslint-disable-next-line no-unused-vars
const colorClass = computed(() => {
  switch (props.bg) {
    case 'login':
      return sectionBgLogin
    case 'error':
      return sectionBgError
  }

  return ''
})
</script>

<template>
  <main-section
    class="flex h-screen items-center justify-center"
    :class="colorClass"
  >
    <slot
      card-class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl"
      card-rounded="rounded-lg"
    />
  </main-section>
</template>
