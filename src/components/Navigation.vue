<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-content">
        <div class="nav-brand">
          <AtomLogo class="nav-logo" />
          <router-link to="/" class="nav-title">SimplyPhys</router-link>
        </div>

        <div class="nav-menu">
          <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
          <a href="#igcse" class="nav-link" @click.prevent="scrollToSection('igcse')">GCSE</a>
          <a href="#alevel" class="nav-link" @click.prevent="scrollToSection('alevel')">A Level</a>
          <a href="#about" class="nav-link" @click.prevent="scrollToSection('about')">About</a>
        </div>

        <div class="mobile-menu-toggle">
          <button
            class="mobile-menu-btn"
            aria-label="mobile menu toggle"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            @click.stop="toggleMobileMenu"
            ref="mobileToggle"
          >
            <svg
              class="menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="mobile-menu" v-show="isMobileMenuOpen" ref="mobileMenu" @click.stop>
      <div class="mobile-menu-content" ref="mobileMenuContent">
        <router-link
          to="/"
          class="mobile-menu-link"
          exact-active-class="active"
          @click.native="onMobileHomeClick"
          >Home</router-link
        >
        <a href="#igcse" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('igcse')"
          >IGCSE</a
        >
        <a href="#alevel" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('alevel')"
          >A Level</a
        >
        <a href="#about" class="mobile-menu-link" @click.prevent="scrollToSectionMobile('about')"
          >About</a
        >
      </div>
    </div>
  </nav>
</template>

<script>
import AtomLogo from './AtomLogo.vue'

export default {
  name: 'Navigation',
  components: { AtomLogo },
  data() {
    return {
      isMobileMenuOpen: false,
      outsideClickHandler: null,
      escapeHandler: null,
    }
  },
  mounted() {
    this.$watch('$route', () => {
      this.closeMobileMenu()
    })

    this.outsideClickHandler = (e) => {
      const menuEl = this.$refs.mobileMenu
      const toggleEl = this.$refs.mobileToggle
      if (!menuEl || !toggleEl) return
      if (this.isMobileMenuOpen && !menuEl.contains(e.target) && !toggleEl.contains(e.target)) {
        this.closeMobileMenu()
      }
    }
    document.addEventListener('click', this.outsideClickHandler)

    // Escape key to close
    this.escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu()
      }
    }
    document.addEventListener('keydown', this.escapeHandler)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.outsideClickHandler)
    document.removeEventListener('keydown', this.escapeHandler)
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      // optionally prevent body scroll when open
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : ''
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      document.body.style.overflow = ''
    },
    // invoked when clicking 'Home' router-link in the mobile menu
    onMobileHomeClick() {
      // close then navigate. router-link will handle navigation, we ensure menu closed
      this.closeMobileMenu()
    },
    scrollToSection(sectionId) {
      if (this.$route.path !== '/') {
        this.$router.push('/').then(() => {
          // ensure DOM updated; use nextTick rather than arbitrary timeout
          this.$nextTick(() => {
            const element = document.getElementById(sectionId)
            if (element) element.scrollIntoView({ behavior: 'smooth' })
          })
        })
      } else {
        const element = document.getElementById(sectionId)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    scrollToSectionMobile(sectionId) {
      // close menu first so it doesn't block the scroll
      this.closeMobileMenu()
      // wait until menu is closed and DOM is updated
      this.$nextTick(() => {
        // small microtask delay ensures the menu is hidden and pointer-events released
        requestAnimationFrame(() => {
          this.scrollToSection(sectionId)
        })
      })
    },
  },
}
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  top: 56px; /* adjust to header height */
  right: 0;
  left: 0;
  z-index: 999;
  background: white;
  /* Initially hidden by v-show; add gentle transition */
  transition: transform 180ms ease, opacity 180ms ease;
  transform-origin: top center;
}

.mobile-menu[style*='display: none'] {
  /* when v-show hides it, don't allow pointer events */
  pointer-events: none;
}

.mobile-menu .mobile-menu-content {
  padding: 1rem;
}

/* example mobile link */
.mobile-menu-link {
  display: block;
  padding: 0.75rem 0;
  text-decoration: none;
}

/* accessibility helper - show when active maybe */
.mobile-menu-link.active {
  font-weight: 700;
}

/* small improvement: hide body scroll when menu open (we toggle via JS) */
</style>
