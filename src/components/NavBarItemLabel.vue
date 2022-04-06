<script setup>
import Icon from '@/components/Icon.vue'

defineProps({
  icon: {
    type: String,
    default: null
  },
  label: {
    type: String,
    required: true
  },
  device_select: {
    type: String,
    default: 'no device registered'
  },
  isDesktopIconOnly: Boolean,
  showDevice: {
    type: Boolean,
    default: false
  }
}
)
</script>

<template>
  <slot />
  <icon
    v-if="icon"
    :path="icon"
    class="transition-colors"
  />
  <span
    class="px-2 transition-colors"
    :class="{ 'lg:hidden':isDesktopIconOnly && icon }"
  >{{ label }}</span>
  <span
    v-if="showDevice"
    class="px-2 transition-colors"
    :class="{ 'lg:hidden':isDesktopIconOnly && icon }"
  >{{ device_select }}</span>
</template>
