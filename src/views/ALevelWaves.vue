<template>
  <div class="alevel-waves-page">
    <header class="page-header">
      <div class="container">
        <h1>A Level Waves</h1>
        <p>Interactive simulations to help you master physics concepts</p>
      </div>
    </header>

    <div class="container main-content">
      <div class="quote-card">
        <p class="quote-text">
          "Not only is the universe stranger than we think, it is stranger than we <b>can</b> think"
        </p>
        <p class="quote-author">- Werner Heisenberg</p>
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
  A Level Waves
*/
export default {
  name: 'ALevelWaves',
  data() {
    return {
      simulations: [
        {
          id: 'refraction',
          title: 'Refraction of Light',
          subtitle: 'Exploring Refraction, Dispersion and Totsl Internal Reflection',
          description:
            'Investigate how light refracts through different mediums and the effects of dispersion.',
          page: 'refraction.html',
          available: true,
          accent: 'navy-accent',
          iconClass: 'navy-icon',
          btnClass: 'navy-btn',

          svg: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
    <path d="M5.403724,16h21.569644" transform="translate(-0.188546 0)" fill="none"  stroke-linecap="round"/><path d="M8.948386,5.807212L16,16l3.205279,9.415979" transform="translate(0.000001 0.000001)" fill="none"  stroke-linecap="round"/><path d="M13.322649,9.125619l-.226255,2.639641-2.187132-.075419" transform="matrix(0.98709 0.160167 -0.160167 0.98709 1.980267 -1.881139)" fill="none"  stroke-linecap="round"/><path d="M13.322649,9.125619l-.226255,2.639641-2.187132-.075419" transform="matrix(0.897017 0.441996 -0.441996 0.897017 11.288121 5.573907)" fill="none" stroke-linecap="round"/>
</svg>
`,
        },
        {
          id: 'sound',
          title: 'Measuring Speed of Sound',
          subtitle: 'Investigating Sound Waves',
          description: 'Using an oscilloscope to measure the speed of sound in air',
          page: 'gamma-absorption.html',
          available: false,
          accent: 'coral-accent',
          iconClass: 'coral-icon',
          btnClass: 'coral-btn',
          svg: `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
                <path id="svg_1" d="m13.4375,5.75003l0.875,0l0,13.49995l-0.875,0l0,-13.49995z" opacity="undefined" stroke="#000" fill="#fff"/>
  <rect id="svg_2" height="0.625" width="1.37499" y="2.24994" x="-6.84367" stroke="#000" fill="#fff"/>
  <rect id="svg_4" height="3.81248" width="1.25" y="10.59376" x="20.34372" stroke="#000" fill="#000000"/>
  <rect id="svg_5" height="1.56249" width="2.18749" y="11.71875" x="21.78121" stroke="#000" fill="#000000"/>
  <g id="svg_23">
   <path id="svg_20" d="m-0.59375,14.65621c1.53125,0.02083 1.1875,-4.02083 2.46875,-4.125c1.45833,0.14583 0.97917,4.04167 2.3125,4" opacity="NaN" stroke="#000" fill="#fff"/>
   <path id="svg_21" d="m4.15625,14.53121c1.53125,0.02083 1.1875,-4.02083 2.46875,-4.125c1.45833,0.14583 0.97917,4.04167 2.3125,4" opacity="NaN" stroke="#000" fill="#fff"/>
   <path id="svg_22" d="m8.90625,14.46871c1.53125,0.02083 1.1875,-4.02083 2.46875,-4.125c1.45833,0.14583 0.97917,4.04167 2.3125,4" opacity="NaN" stroke="#000" fill="#fff"/>
  </g>
                </svg>
                `,
        },
      ],
    }
  },
  methods: {
    launchSimulation(page) {
      if (!page) return
      const url = `/ALevel/simulations/${page}`
      window.open(url, '_blank', 'noopener,noreferrer')
    },

    notifyComingSoon(sim) {
      window.dispatchEvent(
        new CustomEvent('ui-notify', {
          detail: {
            type: 'modal',
            title: 'Coming soon',
            message: `<strong>${sim.title}</strong> — this simulation is coming soon.`,
          },
        })
      )
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
    },
  },
  mounted() {
    this.scrollToTop()
  },
  activated() {
    this.scrollToTop()
  },
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
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(2px) grayscale(1);
  pointer-events: none; /* buttons remain clickable if you want them to be */
  z-index: 5;
}

.overlay-badge {
  background: rgba(0, 0, 0, 0.7);
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
