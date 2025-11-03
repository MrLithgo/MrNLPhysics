<template>
  <div class="alevel-mechanics-page">
    <header class="page-header">
      <div class="container">
        <h1>A Level Mechanics</h1>
        <p>Interactive simulations to help you master physics concepts</p>
      </div>
    </header>

    <div class="container main-content">
      <div class="quote-card">
        <p class="quote-text">"In Science there is only Physics; all the rest is stamp collecting"</p>
        <p class="quote-author">- Lord Kelvin</p>
      </div>

      <div class="cards-grid">
        <article
          v-for="sim in simulations"
          :key="sim.id"
          class="card"
          :class="{ 'card--disabled': !sim.available }"
          @click="onCardClick(sim)"
          role="button"
          :aria-disabled="!sim.available"
          tabindex="0"
          @keydown.enter.prevent="onCardClick(sim)"
        >
          <div :class="['card-accent', sim.accent]"></div>

          <div class="card-content">
            <div class="card-icon" :class="sim.iconClass" v-html="sim.svg"></div>

            <h2>{{ sim.title }}</h2>
            <h3>{{ sim.subtitle }}</h3>
            <p>{{ sim.description }}</p>

            <div class="card-actions">
              <button
                v-if="sim.available"
                @click.stop.prevent="launchSimulation(sim.page)"
                class="btn"
                :class="sim.btnClass"
              >
                Launch Simulation
              </button>

              <button
                v-else
                @click.stop.prevent="notifyComingSoon(sim)"
                class="btn"
                :class="sim.btnClass"
                aria-disabled="true"
              >
                Coming soon
              </button>
            </div>
          </div>

        
          <div v-if="!sim.available" class="card-overlay" aria-hidden="true">
            <div class="overlay-badge">Coming soon</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
/*
  A Level Mechanics
*/
export default {
  name: 'ALevelMechanics',
  data() {
    return {
      simulations: [
        {
          id: 'vectors',
          title: 'Vector Physics',
          subtitle: 'Exploring Vector Diagrams',
          description: 'Draw different vector scenarios and manipulate them to explore resultants and components.',
          page: 'vectors.html',
          available: true,
          accent: 'teal-accent',
          iconClass: 'teal-icon',
          btnClass: 'teal-btn',
          svg: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
                 <path id="svg_1" fill="none" d="m8,1l0,23m0,-23l13,11m-13,12l13,-12"/>
  <path id="svg_2" fill="none" d="m5.1875,9.12501l2.75,3.0625l2.68749,-2.99999m-5.4375,3.93749l2.875,2.875l2.62499,-2.9375"/>
  <path stroke="null" transform="rotate(138.483 15.9396 11.7829)" fill="none" d="m20.76287,5.82833l-2.95541,2.43573l3.27438,2.27734m-10.28444,4.32108l2.875,2.875l2.62499,-2.9375"/>
                </svg>
                `
        },
       
      ]
    }
  },
  methods: {
    launchSimulation(page) {
      if (!page) return
      const url = `/ALevel/simulations/${page}`
      window.open(url, '_blank', 'noopener,noreferrer')
    },

    notifyComingSoon(sim) {
      window.dispatchEvent(new CustomEvent('ui-notify', {
        detail: {
          type: 'modal',
          title: 'Coming soon',
          message: `<strong>${sim.title}</strong> — this simulation is coming soon.`
        }
      }))
    },

    onCardClick(sim) {
      if (sim.available) {
        this.launchSimulation(sim.page)
      } else {
        this.notifyComingSoon(sim)
      }
    },

   
    scrollToTop() {
      setTimeout(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      }, 50)
    }
  },
  mounted() {
    this.scrollToTop()
  },
  activated() {
    this.scrollToTop()
  }
}
</script>

<style scoped>
.page-header {
  background-color: var(--navy);
  color: white;
  padding: 2rem 0;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: rgba(236, 240, 241, 0.8);
}

.main-content {
  padding: 2rem 0;
}

.quote-card {
  background-color: var(--white);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.quote-text {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 1.125rem;
  color: var(--slate);
  text-align: center;
}

.quote-author {
  text-align: right;
  font-size: 0.875rem;
  color: var(--slate);
  margin-top: 0.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.card {
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
}

.card-accent {
  height: 0.75rem;
}

.teal-accent {
  background-color: rgba(26, 188, 156, 0.5);
}

.gold-accent {
  background-color: rgba(241, 196, 15, 0.5);
}

.coral-accent {
  background-color: rgba(231, 76, 60, 0.5);
}

.navy-accent {
  background-color: rgba(44, 62, 80, 0.5);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.teal-icon {
  background-color: rgba(26, 188, 156, 0.1);
  color: var(--navy);
}

.gold-icon {
  background-color: rgba(241, 196, 15, 0.1);
  color: var(--gold);
}

.coral-icon {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--coral);
}

.navy-icon {
  background-color: rgba(44, 62, 80, 0.1);
  color: var(--navy);
}

.card-icon svg {
  height: 3rem;
  width: 3rem;
}

.card h2 {
  font-size: 1.25rem;
  color: var(--navy);
  text-align: center;
  margin-bottom: 0.5rem;
}

.card h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--slate);
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
}

.card p {
  color: var(--slate);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  flex-grow: 1;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

/* overlay for coming-soon cards */
.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
  background: rgba(255,255,255,0.62);
  backdrop-filter: blur(2px) grayscale(1);
  pointer-events: none; /* buttons remain clickable if you want them to be */
  z-index: 5;
}

.overlay-badge {
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}


.card--disabled {
  opacity: 0.98;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header h1 {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .container {
    padding: 0 2rem;
  }
}
</style>
