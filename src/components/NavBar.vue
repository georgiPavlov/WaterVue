<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import {
  mdiForwardburger,
  mdiBackburger,
  mdiClose,
  mdiDotsVertical,
  mdiMenu,
  mdiDevices,
  mdiAccount,
  mdiLogout,
  mdiThemeLightDark
} from '@mdi/js'
import NavBarItem from '@/components/NavBarItem.vue'
import NavBarItemLabel from '@/components/NavBarItemLabel.vue'
import NavBarMenu from '@/components/NavBarMenu.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'
import { useRouter } from 'vue-router'

const store = useStore()

const router = useRouter()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const username = computed(() => store.getters.getUsername_)

const toggleLightDark = () => {
  store.dispatch('darkMode')
}
store.dispatch('initCurrentDevice')

onMounted(() => {
  const device = computed(() => store.getters.getCurrentDevice)
  console.log(device.value)
  if (device.value !== null) {
    store.dispatch('fetchDeviceWaterCharts', device.value.device_id)
  }
})

const isNavBarVisible = computed(() => !store.state.isFullScreen)

const isAsideMobileExpanded = computed(() => store.state.isAsideMobileExpanded)

const menuToggleMobileIcon = computed(() => isAsideMobileExpanded.value ? mdiBackburger : mdiForwardburger)

const menuToggleMobile = () => store.dispatch('asideMobileToggle')

const isMenuNavBarActive = ref(false)

const menuNavBarToggleIcon = computed(() => isMenuNavBarActive.value ? mdiClose : mdiDotsVertical)

const menuNavBarToggle = () => {
  isMenuNavBarActive.value = !isMenuNavBarActive.value
}

const menuOpenLg = () => {
  store.dispatch('asideLgToggle', true)
}

const allDevices = computed(() => store.getters.allDevices)

const selectedDevice = computed(() => store.getters.getCurrentDevice)
const selectedDeviceLabel = computed(() => {
  if (allDevices.value.length === 0) {
    return 'None'
  }
  return selectedDevice.value === null ? 'None' : selectedDevice.value.label
})

const changeSelectedDevice = (deviceId) => {
  const selection = computed(() => store.getters.getDeviceById(deviceId))
  store.dispatch('setDeviceLabel', selection.value)
  store.dispatch('fetchDeviceWaterCharts', selection.value.device_id)
  store.dispatch('fetchStatusList')
  store.dispatch('fetchPhotosList')
}

const logOut = () => {
  store.dispatch('setToken', '')
  store.dispatch('setIsAuthenticated', 401)
  store.dispatch('setCurrentDeviceToNull')
  router.push('/login')
  console.log('out')
}

</script>

<template>
  <nav
    v-show="isNavBarVisible"
    class="top-0 left-0 right-0 fixed flex bg-white h-14 border-b z-30 w-screen
    transition-position xl:pl-60 lg:w-auto lg:items-stretch dark:bg-gray-900 dark:border-gray-800"
    :class="[lightBorderStyle, {'ml-60 lg:ml-0':isAsideMobileExpanded}]"
  >
    <div
      class="flex-1 items-stretch flex h-14"
    >
      <nav-bar-item
        type="flex lg:hidden"
        @click.prevent="menuToggleMobile"
      >
        <icon
          :path="menuToggleMobileIcon"
          size="24"
        />
      </nav-bar-item>
      <nav-bar-item
        type="hidden lg:flex xl:hidden"
        @click.prevent="menuOpenLg"
      >
        <icon
          :path="mdiMenu"
          size="24"
        />
      </nav-bar-item>
    </div>
    <div class="flex-none items-stretch flex h-14 lg:hidden">
      <nav-bar-item @click.prevent="menuNavBarToggle">
        <icon
          :path="menuNavBarToggleIcon"
          size="24"
        />
      </nav-bar-item>
    </div>
    <div
      class="absolute w-screen top-14 left-0 bg-white shadow
        lg:w-auto lg:items-stretch lg:flex lg:grow lg:static lg:border-b-0 lg:overflow-visible lg:shadow-none dark:bg-gray-900"
      :class="[isMenuNavBarActive ? 'block' : 'hidden']"
    >
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible lg:flex lg:items-stretch lg:justify-end lg:ml-auto"
      >
        <nav-bar-menu has-divider>
          <nav-bar-item-label
            :icon="mdiMenu"
            label="Devices"
            :show-device="true"
            :device_select="selectedDeviceLabel"
          >
            <div />
          </nav-bar-item-label>
          <template #dropdown>
            <template
              v-for="(device_el, index) in allDevices"
              :key="index"
            >
              <nav-bar-item @click.prevent="changeSelectedDevice(device_el.device_id)">
                <nav-bar-item-label
                  :icon="mdiDevices"
                  :label="device_el.label"
                />
              </nav-bar-item>
            </template>
          </template>
        </nav-bar-menu>
        <nav-bar-menu has-divider>
          <nav-bar-item-label :label="username" />
          <template #dropdown>
            <nav-bar-item to="/profile">
              <nav-bar-item-label
                :icon="mdiAccount"
                label="My Profile"
              />
            </nav-bar-item>
            <divider nav-bar />
          </template>
        </nav-bar-menu>
        <nav-bar-item
          has-divider
          is-desktop-icon-only
          @click.prevent="toggleLightDark"
        >
          <nav-bar-item-label
            :icon="mdiThemeLightDark"
            label="Light/Dark"
            is-desktop-icon-only
          />
        </nav-bar-item>
        <nav-bar-item
          is-desktop-icon-only
          @click.prevent="logOut"
        >
          <nav-bar-item-label
            :icon="mdiLogout"
            label="Log out"
            is-desktop-icon-only
          />
        </nav-bar-item>
      </div>
    </div>
  </nav>
</template>
