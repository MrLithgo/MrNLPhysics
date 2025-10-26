<template>
  <div id="app">
    <Navigation />
    <main>
      <router-view />  <!-- ← Replace <Home /> with this -->
       <!-- global notify/toast modal mounted once -->
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
    // Remove Home from components since router will handle it
  }
}
</script>

<style>
/* Import global styles */
@import '@/styles/main.css';
</style>