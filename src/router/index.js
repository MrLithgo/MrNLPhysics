import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GCSEForces from '@/views/GCSEForces.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/gcse/forces-and-motion',
        name: 'GCSEForces',
        component: GCSEForces
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router