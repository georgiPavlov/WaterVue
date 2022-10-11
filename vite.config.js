import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [vue(), mkcert()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
