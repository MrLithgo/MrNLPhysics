<template>
  <div class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span>Interactive Physics</span>
            <span class="highlight">Simulations</span>
          </h1>
          <p class="hero-description">
            Explore physics concepts through interactive simulations designed for GCSE and A Level students.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" @click="scrollToSection('igcse')">GCSE Simulations</button>
            <button class="btn btn-secondary" @click="scrollToSection('alevel')">A Level Simulations</button>
          </div>
        </div>
        <div class="hero-visual">
          <AtomLogo class="hero-animation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AtomLogo from './AtomLogo.vue'

export default {
  name: 'Hero',
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
.hero {
  background: linear-gradient(to right, var(--navy), rgba(44, 62, 80, 0.9));
  color: var(--white);
  padding: 64px 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.hero-text {
  text-align: center;
  max-width: 600px;
}

.hero-title {
  font-size: 36px;
  margin-bottom: 16px;
}

.hero-title span {
  display: block;
}

.hero-title .highlight {
  color: var(--teal);
}

.hero-description {
  font-size: 18px;
  color: var(--softgray);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: var(--teal);
  color: var(--white);
}

.btn-primary:hover {
  background-color: rgba(26, 188, 156, 0.9);
}

.btn-secondary {
  background-color: transparent;
  color: var(--white);
  border: 1px solid var(--white);
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.hero-visual {
  width: 100%;
  max-width: 500px;
}

.hero-animation {
  width: 100%;
  height: 256px;
  color: var(--teal);
}

@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .hero-text {
    text-align: left;
    max-width: 50%;
  }
  
  .hero-actions {
    flex-direction: row;
  }
}
</style>