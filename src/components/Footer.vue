<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-brand">
            <AtomLogo class="footer-logo" />
            <span class="footer-title">Mr NL's Physics Lab</span>
          </div>
          <p class="footer-description">
            Making physics interactive, engaging, and accessible for all students.
          </p>
        </div>
        <div class="footer-section">
          <h3 class="footer-heading">Quick Links</h3>
          <ul class="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#igcse" @click="scrollToSection('igcse')">IGCSE Simulations</a></li>
            <li><a href="#alevel" @click="scrollToSection('alevel')">A Level Simulations</a></li>
            <li><a href="#about" @click="scrollToSection('about')">About</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">© 2025 MrNLPhysics.com. All rights reserved.</p>
        <div class="footer-social">
         
         
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import AtomLogo from './AtomLogo.vue'

export default {
  name: 'Footer',
  components: {
    AtomLogo
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* Footer styles are in main.css */
</style>
