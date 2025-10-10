import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                gcse: resolve(__dirname, 'public/gcse/index.html'),
                alevel: resolve(__dirname, 'public/alevel/index.html')
            }
        }
    },
    server: {
        port: 3000
    }
})
