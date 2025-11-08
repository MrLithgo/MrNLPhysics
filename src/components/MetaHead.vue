<script setup>
import { useHead } from '@unhead/vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  image: { type: String, default: 'https://SimplyPhys.com/images/forces-preview.png' },
  keywords: {
    type: String,
    default: 'Physics, GCSE, Science, SimplyPhys, Mr NL Physics, Interactive Simulations',
  },
  author: { type: String, default: 'SimplyPhys' },
  jsonld: { type: Object, default: null }, // optional structured data object
})

// apply head
useHead(() => {
  // build base meta array
  const meta = [
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
  ]

  // script array (include JSON-LD if provided)
  const script = []
  if (props.jsonld) {
    script.push({
      type: 'application/ld+json',
      children: JSON.stringify(props.jsonld),
    })
  }

  return {
    title: props.title,
    meta,
    link: [
      { rel: 'canonical', href: props.url },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    script,
  }
})
</script>

<template>
  <!-- Invisible — this component updates <head> only -->
  <span aria-hidden="true" style="display: none"></span>
</template>
