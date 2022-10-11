import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [
    vue(),
    mkcert(),
    VitePWA(
      {
        registerType: 'autoUpdate',
        workbox: {
          maximumFileSizeToCacheInBytes: 50000000
        }
      }
    )
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  base: './'
})
