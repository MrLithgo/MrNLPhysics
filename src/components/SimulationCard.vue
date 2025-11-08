<template>
  <div
    class="simulation-card"
    :class="{ 'is-disabled': !available }"
    @click="handleCardClick"
    role="button"
    tabindex="0"
    @keydown.enter.prevent="handleCardClick"
  >
    <div class="card-icon" :class="category">
      <component :is="iconComponent" />
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <a href="#" class="card-link" @click.prevent="handleCardClick"> Launch simulations </a>
    </div>

    <!-- overlay: only visible when available === false -->
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
    iconComponent: { type: [Object, Function], required: true },

    available: { type: Boolean, default: true },
  },
  mounted() {
    console.log(`${this.title} available:`, this.available)
  },
  methods: {
    handleCardClick() {
      if (!this.available) {
        window.dispatchEvent(
          new CustomEvent('ui-notify', {
            detail: {
              type: 'modal',
              title: 'Coming soon',
              message: `${this.title} is coming soon.`,
            },
          })
        )
        return
      }

      // otherwise bubble up to parent for routing
      this.$emit('card-clicked', {
        title: this.title,
        category: this.category,
      })
    },
  },
}
</script>

<style scoped>
.simulation-card {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.is-disabled {
  opacity: 0.95;
}
.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px) grayscale(1);
  pointer-events: auto;
}
.overlay-badge {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
}
</style>
