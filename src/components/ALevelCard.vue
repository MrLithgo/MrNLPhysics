<template>
  <div
    class="alevel-card"
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

    <div v-if="!available" class="card-overlay" aria-hidden="true">
      <div class="overlay-badge">Coming soon</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ALevelCard',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    topics: { type: Array, required: true },
    category: { type: String, required: true },
    iconComponent: { type: Object, required: true },
    available: { type: Boolean, default: true } // new prop
  },
  data() {
    return {
      isHovered: false
    }
  },
  methods: {
    handleCardClick() {
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
.alevel-card {
  cursor: pointer;
  position: relative;
  background-color: var(--softgray);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  display: block;
}

.alevel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.alevel-card .card-icon {
  height: 192px;
}

.alevel-card .card-icon svg {
  height: 160px;
  width: 160px;
}

/* category styles preserved... */

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

/* Reuse same overlay styles as SimulationCard */
.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: start;
  justify-content: end;
  padding: 12px;
  background: rgba(255,255,255,0.6);
  backdrop-filter: grayscale(1) blur(2px);
  pointer-events: none;
}

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
