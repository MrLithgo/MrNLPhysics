<template>
  <div class="alevel-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
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
  name: 'ALevelCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    topics: {
      type: Array,
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
.alevel-card {
  cursor: pointer;
}
.alevel-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

.alevel-card {
    background-color: var(--softgray);
    border-radius: 8px;
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
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

.alevel-card .card-icon.mechanics {
    background-color: rgba(44, 62, 80, 0.1);
}

.alevel-card .card-icon.mechanics svg {
    color: var(--navy);
}

.alevel-card .card-icon.unit2 {
    background-color: rgba(241, 196, 15, 0.1);
}

.alevel-card .card-icon.unit2 svg {
    color: var(--gold);
}

.alevel-card .card-icon.particle {
    background-color: rgba(241, 196, 15, 0.1);
}

.alevel-card .card-icon.particle svg {
    color: var(--gold);
}

.alevel-card .card-icon.unit5 {
    background-color: rgba(241, 196, 15, 0.1);
}

.alevel-card .card-icon.unit5 svg {
    color: var(--gold);
}
</style>