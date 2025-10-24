<template>
  <div class="gcse-forces-page">
    <header class="page-header">
      <div class="container">
        <h1>GCSE Forces and Motion</h1>
        <p>Interactive simulations to help you master physics concepts</p>
      </div>
    </header>

    <div class="container main-content">
      <div class="quote-card">
        <p class="quote-text">"In physics, you don't have to go around making trouble for yourself - nature does it for you."</p>
        <p class="quote-author">- Frank Wilczek</p>
      </div>

      
        
        
      <div class="cards-grid">

        <!-- Card Trolley Ramp -->
        <div class="card">
          <div class="card-accent teal-accent"></div>
          <div class="card-content">
            <div class="card-icon teal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
                <rect transform="rotate(23.7214 10.053 8.68634)" height="5.31243" width="12.2991" y="6.03012" x="3.90342" fill="none"/>
                <line y2="21.09329" x2="22.78111" y1="11.63025" x1="1.2189" fill="none"/>
                <ellipse ry="1.71873" rx="1.71873" cy="10.62468" cx="5.68759" fill="#ffffff"/>
                <ellipse ry="1.71873" rx="1.71873" cy="13.12465" cx="11.50001" fill="#ffffff"/>
              </svg>
            </div>
            <h2>Investigating Motion</h2>
            <h3>Trolley and Ramp</h3>
            <p>In this investigation you use light gates to measure the speed of a trolley moving down a ramp.</p>
           <button @click="launchSimulation('trolley-ramp.html')" class="btn teal-btn">
            Launch Simulation
          </button>
          </div>
        </div>

        <!-- Card Friction -->
        <div class="card">
          <div class="card-accent navy-accent"></div>
          <div class="card-content">
            <div class="card-icon navy-icon">
              <svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <rect x="6.28" y="7.51" width="16.75" height="8.5"/>
                <polyline points="17.58,17.52 0.99,17.51 3.14,15.07 "/>
                <line x1="3.03" y1="19.92" x2="1.06" y2="17.68"/>
              </svg>
            </div>
            <h2>Investigating Friction</h2>
            <h3>Forces in Action</h3>
            <p>Test different surfaces and materials to understand the factors that affect friction.</p>
            <button @click="launchSimulation('friction.html')" class="btn navy-btn">
            Launch Simulation
          </button>
        </div>
        </div>
        

        <!-- Card second-law -->
        <div class="card">
          <div class="card-accent coral-accent"></div>
          <div class="card-content">
            <div class="card-icon coral-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 25 25" stroke="currentColor">
                <circle cx="7.5" cy="12.5" r="5" fill="none" stroke-width="1.5"/>
                <line x1="13" y1="12.5" x2="22.5" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
              </svg>
            </div>
            <h2>Newton's Second Law</h2>
            <h3>F = ma</h3>
            <p>Manipulate force and mass to observe changes in acceleration and verify Newton's Second Law.</p>
            <button @click="launchSimulation('second-law.html')" class="btn coral-btn">Launch Simulation</button>
          </div>
        </div>

        <!-- Card stopping-distance -->
        <div class="card">
          <div class="card-accent navy-accent"></div>
          <div class="card-content">
            <div class="card-icon navy-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="4.98" y="10" width="14.84" height="6.52"/>
                <rect x="7.2" y="3.58" width="10.25" height="6.25"/>
                <rect x="5.4" y="16.67" width="2.5" height="4.24"/>
                <rect x="16.65" y="16.67" width="2.5" height="4.24"/>
                <circle cx="8.24" cy="13.08" r="1"/>
                <circle cx="16.49" cy="13.08" r="1"/>
              </svg>
            </div>
            <h2>Stopping Distance</h2>
            <h3>Thinking & Braking</h3>
            <p>Investigate factors affecting stopping distance including speed, reaction time, and road conditions.</p>
           <button @click="launchSimulation('stopping-distance.html')" class="btn navy-btn">Launch Simulation</button>
          </div>
        </div>

        <!-- Card 5 -->
        <div class="card">
          <div class="card-accent teal-accent"></div>
          <div class="card-content">
            <div class="card-icon teal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="1.39" y1="1.56" x2="23.83" y2="1.49"/>
                <polyline points="12.67,1.57 12.7,6.77 17.62,8.3 8.74,10.95 17.73,14.26 8.47,17.88 13.25,20.02 13.38,23.07 "/>
              </svg>
            </div>
            <h2>Core Practical 2</h2>
            <h3>Force and Extension</h3>
            <p>Explore Hooke's Law by testing springs and elastic materials under different loads.</p>
            <button @click="simulationAlert('Core Practical 2 - Investigating Force and Extension')" class="btn teal-btn">Launch Simulation</button>
          </div>
        </div>

        <!-- Card 6 -->
        <div class="card">
          <div class="card-accent gold-accent"></div>
          <div class="card-content">
            <div class="card-icon gold-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="8.16" cy="9.77" r="3.12"/>
                <circle cx="10.91" cy="17.02" r="3.12"/>
                <polyline points="10.3,7.5 14.08,4.1 10.81,3.61 "/>
                <line x1="14.13" y1="4.45" x2="14.35" y2="7.24"/>
                <polyline points="14.4,18.79 19.02,20.89 18.16,17.69 "/>
                <line x1="18.73" y1="21.08" x2="16.26" y2="22.39"/>
              </svg>
            </div>
            <h2>Momentum - Separate Physics Only</h2>
            <h3>Conservation Laws</h3>
            <p>Investigate collisions and conservation of momentum with interactive simulations of elastic and inelastic collisions.</p>
            <button @click="simulationAlert('Momentum')" class="btn gold-btn">Launch Simulation</button>
          </div>
        </div>
        
        <!-- Card 7 -->
        <div class="card">
          <div class="card-accent gold-accent"></div>
          <div class="card-content">
            <div class="card-icon gold-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="1" y1="11" x2="24" y2="11" />
                <line x1="12.5" y1="11" x2="11" y2="16" />
                <line x1="12.5" y1="11" x2="14" y2="16" />
                <line x1="22" y1="11" x2="22" y2="16" />
                <line x1="20" y1="14" x2="22" y2="16" />
                <line x1="24" y1="14" x2="22" y2="16" />
                <line x1="7" y1="11" x2="7" y2="19" />
                <line x1="5" y1="17" x2="7" y2="19" />
                <line x1="9" y1="17" x2="7" y2="19" />
                <line x1="11" y1="16" x2="14" y2="16" />
              </svg>
            </div>
            <h2>Moments - Separate Physics Only</h2>
            <h3>Turning Forces</h3>
            <p>Investigate the Principle of Moments by adding different masses to a balance beam.</p>
            <button @click="simulationAlert('Moments')" class="btn gold-btn">Launch Simulation</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GCSEForces',
  
  methods: {
    launchSimulation(page) {
      window.open(`/GCSE/simulations/${page}`, '_blank', 'noopener,noreferrer');
    },
    
    simulationAlert(simName) {
      alert(`${simName} simulation coming soon!`);
    }
  },
  
  // Add these lifecycle hooks for scrolling
  mounted() {
    this.scrollToTop();
  },
  
  activated() {
    // This runs when using keep-alive
    this.scrollToTop();
  },
  
  methods: {
    scrollToTop() {
      // Multiple methods to ensure it works
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Force scroll if still not at top
        if (window.scrollY > 0 || document.documentElement.scrollTop > 0) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 50);
    },
    
    launchSimulation(page) {
      window.open(`/GCSE/simulations/${page}`, '_blank', 'noopener,noreferrer');
    },
    
    simulationAlert(simName) {
      alert(`${simName} simulation coming soon!`);
    }
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