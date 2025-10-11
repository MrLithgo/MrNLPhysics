<template>
  <div class="home">
    <!-- Hero Section -->
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
              <a href="#igcse" class="btn btn-primary" @click="scrollToSection('igcse')">GCSE Simulations</a>
              <a href="#alevel" class="btn btn-secondary" @click="scrollToSection('alevel')">A Level Simulations</a>
            </div>
          </div>
          <div class="hero-visual">
            <AtomLogo class="hero-animation" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Section -->
    <div class="quote-section">
      <div class="container">
        <blockquote class="quote">
          "Physics is not about memorising facts; it's about understanding how our universe works."
        </blockquote>
      </div>
    </div>

    <!-- IGCSE Section -->
    <section id="igcse" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">GCSE Physics Simulations</h2>
          <p class="section-description">
            Interactive simulations to help GCSE students visualize and understand key physics concepts.
            Although designed with the Edexcel IGCSE specification in mind, content is still useful for other specs.
          </p>
        </div>
        
        <div class="simulations-grid">
          <SimulationCard
            v-for="simulation in gcseSimulations"
            :key="simulation.id"
            :title="simulation.title"
            :description="simulation.description"
            :category="simulation.category"
            :icon-svg="simulation.iconSvg"
            @card-clicked="handleSimulationClick"
          />
        </div>
      </div>
    </section>

    <!-- A Level Section -->
    <section id="alevel" class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">A Level Physics Simulations</h2>
          <p class="section-description">
            Advanced simulations for A Level students to deepen their understanding of complex physics concepts.
            Although designed with Edexcel International A Level in mind, can still be used alongside other specifications.
          </p>
        </div>
        
        <div class="alevel-grid">
          <ALevelCard
            v-for="unit in alevelUnits"
            :key="unit.id"
            :title="unit.title"
            :description="unit.description"
            :topics="unit.topics"
            :category="unit.category"
            :icon-svg="unit.iconSvg"
            @card-clicked="handleSimulationClick"
          />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">About Mr NL's Physics Lab</h2>
            <p class="about-description">
              Welcome to Mr NL's Physics Lab, where physics concepts come to life through interactive simulations. My goal is to make physics accessible, engaging and easy to understand for students at all levels and abilities
            </p>
            <p class="about-description">
              These simulations are designed to complement classroom learning, providing visual and interactive experiences that help solidify understanding of key physics principles.
            </p>
          </div>
          <div class="about-visual">
            <div class="about-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to explore physics in a new way?</h2>
          <p class="cta-description">
            Start with our interactive simulations and enhance your understanding of physics concepts.
          </p>
          <div class="cta-actions">
            <a href="#igcse" class="btn btn-cta-primary" @click="scrollToSection('igcse')">IGCSE Simulations</a>
            <a href="#alevel" class="btn btn-cta-secondary" @click="scrollToSection('alevel')">A Level Simulations</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AtomLogo from '@/components/AtomLogo.vue'
import SimulationCard from '@/components/SimulationCard.vue'
import ALevelCard from '@/components/ALevelCard.vue'

export default {
  name: 'Home',
  components: {
    AtomLogo,
    SimulationCard,
    ALevelCard
  },
  data() {
    return {
      gcseSimulations: [
        {
          id: 1,
          title: 'Forces and Motion',
          description: 'Explore Newton\'s laws of motion, momentum, and kinematics through interactive demonstrations.',
          category: 'forces',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="6" />
            <line x1="12" y1="1" x2="12" y2="6" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 1 L9 4 M12 1 L15 4" />
            <line x1="12" y1="18" x2="12" y2="24" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 24L9 21 M12 24L15 21z " />
          </svg>`
        },
        {
          id: 2,
          title: 'Electricity',
          description: 'Experiment with circuits, current, voltage, and resistance in various configurations.',
          category: 'electricity',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="6" />
            <line x1="7" y1="8" x2="17" y2="16" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 1 L12 4 M4 12 L1 12 M20 12L23 12 M12 20L12 23" />
            <line x1="7" y1="16" x2="17" y2="8" />
          </svg>`
        },
        {
          id: 3,
          title: 'Waves',
          description: 'Visualize wave properties, reflection, refraction, diffraction, and interference patterns.',
          category: 'waves',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 10 A 6 6 0 0 1 20 10" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12 A 4 4 0 0 1 17 12" />
            <circle cx="12.5" cy="12" r="1" />
          </svg>`
        },
        {
          id: 4,
          title: 'Energy',
          description: 'Explore energy transformations, conservation of energy, and efficiency in various systems.',
          category: 'energy',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>`
        },
        {
          id: 5,
          title: 'Solids, Liquids and Gases',
          description: 'Investigate states of matter, particle models, pressure, and thermal properties.',
          category: 'matter',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="2" />
            <circle cx="16" cy="16" r="2" />
            <circle cx="8" cy="16" r="2" />
            <circle cx="8" cy="8" r="2" />
            <circle cx="16" cy="8" r="2" />
          </svg>`
        },
        {
          id: 6,
          title: 'Magnetism & Electromagnetism',
          description: 'Explore magnetic fields, electromagnetic induction, and motor/generator principles.',
          category: 'magnetism',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="M5 10 A 4 4 0 0 1 20 10" fill="none" />
            <path d="M9 10 A 3 3 0 0 1 16 10" fill="none" />
            <line x1="5" y1="10" x2="5" y2="20" />
            <line x1="9" y1="10" x2="9" y2="20" />
            <line x1="20" y1="10" x2="20" y2="20" />
            <line x1="16" y1="10" x2="16" y2="20" />
            <line x1="16" y1="20" x2="20" y2="20" />
            <line x1="5" y1="20" x2="9" y2="20" />
            <line x1="16" y1="17" x2="20" y2="17" />
            <line x1="5" y1="17" x2="9" y2="17" />
          </svg>`
        },
        {
          id: 7,
          title: 'Radioactivity',
          description: 'Understand radioactive decay, half-life, and nuclear reactions through simulations.',
          category: 'radioactivity',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <circle cx="12" cy="12" r="11"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <path d="M6.9,19.28l2.77-4.25c0,0,1.18,0.85,2.55,0.8c1.26-0.05,2.12-0.57,2.12-0.57l2.84,4.05c0,0-2.59,1.83-5.22,1.77
              C9.3,21,6.9,19.28,6.9,19.28z" fill="currentColor"/>
            <path d="M20.91,13l-5.07-0.27c0,0,0.15-1.45-0.58-2.61C14.6,9.05,13.92,8.7,13.92,8.7l1.88-4.61
              c0,0,2.88,1.33,4.14,3.64C21.21,10.06,20.91,13,20.91,13z" fill="currentColor"/>
            <path d="M8.3,4.06l2.3,4.52c0,0-1.33,0.59-1.97,1.8c-0.59,1.12-0.37,2.29-0.37,2.29l-5.11,0.27c0,0-0.29-3.16,1.08-5.41
              C5.6,5.27,8.3,4.06,8.3,4.06z" fill="currentColor"/>
          </svg>`
        },
        {
          id: 8,
          title: 'Astrophysics',
          description: 'Explore the solar system, stars, galaxies, and the expanding universe.',
          category: 'astrophysics',
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>`
        }
      ],
      alevelUnits: [
        {
          id: 1,
          title: 'Unit 1: Physics on the Go',
          description: 'Explore mechanics, kinematics, moments and materials through advanced simulations.',
          category: 'unit1',
          topics: ['Mechanics and Materials'],
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="42.7,33.4 42.7,17.5 3.1,33.4"/>
            <path d="M40.6,18.4l-7.4,3c-0.7,0.3-1.4,0-1.7-0.7l-1.8-4c-0.3-0.6,0-1.4,0.7-1.6l7.4-3c0.7-0.3,1.4,0,1.7,0.7l1.8,4
              C41.5,17.4,41.2,18.2,40.6,18.4z"/>
            <path d="M38.2,25L35.7,28c0,0,0,0,0,0l-2.4-3.2l2.3,3.1c0,0,0.1,0,0.1,0c0-2.9,0-11.2,0-11.2"/>
            <path d="M31.3,13.2l1.1-3.8c0,0,0,0,0,0l3.5,2l-3.4-2c0,0-0.1,0-0.1,0.1c1.2,2.6,4.7,10.3,4.7,10.3"/>
            <path d="M43.1,14.8l4,0.9c0,0,0,0,0,0L45,19l2.1-3.2c0,0,0-0.1-0.1,0c-2.8,1.2-10.9,4.5-10.9,4.5"/>
          </svg>`
        },
        {
          id: 2,
          title: 'Unit 2: Physics at Work',
          description: 'Investigate waves, the particle theory of light and electric circuits.',
          category: 'unit2',
          topics: ['Waves and Electricity'],
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="31.68" y="6.61" width="4.29" height="39.37"/>
            <polyline points="12.96,2.06 31.03,26.3 12.96,49.43"/>
            <line x1="13.48" y1="26.3" x2="31.03" y2="26.3"/>
            <polyline points="22.01,10.19 22.2,14.02 22,13.96 18.45,13.69"/>
            <polyline points="24.49,39.04 20.66,39.23 20.72,39.03 20.99,35.48"/>
          </svg>`
        },
        {
          id: 3,
          title: 'Unit 4: Physics on the Move',
          description: 'Study further mechanics, electric and magnetic fields, nuclear and particle physics.',
          category: 'unit4',
          topics: ['Further Mechanics and Momentum', 'Electric and Magnetic Fields', 'Particle Physics and Fundamental Forces'],
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="25.32" cy="25.63" r="4.44"/>
            <line x1="25.32" y1="24.07" x2="25.32" y2="27.33"/>
            <line x1="26.93" y1="25.72" x2="23.68" y2="25.72"/>
            <path d="M27.73,38.52l-2.46,3.18c0,0-0.01,0-0.01,0l-2.29-3.26l2.25,3.2c0.03,0.02,0.07,0,0.07-0.03
              c0-2.96-0.02-11.53-0.02-11.53"/>
            <path d="M22.93,12.64l2.46-3.18c0,0,0.01,0,0.01,0l2.29,3.26l-2.25-3.2c-0.03-0.02-0.07,0-0.07,0.03
              c0,2.96,0.02,11.53,0.02,11.53"/>
            <path d="M11.79,28.1L8.6,25.65c0,0,0-0.01,0-0.01l3.26-2.29l-3.2,2.25c-0.02,0.03,0,0.07,0.03,0.07
              c2.96,0,11.53-0.02,11.53-0.02"/>
            <path d="M38.16,23.31l3.18,2.46c0,0,0,0.01,0,0.01l-3.26,2.29l3.2-2.25c0.02-0.03,0-0.07-0.03-0.07
              c-2.96,0-11.53,0.02-11.53,0.02"/>
            <path d="M18.34,36.66l-3.97,0.66c0,0-0.01,0-0.01-0.01l0.54-3.95l-0.53,3.88c0.01,0.03,0.05,0.05,0.07,0.02
              c2.02-2.17,7.83-8.47,7.83-8.47"/>
            <path d="M32.26,14.61l3.97-0.66c0,0,0.01,0,0.01,0.01l-0.54,3.95l0.53-3.88c-0.01-0.03-0.05-0.05-0.07-0.02
              c-2.02,2.17-7.83,8.47-7.83,8.47"/>
            <path d="M13.79,18.19l-0.66-3.97c0,0,0-0.01,0.01-0.01l3.95,0.54l-3.88-0.53c-0.03,0.01-0.05,0.05-0.02,0.07
              c2.17,2.02,8.47,7.83,8.47,7.83"/>
            <path d="M36.34,32.61L37,36.57c0,0,0,0.01-0.01,0.01l-3.95-0.54l3.88,0.53c0.03-0.01,0.05-0.05,0.02-0.07
              c-2.17-2.02-8.47-7.83-8.47-7.83"/>
          </svg>`
        },
        {
          id: 4,
          title: 'Unit 5: Physics from Creation to Collapse',
          description: 'Explore thermal energy, nuclear physics, oscillations, and astrophysics.',
          category: 'unit5',
          topics: ['Thermal Energy and Ideal Gases', 'Nuclear Physics and Radioactivity', 'Gravitational Fields and Astrophysics', 'Oscillations and Resonance'],
          iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="3.83" width="40" height="3.67"/>
            <line x1="5.81" y1="3.83" x2="8.84" y2="7.5"/>
            <line x1="9.24" y1="3.83" x2="12.27" y2="7.5"/>
            <line x1="12.83" y1="3.83" x2="15.86" y2="7.5"/>
            <line x1="16.26" y1="3.83" x2="19.29" y2="7.5"/>
            <line x1="19.91" y1="3.83" x2="22.94" y2="7.5"/>
            <line x1="23.34" y1="3.83" x2="26.37" y2="7.5"/>
            <line x1="26.93" y1="3.83" x2="29.96" y2="7.5"/>
            <line x1="30.36" y1="3.83" x2="33.39" y2="7.5"/>
            <line x1="34.18" y1="3.83" x2="37.21" y2="7.5"/>
            <line x1="37.61" y1="3.83" x2="40.64" y2="7.5"/>
            <line x1="41.2" y1="3.83" x2="44.23" y2="7.5"/>
            <path class="st0" d="M24.82,7.4l-9.24,29.55L24.82,7.4z"/>
            <ellipse class="st0" cx="13.86" cy="41.63" rx="5.07" ry="4.78"/>
          </svg>`
        }
      ]
    }
  },
  methods: {
    handleSimulationClick(simulation) {
      console.log('Simulation clicked:', simulation)
      // In a real app, this would navigate to the simulation
      // this.$router.push(`/simulation/${simulation.category}`)
    },
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
/* Home-specific styles are in main.css */
</style>