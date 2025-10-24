<template>
  <div class="topic-grid">
    <div class="topics-container">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="topic-card"
        @click="navigateToTopic(topic)"
      >
        <div class="topic-icon" :class="topic.icon">
          <component :is="topic.iconComponent" />
        </div>
        <div class="topic-content">
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.description }}</p>
          <div class="topic-meta">
            <span class="simulation-count">{{ topic.simulationCount }} simulations</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopicGrid',
  props: {
    topics: {
      type: Array,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  },
  methods: {
    navigateToTopic(topic) {
      // Check if this topic uses external (vanilla JS) simulations
      if (topic.externalLink) {
        // Navigate to external HTML page for vanilla JS simulations
        window.location.href = topic.externalLink
      } else {
        // Navigate to Vue-based topic page for future Vue simulations
        this.$router.push({
          name: 'Topic',
          params: {
            subject: this.subject,
            topic: topic.id
          }
        })
      }
    }
  }
}
</script>