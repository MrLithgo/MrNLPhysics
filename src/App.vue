<template>
  <div id="app">
    <Navigation />
    <main>
      <router-view />  <!-- ← Replace <Home /> with this -->
    </main>
    <Footer />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    Footer
    // Remove Home from components since router will handle it
  }
}
</script>

<style>
/* Import global styles */
@import '@/styles/main.css';
</style>