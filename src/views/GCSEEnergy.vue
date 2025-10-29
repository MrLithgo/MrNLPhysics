<template>
  <div class="gcse-energy-page">
    <header class="page-header">
      <div class="container">
        <h1>GCSE Energy</h1>
        <p>Interactive simulations to help you master physics concepts</p>
      </div>
    </header>

    <div class="container main-content">
      <div class="quote-card">
        <p class="quote-text">"Everything is energy and that is all there is to it. ...this is not philosophy. This is physics,"</p>
        <p class="quote-author">- Albert Einstein</p>
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

          <!-- overlay for unavailable sims -->
          <div v-if="!sim.available" class="card-overlay" aria-hidden="true">
            <div class="overlay-badge">Coming soon</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GCSEEnergy',
  data() {
    return {
      simulations: [
        {
          id: 'conduction',
          title: 'Investigating Conduction',
          subtitle: 'Heat transfer in solids',
          description: 'Investigate how different metals conduct heat at different rates',
          page: 'conduction.html',
          available: true,
          accent: 'teal-accent',
          iconClass: 'teal-icon',
          btnClass: 'teal-btn',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
                 <ellipse ry="0.49999" rx="0.49999" id="svg_1" cy="8.99976" cx="2.15636" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_2" cy="8.68727" cx="4.90633" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_3" cy="11.21849" cx="2.59386" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_4" cy="12.03098" cx="4.96883" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_5" cy="9.06226" cx="7.21881" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_6" cy="9.12476" cx="9.46878" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_7" cy="11.40599" cx="6.96881" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_8" cy="11.65598" cx="9.03129" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_9" cy="13.99971" cx="1.84387" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_10" cy="14.18721" cx="4.21884" stroke="#000" fill="#fff"/>
  <ellipse stroke="#000" ry="0.49999" rx="0.49999" id="svg_11" cy="16.65593" cx="2.21886" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_12" cy="16.46843" cx="4.90633" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_13" cy="13.93721" cx="7.15631" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_14" cy="13.99971" cx="9.40628" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_15" cy="16.59343" cx="7.21881" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_16" cy="16.34343" cx="9.53128" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_17" cy="9.49976" cx="11.53126" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_18" cy="9.24976" cx="13.90623" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_19" cy="11.71848" cx="11.78126" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_20" cy="11.65598" cx="14.03123" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_21" cy="9.24976" cx="16.21871" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_22" cy="9.24976" cx="18.53118" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_23" cy="11.59349" cx="16.21871" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_24" cy="11.59349" cx="18.53118" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_25" cy="13.74971" cx="11.59376" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_26" cy="13.93721" cx="13.84373" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_27" cy="16.09344" cx="11.71876" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_28" cy="16.21844" cx="13.96873" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_29" cy="13.87471" cx="16.21871" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_30" cy="13.87471" cx="18.53118" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_31" cy="16.21844" cx="16.21871" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_32" cy="16.21843" cx="18.53118" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_33" cy="9.24976" cx="20.78116" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_34" cy="9.24976" cx="23.09363" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_35" cy="11.59349" cx="20.78116" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_36" cy="11.59348" cx="23.09363" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_37" cy="13.87471" cx="20.78116" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_38" cy="13.87471" cx="23.09363" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_39" cy="16.21843" cx="20.78116" stroke="#000" fill="#fff"/>
  <ellipse ry="0.49999" rx="0.49999" id="svg_40" cy="16.21843" cx="23.09363" stroke="#000" fill="#fff"/>
 
                </svg>`
        },

        {
          id: 'radiation',
          title: 'Investigating Radiation',
          subtitle: 'Heat transfer by radiation',
          description: 'Test different surfaces and materials to understand the factors that affect radiation.',
          page: 'radiation.html',
          available: true,
          accent: 'navy-accent',
          iconClass: 'navy-icon',
          btnClass: 'navy-btn',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <g stroke="null" id="svg_5">
   <path stroke="#000" id="svg_1" d="m10.93475,14.87557c1.21961,0.00004 0.70071,-4.82764 2.08204,-4.75036c1.44202,0 0.57951,4.71186 1.77895,4.75049" opacity="NaN" fill="#fff"/>
   <path stroke="#000" id="svg_2" d="m14.77566,14.87558c1.21961,0.00004 0.70071,-4.82764 2.08204,-4.75036c1.44203,0 0.57951,4.71187 1.77895,4.75049" opacity="NaN" fill="#fff"/>
   <path stroke="#000" id="svg_3" d="m7.09384,14.87558c1.21961,0.00004 0.70071,-4.82764 2.08204,-4.75036c1.44203,0 0.57951,4.71187 1.77895,4.75049" opacity="NaN" fill="#fff"/>
   <path stroke="#000" id="svg_4" d="m18.57614,14.87558c1.21961,0.00004 0.70071,-4.82764 2.08204,-4.75036c1.44203,0 0.57951,4.71187 1.77895,4.75049" opacity="NaN" fill="#fff"/>
  </g>
  <rect id="svg_6" height="20.31216" width="5.06241" y="2.34392" x="1.59393" stroke="#000" fill="#fff"/>
                </svg>`
        },

        {
          id: 'stores-and-transfers',
          title: "Energy",
          subtitle: 'Stores and Transfers',
          description: "Explore the 8 different energy stores and 4 ways of transferring energy",
          page: 'stores-and-transfers.html',
          available: false,
          accent: 'coral-accent',
          iconClass: 'coral-icon',
          btnClass: 'coral-btn',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 25 25" stroke="currentColor">
                  <g id="svg_5">
   <path id="svg_1" d="m4.40626,7.24997" opacity="NaN" stroke="#000" fill="#fff"/>
   <line id="svg_2" y2="6.87497" x2="18.90624" y1="6.99997" x1="4.78126" stroke="#000" fill="none"/>
   <line id="svg_3" y2="6.87497" x2="18.90624" y1="4.74998" x1="16.53124" stroke="#000" fill="none"/>
   <path id="svg_4" d="m16.59374,8.87497l2.4375,-2" opacity="undefined" stroke="#000" fill="none"/>
  </g>
  <g id="svg_10">
   <path id="svg_6" d="m4.40626,13.06246" opacity="NaN" stroke="#000" fill="#fff"/>
   <line id="svg_7" y2="12.68747" x2="18.90624" y1="12.81247" x1="4.78126" stroke="#000" fill="none"/>
   <line id="svg_8" y2="12.68747" x2="18.90624" y1="10.56247" x1="16.53124" stroke="#000" fill="none"/>
   <path id="svg_9" d="m16.59374,14.68746l2.4375,-2" opacity="undefined" stroke="#000" fill="none"/>
  </g>
  <g id="svg_15">
   <path id="svg_11" d="m4.53126,19.12495" opacity="NaN" stroke="#000" fill="#fff"/>
   <line id="svg_12" y2="18.74996" x2="19.03124" y1="18.87496" x1="4.90626" stroke="#000" fill="none"/>
   <line id="svg_13" y2="18.74996" x2="19.03124" y1="16.62496" x1="16.65624" stroke="#000" fill="none"/>
   <path id="svg_14" d="m16.71874,20.74995l2.4375,-2" opacity="undefined" stroke="#000" fill="none"/>
  </g>
                </svg>`
        },

        {
          id: 'efficiency',
          title: 'Investigating Efficiency',
          subtitle: 'Energy transfers and wasted energy',
          description: 'Investigate the efficiency of a motor',
          page: 'efficiency.html',
          available: false,
          accent: 'navy-accent',
          iconClass: 'navy-icon',
          btnClass: 'navy-btn',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                 <ellipse ry="3.99999" rx="3.99999" id="svg_16" cy="12.5625" cx="12.8125" stroke="#000" fill="none"/>
  <g stroke="null" id="svg_20">
   <line stroke="#000" id="svg_17" y2="12.58912" x2="7.6416" y1="12.58912" x1="0.71877" fill="none"/>
   <line stroke="#000" id="svg_19" y2="12.73611" x2="7.40626" y1="14.88889" x1="4.96876" fill="none"/>
   <line stroke="#000" id="svg_21" y2="10.23611" x2="5.03126" y1="12.38889" x1="7.40626" fill="none"/>
  </g>
  <g stroke="null" id="svg_25">
   <line stroke="#000" id="svg_22" y2="12.57553" x2="21.70408" y1="12.57553" x1="18.09374" fill="none"/>
   <line stroke="#000" id="svg_23" y2="12.64749" x2="21.58135" y1="13.70139" x1="20.31016" fill="none"/>
   <line stroke="#000" id="svg_24" y2="11.42361" x2="20.34276" y1="12.47751" x1="21.58135" fill="none"/>
  </g>
                </svg>`
        },

        {
          id: 'snakey-diagrams',
          title: 'Sankey Diagrams',
          subtitle: 'Representing Energy Transfers',
          description: "Explore Sankey Diagrams for a variety of different scenarios.",
          page: 'sankey-diagrams.html',
          available: false,
          accent: 'teal-accent',
          iconClass: 'teal-icon',
          btnClass: 'teal-btn',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                   <line id="svg_26" y2="18.93746" x2="1.71876" y1="5.99997" x1="1.65626" stroke="#000" fill="none"/>
  <line id="svg_28" y2="6.37497" x2="19.96874" y1="6.24997" x1="1.71876" stroke="#000" fill="none"/>
  <line id="svg_33" y2="12.37497" x2="20.03124" y1="12.37497" x1="13.84375" stroke="#000" fill="none"/>
  <line id="svg_34" y2="18.56246" x2="13.78125" y1="18.74996" x1="1.71876" stroke="#000" fill="none"/>
  <path stroke="#000" id="svg_36" d="m13.46875,18.49996c1.92707,-0.04166 3.97915,1.72917 4.03123,3.62501" opacity="NaN" fill="none"/>
  <path stroke="#000" id="svg_37" d="m13.90625,12.43747c1.92707,-0.04166 6.91665,4.16667 7.59373,9.3125" opacity="NaN" fill="none"/>
  <g stroke="null" id="svg_42">
   <line stroke="#000" id="svg_38" y2="21.85431" x2="21.34773" y1="21.87466" x1="23.05283" fill="none"/>
   <line stroke="#000" id="svg_39" y2="21.74741" x2="23.05244" y1="24.48969" x1="19.06063" fill="none"/>
   <path stroke="#000" id="svg_40" d="m15.41574,21.75055l3.79393,2.61455" opacity="undefined" fill="none"/>
   <line stroke="#000" id="svg_41" y2="21.87779" x2="15.52578" y1="21.89726" x1="17.15675" fill="none"/>
  </g>
  <g transform="rotate(-89.1193 21.5653 9.47558)" stroke="null" id="svg_47">
   <line stroke="#000" id="svg_43" y2="7.40466" x2="24.83777" y1="7.43799" x1="27.47794" fill="none"/>
   <line stroke="#000" id="svg_44" y2="7.22954" x2="27.47734" y1="11.72161" x1="21.29642" fill="none"/>
   <path stroke="#000" id="svg_45" d="m15.65268,7.23468l5.87452,4.28284" opacity="undefined" fill="none"/>
   <line stroke="#000" id="svg_46" y2="7.44311" x2="15.82307" y1="7.475" x1="18.34846" fill="none"/>
  </g>
                </svg>`
        },

       

        
      ]
    }
  },
  methods: {
    launchSimulation(page) {
      if (!page) return
      const url = `/GCSE/simulations/energy/${page}`
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

    // scroll helpers preserved from your original file
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

/* show visually-disabled state for card when not available */
.card--disabled {
  opacity: 0.98;
}

/* Responsive design */
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
