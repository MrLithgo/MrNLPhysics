import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import GCSEForces from '@/views/GCSEForces.vue'
import GCSEElectricity from '@/views/GCSEElectricity.vue'
//import GCSEWaves from '@/views/GCSEWaves.vue'
import GCSEEnergy from '@/views/GCSEEnergy.vue'
//import GCSESlg from '@/views/GCSESlg.vue'
import GCSEMagnetism from '@/views/GCSEMagnetism.vue'
//import GCSERadioactivity from '@/views/GCSERadioactivity.vue'
//import GCSEAstro from '@/views/GCSEAstro.vue'

import ALevelMechanics from '@/views/ALevelMechanics.vue'
import ALevelParticles from '@/views/ALevelParticles.vue'
import ALevelWaves from '@/views/ALevelWaves.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/gcse/forces-and-motion',
    name: 'GCSEForces',
    component: GCSEForces,
  },

  {
    path: '/gcse/energy',
    name: 'GCSEEnergy',
    component: GCSEEnergy,
  },

  {
    path: '/gcse/magnetism',
    name: 'GCSEMagnetism',
    component: GCSEMagnetism,
  },

  {
    path: '/gcse/electricity',
    name: 'GCSEElectricity',
    component: GCSEElectricity,
  },

  {
    path: '/ALevel/mechanics',
    name: 'ALevelMechanics',
    component: ALevelMechanics,
  },
  {
    path: '/ALevel/nuclear-and-particles',
    name: 'ALevelParticles',
    component: ALevelParticles,
  },
  {
    path: '/ALevel/aswaves',
    name: 'ALevelWaves',
    component: ALevelWaves,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
