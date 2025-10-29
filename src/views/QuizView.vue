<template>
  <div class="quiz-view">
    <QuizSelection 
      v-if="currentQuizId === null" 
      @quiz-selected="loadQuiz" 
    />
    <QuizRunner 
      v-else
      :quiz-config="currentQuizConfig"
      @return-to-selection="returnToSelection"
    />
  </div>
</template>

<script>
import { getQuizConfig } from '@/data/quizConfig'
import QuizSelection from '@/components/QuizSelection.vue'
import QuizRunner from '@/components/QuizRunner.vue'

export default {
  name: 'QuizView',
  components: { QuizSelection, QuizRunner },
  data() {
    return {
      currentQuizId: null
    }
  },
  computed: {
    currentQuizConfig() {
      return getQuizConfig(this.currentQuizId)
    }
  },
  methods: {
    loadQuiz(quizId) {
      this.currentQuizId = quizId
    },
    returnToSelection() {
      this.currentQuizId = null
    }
  }
}
</script>
