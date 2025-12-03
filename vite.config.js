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
    
    polyfillModulePreload: false,

    
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue']
        }
      }
    },

    
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
  }
})
