<script setup>
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'
import { useRouter, useRoute } from 'vue-router'

const store = useStore()
// eslint-disable-next-line no-unused-vars
const router = useRouter()
// eslint-disable-next-line no-unused-vars
const route = useRoute()

store.commit('user', {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
})

const isAuthenticated = computed(() => store.getters.getAuthenticated)

onBeforeMount(() => {
  if (isAuthenticated.value === false) {
    router.push('/login')
    return
  }
  store.dispatch('fetchDevices')
  store.dispatch('fetchPlans')
  store.dispatch('fetchStatusList')
  store.dispatch('fetchPhotosList')
  store.dispatch('initCurrentDevice')
  if (store.getters.getAuthenticated === false) {
    router.push('/login')
  }
})

const isAsideLgActive = computed(() => store.state.isAsideLgActive)
const overlayClick = () => {
  store.dispatch('asideLgToggle', false)
}
</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <footer-bar />
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
