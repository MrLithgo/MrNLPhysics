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
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import UiNotify from '@/components/UiNotify.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer,
    UiNotify
    
  }
}
</script>

<style>
/* Import global styles */
@import '@/styles/main.css';
</style>
