<template>
  <div class="quiz-selection">
    <header class="site-header">
      <div class="header-inner">
        <div class="site-title">SimplyPhys</div>
        <h1 class="page-title">Physics Quizzes</h1>
        <p class="page-sub">Choose a topic to test your knowledge</p>
      </div>
    </header>

    <main class="main">
      <div class="cards-grid">
        <article
          v-for="quiz in availableQuizzes"
          :key="quiz.id"
          class="card"
          :class="{ 'card--disabled': !quiz.available }"
          @click="onQuizSelect(quiz)"
          role="button"
          :aria-disabled="!quiz.available"
          tabindex="0"
          @keydown.enter.prevent="onQuizSelect(quiz)"
        >
          <div :class="['card-accent', quiz.accentColor]"></div>

          <div class="card-content">
            <QuizLogo
              :icon-id="quiz.iconId"
              size="medium"
              :class="quiz.iconClass"
              class="card-icon"
            />

            <h2>{{ quiz.title }}</h2>
            <h3>{{ quiz.subtitle }}</h3>
            <p>{{ quiz.description }}</p>

            <div class="card-actions">
              <button
                v-if="quiz.available"
                @click.stop.prevent="startQuiz(quiz)"
                class="btn"
                :class="quiz.buttonClass"
              >
                Start Quiz
              </button>

              <button
                v-else
                @click.stop.prevent="notifyComingSoon(quiz)"
                class="btn"
                :class="quiz.buttonClass"
                aria-disabled="true"
              >
                Coming soon
              </button>
            </div>
          </div>

          <div v-if="!quiz.available" class="card-overlay" aria-hidden="true">
            <div class="overlay-badge">Coming soon</div>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script>
import { getAvailableQuizzes } from '@/data/quizConfig'
import QuizLogo from './QuizLogo.vue'

export default {
  name: 'QuizSelection',
  components: { QuizLogo },
  data() {
    return {
      availableQuizzes: [],
    }
  },
  mounted() {
    this.availableQuizzes = getAvailableQuizzes()
  },
  methods: {
    onQuizSelect(quiz) {
      if (!quiz.available) return
      this.startQuiz(quiz)
    },
    startQuiz(quiz) {
      this.$emit('quiz-selected', quiz.id)
    },
    notifyComingSoon(quiz) {
      alert(`${quiz.title} quiz is coming soon!`)
    },
  },
  emits: ['quiz-selected'],
}
</script>

<style scoped>
.quiz-selection {
  min-height: 100vh;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 16px;
}

.card {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.card:hover:not(.card--disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-accent {
  height: 4px;
  width: 100%;
}

.teal-accent {
  background: var(--teal);
}
.navy-accent {
  background: var(--navy);
}
.coral-accent {
  background: var(--coral);
}
.gold-accent {
  background: var(--gold);
}

.card-content {
  padding: 24px;
  text-align: center;
}

.card-icon {
  margin: 0 auto 16px;
}

.teal-icon :deep(svg) {
  color: var(--teal);
}
.navy-icon :deep(svg) {
  color: var(--navy);
}
.coral-icon :deep(svg) {
  color: var(--coral);
}
.gold-icon :deep(svg) {
  color: var(--gold);
}

.card h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--navy);
  margin: 0 0 4px;
}

.card h3 {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--slate);
  margin: 0 0 12px;
  font-weight: 500;
}

.card p {
  font-size: 0.875rem;
  color: var(--slate);
  line-height: 1.5;
  margin: 0 0 20px;
}

.card-actions {
  margin-top: auto;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
}

.teal-btn {
  background: var(--teal);
}
.navy-btn {
  background: var(--navy);
}
.coral-btn {
  background: var(--coral);
}
.gold-btn {
  background: var(--gold);
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-badge {
  background: var(--slate);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
