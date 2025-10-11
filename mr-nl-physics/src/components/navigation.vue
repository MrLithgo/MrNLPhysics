<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-content">
        <div class="nav-brand">
          <AtomLogo class="nav-logo" />
          <span class="nav-title">Mr NL's Physics Lab</span>
        </div>
        <div class="nav-menu">
          <a href="#" class="nav-link active">Home</a>
          <a href="#igcse" class="nav-link" @click="scrollToSection('igcse')">IGCSE</a>
          <a href="#alevel" class="nav-link" @click="scrollToSection('alevel')">A Level</a>
          <a href="#about" class="nav-link" @click="scrollToSection('about')">About</a>
        </div>
       
        <div class="mobile-menu-toggle">
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <svg class="menu-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <a href="#" class="mobile-menu-link active" @click="closeMobileMenu">Home</a>
        <a href="#igcse" class="mobile-menu-link" @click="scrollToSection('igcse')">IGCSE</a>
        <a href="#alevel" class="mobile-menu-link" @click="scrollToSection('alevel')">A Level</a>
        <a href="#about" class="mobile-menu-link" @click="scrollToSection('about')">About</a>
      </div>
    </div>
  </nav>
</template>

<script>
import AtomLogo from './AtomLogo.vue'

export default {
  name: 'Navigation',
  components: {
    AtomLogo
  },
  data() {
    return {
      isMobileMenuOpen: false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },
    scrollToSection(sectionId) {
      this.closeMobileMenu()
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* Navigation styles are in main.css */
</style>