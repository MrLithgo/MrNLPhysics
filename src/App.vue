<template>
  <div id="app">
    <Navigation />
    <main>
      <router-view />

      <UiNotify />
    </main>
    <Footer />
  </div>
</template>

<script>
import { useHead } from '@unhead/vue'
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import UiNotify from '@/components/UiNotify.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer,
    UiNotify,
  },
  setup() {
    useHead({
      title: 'SimpliPhys - A Level and GCSE Interactive Physics Simulations',
      meta: [
        {
          name: 'description',
          content:
            'Minimalist physics simulations designed to reduce cognitive load. Interactive simulations for forces, electricity, waves, particles, energy, radioactivity and astrophysics with worksheets & quizzes.',
        },
        {
          name: 'keywords',
          content:
            'physics simulations, GCSE physics, A-Level physics, International Edexcel physics, forces and motion, electricity, waves, radioactivity, astrophysics, physics worksheets',
        },
        {
          property: 'og:title',
          content: 'SimpliPhys - A Level and GCSE Interactive Physics Simulations',
        },
        {
          property: 'og:description',
          content:
            'Interactive simulations for forces, electricity, waves, particles, energy, radioactivity and astrophysics with worksheets & quizzes',
        },
        {
          property: 'og:image',
          content: 'https://SimpliPhys.com/images/main-preview.png',
        },
        {
          property: 'og:url',
          content: 'https://SimpliPhys.com',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: 'SimpliPhys',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: 'SimpliPhys - Physics Simulations',
        },
        {
          name: 'twitter:description',
          content: 'Simple, minimalist physics simulations with worksheets and quizzes',
        },
        {
          name: 'twitter:image',
          content: 'https://SimpliPhys.com/images/main-preview.png',
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SimpliPhys',
            description:
              'Simple, distraction-free interactive physics simulations for GCSE and A-Level students. Based on Edexcel syllabus covering forces, motion, electricity, particles, energy, waves, radioactivity, and astrophysics.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Any',
            permissions: 'browser',
            audience: {
              '@type': 'EducationalAudience',
              educationalRole: 'student, teacher',
            },
          }),
        },
      ],
    })
  },
}
</script>

<style>
/* Import global styles */
@import '@/styles/main.css';
</style>
