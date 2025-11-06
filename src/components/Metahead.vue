<script setup>
import { useHead } from '@vueuse/head'

// Props to customize per page
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  image: { type: String, default: 'https://mrnlphysics.netlify.app/assets/og-image.jpg' },
  keywords: { type: String, default: 'Physics, GCSE, Science, Mr NL Physics, Interactive Simulations' },
  author: { type: String, default: 'Mr NL Physics' }
})

// Apply metadata dynamically
useHead({
  title: props.title,
  meta: [
    { name: 'description', content: props.description },
    { name: 'keywords', content: props.keywords },
    { name: 'author', content: props.author },

    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:url', content: props.url },
    { property: 'og:image', content: props.image },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: props.image },
  ],
  link: [
    { rel: 'canonical', href: props.url },
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ],
})
</script>

<template>
  <!-- This component doesn’t render visible HTML -->
  <span style="display:none"></span>
</template>
