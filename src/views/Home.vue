<template>
  <div class="home">
    <Hero />

    <!-- Quote Section -->
    <div class="quote-section">
      <div class="container">
        <blockquote class="quote">
          "The most exciting phrase to hear in science, the one that heralds new discoveries, is not 'Eureka!' but 'That's funny...'"
          - Isaac Asimov
        </blockquote>
      </div>
    </div>

    <!-- IGCSE Section -->
    <section id="igcse" class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">GCSE Physics Simulations</h2>
          <p class="section-description">
            Interactive simulations to help GCSE students visualize and understand key physics
            concepts. Although designed with the Edexcel IGCSE specification in mind, content is
            still useful for other specs.
          </p>
        </div>

        <div class="simulations-grid">
          <SimulationCard
            v-for="simulation in igcseSimulations"
            :key="simulation.id"
            :title="simulation.title"
            :description="simulation.description"
            :category="simulation.category"
            :icon-component="simulation.icon"
            :available="!!simulation.route"
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
            Advanced simulations for A Level students to deepen their understanding of complex
            physics concepts. Although designed with Edexcel International A Level in mind, can
            still be used alongside other specifications.
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
            :icon-component="unit.icon"
            :available="!!unit.route"
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
            <h2 class="section-title">About SimpliPhys</h2>
            <p class="about-description">
              Welcome to SimpliPhys, where physics concepts come to life through interactive
              simulations. My goal is to make physics accessible, engaging and easy to understand
              for students at both GCSE and A Level.
            </p>
            <p class="about-description">
              These simulations are designed to complement classroom learning, providing visual and
              interactive experiences that help solidify understanding of key physics principles.
              They can be used in setting where equipment is limited, home-schooling or as revision
              of previous practical work.
            </p>
            <p class="about-description">
              They are simplified and focussed on one or two key ideas, avoiding cognitive overload
              and distractions that more complex simulations can suffer from. Each simulation has an
              accompanying worksheet and short multiple-choice quiz to check understanding.
            </p>
          </div>
          <div class="about-visual">
            <div class="about-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
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
            Start with our interactive simulations and enhance your understanding of physics
            concepts.
          </p>
          <div class="cta-actions">
            <button class="btn btn-cta-primary" @click="scrollToSection('igcse')">
              GCSE Simulations
            </button>
            <button class="btn btn-cta-secondary" @click="scrollToSection('alevel')">
              A Level Simulations
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import Hero from '@/components/Hero.vue'
import SimulationCard from '@/components/SimulationCard.vue'
import ALevelCard from '@/components/ALevelCard.vue'

// Import icon components
import ForcesIcon from '@/components/icons/ForcesIcon.vue'
import ElectricityIcon from '@/components/icons/ElectricityIcon.vue'
import WavesIcon from '@/components/icons/WavesIcon.vue'
import EnergyIcon from '@/components/icons/EnergyIcon.vue'
import MatterIcon from '@/components/icons/MatterIcon.vue'
import MagnetismIcon from '@/components/icons/MagnetismIcon.vue'
import RadioactivityIcon from '@/components/icons/RadioactivityIcon.vue'
import AstrophysicsIcon from '@/components/icons/AstrophysicsIcon.vue'
import MechanicsIcon from '@/components/icons/MechanicsIcon.vue'
import ParticleIcon from '@/components/icons/ParticleIcon.vue'

export default {
  name: 'Home',
  components: {
    Hero,
    SimulationCard,
    ALevelCard,
  },
  data() {
    return {
      igcseSimulations: [
        {
          id: 1,
          title: 'Forces and Motion',
          description:
            "Explore Newton's laws of motion, momentum, and kinematics through interactive demonstrations.",
          category: 'forces',
          icon: ForcesIcon,
          route: '/gcse/forces-and-motion',
        },
        {
          id: 2,
          title: 'Electricity',
          description:
            'Experiment with circuits, current, voltage, and resistance in various configurations.',
          category: 'electricity',
          icon: ElectricityIcon,
        },
        {
          id: 3,
          title: 'Waves',
          description:
            'Visualize wave properties, reflection, refraction, diffraction, and interference patterns.',
          category: 'waves',
          icon: WavesIcon,
        },
        {
          id: 4,
          title: 'Energy',
          description:
            'Explore energy transformations, conservation of energy, and efficiency in various systems.',
          category: 'energy',
          icon: EnergyIcon,
          route: '/gcse/energy',
        },
        {
          id: 5,
          title: 'Solids, Liquids and Gases',
          description:
            'Investigate states of matter, particle models, pressure, and thermal properties.',
          category: 'matter',
          icon: MatterIcon,
        },
        {
          id: 6,
          title: 'Magnetism & Electromagnetism',
          description:
            'Explore magnetic fields, electromagnetic induction, and motor/generator principles.',
          category: 'magnetism',
          icon: MagnetismIcon,
        },
        {
          id: 7,
          title: 'Radioactivity',
          description:
            'Understand radioactive decay, half-life, and nuclear reactions through simulations.',
          category: 'radioactivity',
          icon: RadioactivityIcon,
        },
        {
          id: 8,
          title: 'Astrophysics',
          description: 'Explore the solar system, stars, galaxies, and the expanding universe.',
          category: 'astrophysics',
          icon: AstrophysicsIcon,
        },
      ],
      alevelUnits: [
        {
          id: 1,
          title: 'Mechanics',
          description: 'Explore mechanics, kinematics and moments through advanced simulations.',
          category: 'mechanics',
          topics: ['Kinematics', 'Dynamics', 'Moments'],
          icon: MechanicsIcon,
          route: 'ALevel/mechanics',
        },
        {
          id: 6,
          title: 'Nuclear and Particle Physics',
          description:
            'The world of the very small - explore the nuclear atom, particle physics and fundamental forces.',
          category: 'particle',
          topics: ['Nuclear Atom', 'Particle Accelorators', 'Standard Model'],
          icon: ParticleIcon,
          route: 'ALevel/nuclear-and-particles',
        },
        // ... more units
      ],
    }
  },
  methods: {
    handleSimulationClick(clickedData) {
      // Find the complete simulation object from your arrays
      const allSimulations = [...this.igcseSimulations, ...this.alevelUnits]
      const simulation = allSimulations.find(
        (sim) => sim.title === clickedData.title || sim.id === clickedData.id
      )

      if (simulation && simulation.route) {
        this.$router.push(simulation.route)
      } else {
        window.dispatchEvent(
          new CustomEvent('ui-notify', {
            detail: {
              type: 'modal',
              title: 'Coming soon',
              message: `The <strong>${clickedData.title}</strong> simulation is coming soon!`,
            },
          })
        )
      }
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },

  async mounted() {
    await nextTick()
    await nextTick()

    if (typeof window !== 'undefined') {
      window.prerenderReady = true
    }
  },

  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.prerenderReady = false
    }
  },
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.quote-section {
  background-color: var(--white);
  padding: 32px 0;
}

.quote {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 20px;
  text-align: center;
  color: var(--navy);
  max-width: 800px;
  margin: 0 auto;
}

.section {
  padding: 64px 0;
}

.section-alt {
  background-color: var(--white);
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 32px;
  margin-bottom: 16px;
}

.section-description {
  font-size: 18px;
  color: var(--slate);
  max-width: 600px;
  margin: 0 auto;
}

.simulations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.alevel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.about-text {
  max-width: 600px;
}

.about-description {
  font-size: 18px;
  color: var(--slate);
  margin-bottom: 16px;
}

.about-visual {
  display: flex;
  justify-content: center;
}

.about-icon {
  background-color: rgba(26, 188, 156, 0.1);
  border-radius: 50%;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-icon svg {
  height: 96px;
  width: 96px;
  color: var(--teal);
}

.cta {
  background-color: rgba(241, 196, 15, 0.1);
  padding: 48px 0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 28px;
  margin-bottom: 16px;
}

.cta-description {
  font-size: 18px;
  color: var(--slate);
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-cta-primary {
  background-color: var(--gold);
  color: var(--navy);
}

.btn-cta-primary:hover {
  background-color: rgba(241, 196, 15, 0.9);
}

.btn-cta-secondary {
  background-color: var(--navy);
  color: var(--white);
}

.btn-cta-secondary:hover {
  background-color: rgba(44, 62, 80, 0.9);
}

@media (min-width: 768px) {
  .simulations-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .alevel-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-content {
    flex-direction: row;
    justify-content: space-between;
  }

  .about-text {
    max-width: 50%;
  }

  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .simulations-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
