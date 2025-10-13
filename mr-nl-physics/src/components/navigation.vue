<template>
  <nav class="navbar">
    <div class="nav-container">
      
      <div class="nav-content">
        <div class="nav-brand">
          <AtomLogo class="nav-logo" />
          <!-- Use router-link for the brand/logo -->
          <router-link to="/" class="nav-title">Mr NL's Physics Lab</router-link>
        </div>
        <div class="nav-menu">
          <!-- Use router-link for navigation -->
          <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
          <a href="#igcse" class="nav-link" @click.prevent="scrollToSection('igcse')">IGCSE</a>
          <a href="#alevel" class="nav-link" @click.prevent="scrollToSection('alevel')">A Level</a>
          <a href="#about" class="nav-link" @click.prevent="scrollToSection('about')">About</a>
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
        <!-- Use router-link for mobile navigation -->
        <router-link to="/" class="mobile-menu-link" exact-active-class="active" @click="closeMobileMenu">Home</router-link>
        <a href="#igcse" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('igcse')">IGCSE</a>
        <a href="#alevel" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('alevel')">A Level</a>
        <a href="#about" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('about')">About</a>
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
      // If we're not on the home page, navigate there first
      if (this.$route.path !== '/') {
        this.$router.push('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // We're already on home page, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    scrollToSectionMobile(sectionId) {
      this.closeMobileMenu();
      this.scrollToSection(sectionId);
    }
  }
}
</script>

<style scoped>
/* Navigation styles are in main.css */

.nav-title {
  text-decoration: none;
  color: inherit;
}

.nav-title:hover {
  text-decoration: none;
}
</style>