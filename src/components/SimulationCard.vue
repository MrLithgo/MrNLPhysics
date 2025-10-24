<template>
  <div class="simulation-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
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
  </div>
</template>

<script>
export default {
  name: 'SimulationCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    iconComponent: {
      type: Object,
      required: true
    }
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
        category: this.category
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
}

.simulation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

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

.card-icon.forces {
  background-color: rgba(44, 62, 80, 0.1);
}

.card-icon.forces svg {
  color: var(--navy);
}

.card-icon.electricity {
  background-color: rgba(241, 196, 15, 0.1);
}

.card-icon.electricity svg {
  color: var(--gold);
}

.card-icon.waves {
  background-color: rgba(26, 188, 156, 0.1);
}

.card-icon.waves svg {
  color: var(--teal);
}

.card-icon.energy {
  background-color: rgba(44, 62, 80, 0.1);
}

.card-icon.energy svg {
  color: var(--navy);
}

.card-icon.matter {
  background-color: rgba(241, 196, 15, 0.1);
}

.card-icon.matter svg {
  color: var(--gold);
}

.card-icon.magnetism {
  background-color: rgba(26, 188, 156, 0.1);
}

.card-icon.magnetism svg {
  color: var(--teal);
}

.card-icon.radioactivity {
  background-color: rgba(44, 62, 80, 0.1);
}

.card-icon.radioactivity svg {
  color: var(--navy);
}

.card-icon.astrophysics {
  background-color: rgba(241, 196, 15, 0.1);
}

.card-icon.astrophysics svg {
  color: var(--gold);
}

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
</style>