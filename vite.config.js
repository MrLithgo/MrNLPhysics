import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  },
  build: {
    // 🔹 Remove the big modulepreload polyfill Lighthouse is moaning about
    polyfillModulePreload: false,

    // 🔹 Split Vue into its own chunk so Lighthouse sees smaller, focused files
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue']
        }
      }
    }

    
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
  }
})
