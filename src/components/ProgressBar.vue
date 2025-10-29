<template>
  <div class="progress-container">
    <div class="progress-top">
      <span>Question {{ currentQuestion + 1 }}/{{ totalQuestions }}</span>
      <span>Score: {{ score }}</span>
    </div>
    <div class="progress-track" :class="{ small: size === 'small' }">
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
    </div>
    <div v-if="showCount && size === 'small'" class="final-count">
      {{ score }} correct out of {{ totalQuestions }} questions
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    currentQuestion: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['normal', 'small'].includes(value)
    },
    showCount: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    progressWidth() {
      if (this.size === 'small') {
        return `${(this.score / this.totalQuestions) * 100}%`;
      }
      return `${((this.currentQuestion + 1) / this.totalQuestions) * 100}%`;
    }
  }
}
</script>

<style scoped>
.progress-container { margin-bottom: 16px; }
.progress-top { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 14px; 
  color: var(--slate); 
  margin-bottom: 8px; 
}
.progress-track {
  width: 100%;
  background: #e9eef2;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
}
.progress-track.small { height: 12px; margin-bottom: 6px; }
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--teal) 0%, #16a085 100%);
  transition: width 0.45s ease;
}
.final-count { 
  font-size: 13px;
  color: var(--slate);
  margin-top: 8px;
  text-align: center;
}
</style>
