<template>
  <div
    class="simulation-card"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="button"
    tabindex="0"
    @keydown.enter.prevent="handleCardClick"
    @click="handleCardClick"
    :aria-disabled="!available"
  >
    <div class="card-icon" :class="category">
      <component :is="iconComponent" />
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <a href="#" class="card-link" @click.prevent="handleCardClick">
        Launch simulations
        <svg class="link-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>

    <!-- Overlay for unavailable cards -->
    <div v-if="!available" class="card-overlay" aria-hidden="true">
      <div class="overlay-badge">Coming soon</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimulationCard',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    iconComponent: { type: Object, required: true },
    // new prop to control availability
    available: { type: Boolean, default: true }
  },
  data() {
    return {
      isHovered: false
    }
  },
  methods: {
    handleCardClick() {
      // include available in payload so parent can handle differently if desired
      this.$emit('card-clicked', {
        title: this.title,
        category: this.category,
        available: this.available
      })
    }
  }
}
</script>

<style scoped>
.simulation-card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  display: block;
}

.simulation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* content styles kept as you had them */
.card-icon {
  height: 192px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  height: 96px;
  width: 96px;
}

/* category colour rules preserved */
/* ... keep your existing .card-icon.* rules ... */

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 20px;
  margin-bottom: 8px;
}

.card-description {
  color: var(--slate);
  margin-bottom: 16px;
}

.card-link {
  display: inline-flex;
  align-items: center;
  color: var(--teal);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
}

.card-link:hover {
  color: rgba(26, 188, 156, 0.8);
}

.link-icon {
  height: 16px;
  width: 16px;
  margin-left: 8px;
}

/* Overlay styles */
.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: start;
  justify-content: end;
  padding: 12px;
  /* subtle whitening and blur */
  background: rgba(255,255,255,0.6);
  backdrop-filter: grayscale(1) blur(2px);
  pointer-events: none; /* allow clicks to pass through to the card (so your current alert still shows) */
}

/* If you want to block clicks entirely instead, uncomment the next selector and remove pointer-events above:
.simulation-card--disabled { pointer-events: none; }
*/

.overlay-badge {
  background: rgba(0,0,0,0.65);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .2px;
}
</style>
