<template>
  <div class="alevel-card" @click="handleCardClick">
    <div class="card-icon" :class="category">
      <div v-html="iconSvg"></div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description }}</p>
      <ul class="card-list">
        <li v-for="topic in topics" :key="topic">{{ topic }}</li>
      </ul>
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
    iconSvg: {
      type: String,
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
</style>