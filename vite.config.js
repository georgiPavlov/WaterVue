import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import mkcert from 'vite-plugin-mkcert'
import pluginRewriteAll from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [
    vue(),
    pluginRewriteAll(),
    mkcert(),
    VitePWA(
      {
        workbox: {
          maximumFileSizeToCacheInBytes: 50000000
        },
        manifest: {
          icons: [
            {
              src: 'img/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'img/icons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }
    )
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env': {}
  }
})
