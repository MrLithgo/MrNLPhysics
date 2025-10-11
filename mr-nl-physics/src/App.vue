<template>
  <div id="app">
    <Navigation />
    <main>
      <Home />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Home from '@/views/Home.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Home,
    Footer
  }
}
</script>

<style>
/* Import global styles */
@import '@/styles/main.css';
</style>