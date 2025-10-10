import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GCSE from '@/views/GCSE.vue'
import ALevel from '@/views/ALevel.vue'
import Topic from '@/views/Topic.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/gcse',
        name: 'GCSE',
        component: GCSE
    },
    {
        path: '/alevel',
        name: 'ALevel',
        component: ALevel
    },
    {
        path: '/topic/:subject/:topic',
        name: 'Topic',
        component: Topic,
        props: true
    },
    // Catch all redirect to home
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router