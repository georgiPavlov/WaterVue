<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { sectionBgLogin } from '@/colors.js'
import MainSection from '@/components/MainSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import { onBeforeMount } from 'vue'

const styles = [
  {
    slug: 'white',
    title: 'White'
  },
  {
    slug: 'basic',
    title: 'Basic'
  }
]

const store = useStore()

store.dispatch('darkMode', false)

const router = useRouter()

onBeforeMount(() => {
  if (store.getters.getAuthenticated === false) {
    router.push('/login')
  } else {
    router.push('/dashboard')
  }
})

const click = slug => {
  store.dispatch('setStyle', slug)
  store.dispatch('darkMode', false)
  router.push('/login')
}
</script>

<template>
  <main-section
    :class="sectionBgLogin"
    class="min-h-screen"
  >
    <h1 class="shadow text-4xl md:text-6xl text-center text-green-900 font-bold mt-6 mb-3 md:mt-12 md:mb-6">
      Pick a style&hellip;
    </h1>
    <h2 class="shadow text-xl md:text-2xl text-center bg-gray-700 mb-12 md:mb-24">
      Style switching with a single <code class="px-1.5 py-0.5 rounded bg-gray-700 bg-opacity-20">click</code>
    </h2>
    <div class="shadow grid gap-6 grid-cols-1 lg:grid-cols-2 px-6 max-w-6xl mx-auto">
      <card-component
        v-for="style in styles"
        :key="style"
        class="cursor-pointer shadow-2xl"
        rounded="rounded-2xl"
        hoverable
        @click="click(style.slug)"
      >
        <div class="shadow mb-3 md:mb-6">
          <img
            :src="`https://static.justboil.me/templates/one/small/${style.slug}.png`"
            width="955"
            height="540"
          >
        </div>

        <h1 class="shadow text-xl md:text-2xl font-black">
          {{ style.title }}
        </h1>
        <h2 class="shadow text-lg md:text-xl">
          & Dark mode
        </h2>
      </card-component>
    </div>
  </main-section>
</template>
