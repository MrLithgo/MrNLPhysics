<template>
  <div class="gcse-view">
    <div class="container">
      <div class="page-header">
        <h1>GCSE Physics Simulations</h1>
        <p>Interactive simulations covering the complete GCSE Physics curriculum</p>
      </div>
      
      <TopicGrid
        :topics="gcseTopics"
        subject="gcse"
      />
    </div>
  </div>
</template>

<script>
import TopicGrid from '@/components/TopicGrid.vue'

export default {
  name: 'GCSE',
  components: {
    TopicGrid
  },
  data() {
    return {
      gcseTopics: [
        {
          id: 'forces-motion',
          title: 'Forces and Motion',
          description: 'Newton\'s laws, momentum, kinematics',
          icon: 'ForcesIcon',
          simulationCount: 8,
          externalLink: '/gcse/simulations/forces-motion/index.html'
        },
        {
          id: 'electricity',
          title: 'Electricity',
          description: 'Circuits, current, voltage, resistance',
          icon: 'ElectricityIcon',
          simulationCount: 6,
          externalLink: '/gcse/simulations/electricity/index.html'
        },
        // ... more topics
      ]
    }
  }
}
</script>